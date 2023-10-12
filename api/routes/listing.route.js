import express from "express";
import verify from "../middleware/verifyToken.js";
import { createListing } from "../controllers/listing.controller.js";
const router = express.Router();

router.post("/create", verify, createListing);

export default router;
