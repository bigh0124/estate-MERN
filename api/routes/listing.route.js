import express from "express";
import verify from "../middleware/verifyToken.js";
import { createListing, deleteListing } from "../controllers/listing.controller.js";
const router = express.Router();

router.post("/create", verify, createListing);
router.delete("/delete/:id", verify, deleteListing);

export default router;
