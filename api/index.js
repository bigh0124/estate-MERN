import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }
};

const app = express();

app.use("/api/user", userRouter);

app.listen(3000, () => {
  connect();
  console.log("Server is running on port 3000");
});
