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

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined) {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined) {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined) {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
