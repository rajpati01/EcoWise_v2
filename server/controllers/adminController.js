import Campaign from '../models/Campaign.js';
// import Blog from '../models/Blog.js';

// Approve Campaign
export const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    campaign.status = 'approved';
    await campaign.save();

    res.json({ message: 'Campaign approved', campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Campaign
export const rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    campaign.status = 'rejected';
    await campaign.save();

    res.json({ message: 'Campaign rejected', campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// approve blogs
export const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'approved';
    await blog.save();

    res.json({ message: 'Blog approved', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reject blogs
export const rejectBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'rejected';
    await blog.save();

    res.json({ message: 'Blog rejected', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
