import Blog from "../models/Blog.js";

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    const newBlog = new Blog({
      title,
      excerpt,
      content,
      authorName: req.user.name || "Unknown",
      authorId: req.user._id, // from protect middleware
      status: "pending",
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs, optionally filter by status
export const getBlogs = async (req, res) => {
  try {
    const status = req.query.status || "";
    let query = {};
    if (status) query.status = status;
    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blogs created by the authenticated user
// This is used in the Profile page to show user's blogs
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id }); // or createdBy
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// get blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findOne({ _id: id });
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
};

// Approve blog (admin only)
export const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    blog.status = "approved";
    await blog.save();
    res.json({ message: "Blog approved", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject blog (admin only)
export const rejectBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    blog.status = "rejected";
    await blog.save();
    res.json({ message: "Blog rejected", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
