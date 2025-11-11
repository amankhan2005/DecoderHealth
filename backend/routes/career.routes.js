import express from "express";
import uploadResume from "../middleware/uploadResume.js";
import { applyCareerForm } from "../controllers/career.controllers.js";

const router = express.Router();

/**
 * @route   POST /api/career/apply
 * @desc    Handle career form submission (with resume upload)
 * @access  Public
 */
router.post("/apply", uploadResume.single("resume"), applyCareerForm);

export default router;
