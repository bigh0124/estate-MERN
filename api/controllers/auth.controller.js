import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { createError } from "../utils/error.js";

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
    const { password, ...savedUser } = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(createError(err));
  }
};
