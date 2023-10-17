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

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(createError(404, "listing not found"));
    if (listing.userRef !== req.user.id) return next(createError(403, "You can only update your own listing"));
    const newListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(newListing);
  } catch (err) {
    next(err);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(createError(404, "listing not found"));
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};
