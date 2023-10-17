import Listing from "../models/listing.model.js";
import { createError } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing.userRef !== req.user.id) return next(createError(403, "You can only delete your own listing"));
    await listing.deleteOne();
    res.status(200).json("Listing has been deleted!");
  } catch (err) {
    next(err);
  }
};
