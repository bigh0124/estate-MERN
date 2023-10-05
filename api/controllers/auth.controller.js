import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(401).send(err.message);
  }
};
