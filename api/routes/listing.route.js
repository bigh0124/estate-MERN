import express from "express";
import verify from "../middleware/verifyToken.js";
import { createListing, deleteListing, getListing, updateListing } from "../controllers/listing.controller.js";
const router = express.Router();

router.post("/create", verify, createListing);
router.delete("/delete/:id", verify, deleteListing);
router.put("/update/:id", verify, updateListing);
router.get("/fetchListing/:id", getListing);
export default router;
