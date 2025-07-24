import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }); //but this will include my hashed password as welll
  const { hashedPassword, ...detailsWithoutPassword } = user.toObject(); //this will remove the hashed password from the user object
  
  const followerCount = await Follow.countDocuments({ following: user._id });
  const followingCount = await Follow.countDocuments({ follower: user._id });

  const token = req.cookies.token;

  if (!token) {
    res.status(200).json({
      ...detailsWithoutPassword,
      followerCount,
      followingCount,
      isFollowing: false, //if we' re not authenticated, we can't see the follow button
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (!err) {
        const isExists = await Follow.exists({
          follower: payload.userId,
          following: user._id,
        });

        res.status(200).json({
          ...detailsWithoutPassword,
          followerCount,
          followingCount,
          isFollowing: isExists ? true : false,
        });
      }
    });
  }
};

export const registerUser = async (req, res) => {
  const { username, displayName, email, password } = req.body;
  if (!username || !email || !displayName || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const newhashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    displayName,
    email,
    hashedPassword: newhashedPassword,
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  const { hashedPassword, ...detailsWithoutPassword } = user.toObject(); //this will remove the hashed password from the user object
  res.status(201).json(detailsWithoutPassword);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // shd chk if the userId matches

  res.cookie("token", token, {
    httpOnly: true, //can' t chnge it using javascript, more secure
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
  });

  const { hashedPassword, ...detailsWithoutPassword } = user.toObject();

  res.status(200).json(detailsWithoutPassword);
};
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
export const followUser = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  const isFollowing = await Follow.exists({
    //chk if already following
    follower: req.userId,
    following: user._id, //to get userId, we ve to verify token first, so use that middleware
  });

  if (isFollowing) {
    //unfollow
    await Follow.deleteOne({ follower: req.userId, following: user._id });
  } else {
    await Follow.create({ follower: req.userId, following: user._id });
  }

  res.status(200).json({ message: "Successful" });
};