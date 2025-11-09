// routes/contact.routes.js
// Routes for handling Contact / Inquiry submissions (U.S. Autism Clinic)

import express from 'express';
import {
  createInquiry,
  getAllInquiry,
  deleteInquiry,
  getInquiryById, // optional (for single inquiry view)
} from '../controllers/contact.controllers.js';

const router = express.Router();

/**
 * @route POST /api/contact/save
 * @desc Create new inquiry / lead
 * @access Public
 */
router.post('/save', createInquiry);

/**
 * @route GET /api/contact/getall
 * @desc Get all inquiries (supports ?status= or ?leadSource= query params)
 * @access Admin
 */
router.get('/getall', getAllInquiry);

/**
 * @route GET /api/contact/:id
 * @desc Get single inquiry details (optional route)
 * @access Admin
 */
router.get('/:id', getInquiryById);

/**
 * @route DELETE /api/contact/delete/:id
 * @desc Delete an inquiry
 * @access Admin
 */
router.delete('/delete/:id', deleteInquiry);

export default router;
