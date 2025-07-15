import { apiService } from "./api";

class BlogService {
  async getBlogs(status) {
    return apiService.get(`/blogs?status=${status}`);
  }

  async getBlog(id) {
    return apiService.get(`/blogs/${id}`);
  }

  // Get blogs created by the authenticated user
  // This is used in the Profile page to show user's blogs
  async getMyBlogs() {
    return apiService.get("/blogs/my");
  }

  async createBlog(blogData) {
    return apiService.post("/blogs", blogData);
  }

  async updateBlog(id, blogData) {
    return apiService.put(`/blogs/${id}`, blogData);
  }

  async deleteBlog(id) {
    return apiService.delete(`/blogs/${id}`);
  }

  async getComments(blogId) {
    return apiService.get(`/blogs/${blogId}/comments`);
  }

  async addComment(blogId, content) {
    return apiService.post(`/blogs/${blogId}/comments`, { content });
  }

  // Admin functions
  async approveBlog(id) {
    return apiService.post(`/admin/blogs/${id}/approve`);
  }

  async rejectBlog(id) {
    return apiService.post(`/admin/blogs/${id}/reject`);
  }
}

export const blogService = new BlogService();
