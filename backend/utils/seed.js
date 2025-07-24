import User from "../models/user.model.js";
import Pin from "../models/pin.model.js";
import Board from "../models/board.model.js";
import Comment from "../models/comment.model.js";
import bcrypt from "bcryptjs";
import connectDB from "./connectDB.js";

connectDB();

const seedDB = async () => {
  await User.deleteMany({});
  await Pin.deleteMany({});
  await Board.deleteMany({});
  await Comment.deleteMany({});

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = new User({
      displayName: `User ${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      hashedPassword: hashedPassword,
      img: `https://picsum.photos/id/${i}/200/200`,
    });
    users.push(await user.save());
  }

  const boards = [];
  for (const user of users) {
    for (let i = 1; i <= 10; i++) {
      const board = new Board({
        title: `Board ${i} of ${user.username}`,
        user: user._id,
      });
      boards.push(await board.save());
    }
  }

  const pins = [];
  for (const user of users) {
    const userBoards = boards.filter(
      (board) => board.user.toString() === user._id.toString()
    );
    // for (let i = 1; i <= 10; i++) {
    //   const mediaSize = Math.random() < 0.5 ? "800/1200" : "800/600";
    //   const pin = new Pin({
    //     media: `https://picsum.photos/id/${i + 10}/${mediaSize}`,
    //     width: 800,
    //     height: mediaSize === "800/1200" ? 1200 : 600,
    //     title: `Pin ${i} by ${user.username}`,
    //     description: `This is pin ${i} created by ${user.username}`,
    //     link: `https://example.com/pin${i}`,
    //     board: userBoards[i - 1]._id,
    //     tags: [`tag${i}`, "sample", user.username],
    //     user: user._id,
    //   });
    //   pins.push(await pin.save());
    // }

    

    const pin1 = new Pin({
      media: "/pins/pin1.jpg",
      width: 800,
      height: 1200,
      title: `Pin 1 by ${user.username}`,
      description: `This is pin 1 created by ${user.username}`,
      link: "https://example.com/pin1",
      board: userBoards[0]._id,
      tags: ["tag1", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin1.save());

    const pin2 = new Pin({
      media: "/pins/pin2.jpg",
      width: 800,
      height: 600,
      title: `Pin 2 by ${user.username}`,
      description: `This is pin 2 created by ${user.username}`,
      link: "https://example.com/pin2",
      board: userBoards[1]._id,
      tags: ["tag2", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin2.save());

    const pin3 = new Pin({
      media: "/pins/pin3.jpg",
      width: 800,
      height: 1200,
      title: `Pin 3 by ${user.username}`,
      description: `This is pin 3 created by ${user.username}`,
      link: "https://example.com/pin3",
      board: userBoards[2]._id,
      tags: ["tag3", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin3.save());

    // ... repeat similarly for pin4 to pin10

    const pin4 = new Pin({
      media: "/pins/pin4.jpg",
      width: 800,
      height: 600,
      title: `Pin 4 by ${user.username}`,
      description: `This is pin 4 created by ${user.username}`,
      link: "https://example.com/pin4",
      board: userBoards[3]._id,
      tags: ["tag4", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin4.save());

    const pin5 = new Pin({
      media: "/pins/pin5.jpg",
      width: 800,
      height: 1200,
      title: `Pin 5 by ${user.username}`,
      description: `This is pin 5 created by ${user.username}`,
      link: "https://example.com/pin5",
      board: userBoards[4]._id,
      tags: ["tag5", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin5.save());

    const pin6 = new Pin({
      media: "/pins/pin6.jpg",
      width: 800,
      height: 600,
      title: `Pin 6 by ${user.username}`,
      description: `This is pin 6 created by ${user.username}`,
      link: "https://example.com/pin6",
      board: userBoards[5]._id,
      tags: ["tag6", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin6.save());

    const pin7 = new Pin({
      media: "/pins/pin7.jpg",
      width: 800,
      height: 1200,
      title: `Pin 7 by ${user.username}`,
      description: `This is pin 7 created by ${user.username}`,
      link: "https://example.com/pin7",
      board: userBoards[6]._id,
      tags: ["tag7", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin7.save());

    const pin8 = new Pin({
      media: "/pins/pin8.jpg",
      width: 800,
      height: 600,
      title: `Pin 8 by ${user.username}`,
      description: `This is pin 8 created by ${user.username}`,
      link: "https://example.com/pin8",
      board: userBoards[7]._id,
      tags: ["tag8", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin8.save());

    const pin9 = new Pin({
      media: "/pins/pin9.jpg",
      width: 800,
      height: 1200,
      title: `Pin 9 by ${user.username}`,
      description: `This is pin 9 created by ${user.username}`,
      link: "https://example.com/pin9",
      board: userBoards[8]._id,
      tags: ["tag9", "sample", user.username],
      user: user._id,
    });
    pins.push(await pin9.save());

    const pin10 = new Pin({
      media: "/pins/pin10.jpg",
      width: 800,
      height: 600,
      title: `Pin 10 by ${user.username}`,
      description: `This is pin 10 created by ${user.username}`,
      link: "https://example.com/pin10",
      board: userBoards[9]._id,
      tags: ["tag10", "sample", user.username],
      user: user._id,
    });
    
    pins.push(await pin10.save());
  }

  for (const user of users) {
    for (let i = 1; i <= 10; i++) {
      const randomPin = pins[Math.floor(Math.random() * pins.length)];
      const comment = new Comment({
        description: `Comment ${i} by ${user.username}: This is a great pin!`,
        pin: randomPin._id,
        user: user._id,
      });
      await comment.save();
    }
  }

  console.log("Database seeded successfully!");
  process.exit(0);
};

seedDB().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});