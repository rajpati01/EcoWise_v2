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

// Add this debug route
router.get('/debug', async (req, res) => {
  try {
    // Get all blogs regardless of status
    const allBlogs = await Blog.find();
    
    // Count by status
    const pending = allBlogs.filter(blog => blog.status === 'pending').length;
    const approved = allBlogs.filter(blog => blog.status === 'approved').length;
    const rejected = allBlogs.filter(blog => blog.status === 'rejected').length;
    
    res.json({
      success: true,
      counts: {
        total: allBlogs.length,
        pending,
        approved,
        rejected
      },
      blogs: allBlogs.map(blog => ({
        id: blog._id,
        title: blog.title,
        status: blog.status,
        author: blog.authorName,
        createdAt: blog.createdAt
      }))
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

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