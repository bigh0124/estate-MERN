import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hasUsername = await User.findOne({ username });
    if (hasUsername) return next(createError(401, "username has been used!"));
    const hasEmail = await User.findOne({ email });
    if (hasEmail) return next(createError(401, "email has been used!"));
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json("User has been created");
  } catch (err) {
    next(createError(err));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(createError(404, "Wrong credentials"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(createError(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...info } = validUser._doc;
    res.cookie("access_token", token, { httpOnly: true }, { maxAge: 86400000 }).status(200).json(info);
  } catch (err) {
    next(err);
  }
};
