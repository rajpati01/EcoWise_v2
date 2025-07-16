import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createBlog,
  getBlogs,
  approveBlog,
  rejectBlog,
  getBlogById,
  getUserBlogs 
} from '../controllers/blogController.js';
import  isAdmin  from '../middleware/admin.js';

const router = express.Router();

// Authenticated user can create a blog
router.get('/my', protect, getUserBlogs);

// Public
router.get('/', getBlogs);

// Get blog by ID
router.get('/:id', getBlogById);

// Authenticated
router.post('/', protect, createBlog);

// Admin routes to approve or reject blogs
router.post('/:id/approve', protect, isAdmin, approveBlog);
router.post('/:id/reject', protect, isAdmin, rejectBlog);

export default router;
