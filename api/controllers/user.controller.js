import { createError } from "../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
export const test = (req, res) => {
  res.send("test");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(createError(401, "You can only update your own profile"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...info } = updatedUser._doc;
    res.status(200).json(info);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(createError(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).clearCookie("access_token").send("Account has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(createError(401, "Unauthorized"));
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};
