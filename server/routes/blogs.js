import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createBlog,
  getBlogs,
  approveBlog,
  rejectBlog,
  getBlogById,
  getUserBlogs,
  addComment,
  likeBlog,
  getAllBlogsForAdmin
} from '../controllers/blogController.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Admin routes should come first to avoid route conflicts
// This is important - the /admin route must be before /:id
router.get('/admin', protect, isAdmin, getAllBlogsForAdmin);

// User blogs
router.get('/my', protect, getUserBlogs);

// Public routes
router.get('/:id', getBlogById);
router.get('/', getBlogs);

// Authenticated routes
router.post('/', protect, createBlog);
router.post('/:id/comments', protect, addComment);
router.post('/:id/like', protect, likeBlog);

// Admin actions
router.post('/:id/approve', protect, isAdmin, approveBlog);
router.post('/:id/reject', protect, isAdmin, rejectBlog);

export default router;