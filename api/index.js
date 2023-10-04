import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.listen(3000, () => {
  connect();
  console.log("Server is running on port 3000");
});
