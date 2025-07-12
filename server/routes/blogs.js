import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createBlog,
  getBlogs,
  approveBlog,
  rejectBlog
} from '../controllers/blogController.js';
import  isAdmin  from '../middleware/admin.js';

const router = express.Router();

// Public
router.get('/', getBlogs);

// Authenticated
router.post('/', protect, createBlog);

// Admin routes to approve or reject blogs
router.post('/:id/approve', protect, isAdmin, approveBlog);
router.post('/:id/reject', protect, isAdmin, rejectBlog);

export default router;
