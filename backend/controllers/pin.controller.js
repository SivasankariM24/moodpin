import Pin from "../models/pin.model.js";
import User from "../models/user.model.js";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import Board from "../models/board.model.js";
import sharp from "sharp";
import Imagekit from "imagekit";
import jwt from "jsonwebtoken";

export const getPins = async (req, res) => {
  try {
    const pageNumber = Number(req.query.cursor) || 0; //cursor is the name of the query parameter
    const search = req.query.search || "";
    const userId = req.query.userId || "";
    const boardId = req.query.boardId || "";
    const LIMIT = 21;
    const pins = await Pin.find(
      search
        ? {
            $or: [
              //either in post title or post text
              { title: { $regex: search, $options: "i" } }, //using regex to serach for the substring in the title and 'i' for case insensitive
              { tags: { $in: [search] } }, //searching for the substring in the tags array
            ],
          }
        : userId
        ? { user: userId }
        : boardId
        ? { board: boardId }
        : {}
    )
      .limit(LIMIT)
      .skip(pageNumber * LIMIT); //skips the first (pageNumber * LIMIT) pins

    const hasNextPage = pins.length === LIMIT; //hasNextPage is false if the number of pins returned is less than the limit
    res
      .status(200)
      .json({ pins, nextCursor: hasNextPage ? pageNumber + 1 : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPin = async (req, res) => {
  const { id } = req.params;
  const pin = await Pin.findById(id).populate(
    "user",
    "username img displayName" //for single-page, u gonna need these user data
  );
console.log("Fetched Pin:", pin); 
  res.status(200).json(pin);
};


export const createPin = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      board,
      tags,
      textOptions,
      canvasOptions,
      newBoard,
    } = req.body;

    const media = req.files?.media;

    if (!title || !description || !media) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const parsedTextOptions = JSON.parse(textOptions || "{}");
    const parsedCanvasOptions = JSON.parse(canvasOptions || "{}");

    const metadata = await sharp(media.data).metadata();

    const originalOrientation =
      metadata.width < metadata.height ? "portrait" : "landscape";
    const originalAspectRatio = metadata.width / metadata.height;

    let clientAspectRatio;
    let width = metadata.width;
    let height;

    if (parsedCanvasOptions.size !== "original") {
      const [w, h] = parsedCanvasOptions.size.split(":").map(Number);
      clientAspectRatio = w / h;
    } else {
      clientAspectRatio =
        parsedCanvasOptions.orientation === originalOrientation
          ? originalAspectRatio
          : 1 / originalAspectRatio;
    }

    height = width / clientAspectRatio;

    const imagekit = new Imagekit({
      publicKey: process.env.IK_PUBLIC_KEY,
      privateKey: process.env.IK_PRIVATE_KEY,
      urlEndpoint: process.env.IK_URL_ENDPOINT,
    });

    const textLeftPosition = Math.round((parsedTextOptions.left * width) / 375);
    const textTopPosition = Math.round(
      (parsedTextOptions.top * height) / parsedCanvasOptions.height
    );

    let croppingStrategy = "";
    if (parsedCanvasOptions.size !== "original") {
      if (originalAspectRatio > clientAspectRatio) {
        croppingStrategy = ",cm-pad_resize";
      }
    } else {
      if (
        originalOrientation === "landscape" &&
        parsedCanvasOptions.orientation === "portrait"
      ) {
        croppingStrategy = ",cm-pad_resize";
      }
    }

    const transformationString = `w-${width},h-${height}${croppingStrategy},bg-${parsedCanvasOptions.backgroundColor.substring(
      1
    )}${
      parsedTextOptions.text
        ? `,l-text,i-${parsedTextOptions.text},fs-${
            parsedTextOptions.fontSize * 2.1
          },lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(
            1
          )},l-end`
        : ""
    }`;

    const uploadResponse = await imagekit.upload({
      file: media.data, // file buffer
      fileName: media.name,
      folder: "test",
      transformation: {
        pre: transformationString,
      },
    });

    let newBoardId;
    if (newBoard) {
      const boardDoc = await Board.create({
        title: newBoard,
        user: req.userId,
      });
      newBoardId = boardDoc._id;
    }

    const newPin = await Pin.create({
      user: req.userId,
      title,
      description,
      link: link || null,
      board: newBoardId || board || null,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      media: uploadResponse.filePath,
      width: uploadResponse.width,
      height: uploadResponse.height,
    });

    return res.status(201).json(newPin);
  } catch (error) {
    console.error("Create Pin Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const interactionCheck = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;

  const likeCount = await Like.countDocuments({ pin: id });

  if (!token) {
    return res.status(200).json({ likeCount, isLiked: false, isSaved: false });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res
        .status(200)
        .json({ likeCount, isLiked: false, isSaved: false }); //if not authenticated, liked and saved will not be visible
    }

    const userId = payload.userId;

    const isLiked = await Like.findOne({
      user: userId,
      pin: id,
    });
    const isSaved = await Save.findOne({
      user: userId,
      pin: id,
    });

    return res.status(200).json({
      likeCount,
      isLiked: isLiked ? true : false,
      isSaved: isSaved ? true : false,
    });
  });
};

export const interact = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  //type is either like or save
  
  if (type === "like") {
    const isLiked = await Like.findOne({
      pin: id,
      user: req.userId,
    });

    if (isLiked) {
      await Like.deleteOne({
        pin: id,
        user: req.userId,
      });
    } else {
      await Like.create({
        pin: id,
        user: req.userId,
      });
    }
  } else {
    const isSaved = await Save.findOne({
      pin: id,
      user: req.userId,
    });

    if (isSaved) {
      await Save.deleteOne({
        pin: id,
        user: req.userId,
      });
    } else {
      await Save.create({
        pin: id,
        user: req.userId,
      });
    }
  }

  return res.status(200).json({ message: "Successful" });
};