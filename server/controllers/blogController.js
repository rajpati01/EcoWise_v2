import Blog from "../models/Blog.js";
import updateEcoPoints from "../utils/ecoPointsHelper.js";

// Create a new blog post
// Update your blog creation controller to award EcoPoints
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, tags, authorName } = req.body;
    const userId = req.user._id;

    console.log(
      `User ${userId} (${req.user.firstName} ${req.user.lastName}) creating blog`
    );

    // Create the blog
    const blog = new Blog({
      title,
      excerpt,
      content,
      tags,
      authorId: userId,
      // Use firstName and lastName instead of name/username
      authorName:
        authorName ||
        `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() ||
        "Anonymous User",
      status: "pending",
    });

    const savedBlog = await blog.save();

    // MISSING CODE: Award EcoPoints for creating a blog
    const POINTS_FOR_BLOG_CREATION = 10; // Adjust based on your point system

    try {
      // Update or create EcoPoints record
      const ecoPointsUpdate = await EcoPoints.findOneAndUpdate(
        { userId: userId },
        {
          $inc: { points: POINTS_FOR_BLOG_CREATION },
          $push: {
            activities: {
              type: "blog_created",
              points: POINTS_FOR_BLOG_CREATION,
              timestamp: new Date(),
              referenceId: savedBlog._id,
            },
          },
        },
        { upsert: true, new: true }
      );

      console.log(
        `Awarded ${POINTS_FOR_BLOG_CREATION} EcoPoints to user ${userId}, new total: ${ecoPointsUpdate.points}`
      );

      // Update user's total points (if you store it there too)
      await User.findByIdAndUpdate(userId, {
        $inc: { ecoPoints: POINTS_FOR_BLOG_CREATION },
      });
    } catch (pointsError) {
      // Log error but don't fail the blog creation
      console.error("Error awarding EcoPoints:", pointsError);
    }

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs, optionally filter by status
export const getBlogs = async (req, res) => {
  try {
    const { status } = req.query;
    const isAdmin = req.user?.isAdmin || req.path.includes("/admin");

    let query = {};

    // Only filter by status if explicitly provided
    if (status) {
      query.status = status;
    }
    // For non-admin users, only show approved blogs by default
    else if (!isAdmin) {
      query.status = "approved";
    }
    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllBlogsForAdmin = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) query.status = status;

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .populate("authorId", "name username");

    // console.log(`Found ${blogs.length} blogs for admin`);

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs for admin:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get blogs created by the authenticated user
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      data: blogs,
    });
  } catch (err) {
    console.error("Error fetching user blogs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id })
      .populate("authorId", "username name profileImage")
      .populate({
        path: "comments.user",
        select: "username name profileImage",
      });

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve blog (admin only)
export const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    // Update blog status
    blog.status = "approved";
    await blog.save();

    // Award eco points to the author (25 points for publishing a blog)
    try {
      await updateEcoPoints(
        blog.authorId,
        "publish_blog",
        25, // Points for publishing a blog
        `Blog published: ${blog.title}`
      );
      console.log(
        `EcoPoints awarded to user ${blog.authorId} for publishing blog`
      );
    } catch (ecoPointsError) {
      console.error("Error awarding EcoPoints:", ecoPointsError);
      // Continue even if EcoPoints update fails
    }

    res.json({
      success: true,
      message: "Blog approved and EcoPoints awarded",
      data: blog,
    });
  } catch (error) {
    console.error("Error approving blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject blog (admin only)
export const rejectBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    blog.status = "rejected";
    await blog.save();

    res.json({
      success: true,
      message: "Blog rejected",
      data: blog,
    });
  } catch (error) {
    console.error("Error rejecting blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a comment to a blog
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Comment content is required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Only allow comments on approved blogs
    if (blog.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Cannot comment on a blog that is not approved",
      });
    }

    const comment = {
      user: req.user._id,
      content,
      createdAt: new Date(),
    };

    blog.comments = blog.comments || [];
    blog.comments.push(comment);
    await blog.save();

    // Award eco points for commenting (5 points)
    try {
      await updateEcoPoints(
        req.user._id,
        "comment_blog",
        5, // Points for commenting
        `Commented on blog: ${blog.title}`
      );
      console.log(
        `EcoPoints awarded to user ${req.user._id} for commenting on blog`
      );
    } catch (ecoPointsError) {
      console.error("Error awarding EcoPoints for comment:", ecoPointsError);
      // Continue even if EcoPoints update fails
    }

    // Populate user info before returning
    const populatedBlog = await Blog.findById(id)
      .populate("authorId", "username name profileImage")
      .populate({
        path: "comments.user",
        select: "username name profileImage",
      });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: populatedBlog,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like a blog
export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Only allow likes on approved blogs
    if (blog.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Cannot like a blog that is not approved",
      });
    }

    // Initialize likes array if it doesn't exist
    blog.likes = blog.likes || [];

    // Check if user already liked the blog
    const alreadyLiked = blog.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Unlike the blog
      blog.likes = blog.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
      await blog.save();

      return res.json({
        success: true,
        message: "Blog unliked successfully",
        data: { likes: blog.likes.length, liked: false },
      });
    } else {
      // Like the blog
      blog.likes.push(userId);
      await blog.save();

      return res.json({
        success: true,
        message: "Blog liked successfully",
        data: { likes: blog.likes.length, liked: true },
      });
    }
  } catch (error) {
    console.error("Error liking/unliking blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
