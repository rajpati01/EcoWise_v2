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

router.get('/admin', protect, isAdmin, getAllBlogsForAdmin);

// User blogs
router.get('/my', protect, getUserBlogs);

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Authenticated routes
router.post('/', protect, createBlog);
router.post('/:id/comments', protect, addComment);
router.post('/:id/like', protect, likeBlog);

// Admin routes
router.post('/:id/approve', protect, isAdmin, approveBlog);
router.post('/:id/reject', protect, isAdmin, rejectBlog);

export default router;