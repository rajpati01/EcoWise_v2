import { apiService } from "./api";

class BlogService {
  async getBlogs(status = "") {
    try {
      // Use the dedicated admin endpoint
      const endpoint = `/blogs/admin${status ? `?status=${status}` : ""}`;
      const response = await apiService.get(endpoint);

      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
  }

  async getBlogById(id) {
    try {
      console.log(`Fetching blog with ID: ${id}`);
      const response = await apiService.get(`/blogs/${id}`);

      console.log("Blog detail API response:", response);

      // Handle different response structures
      if (response?.data?.data) return response.data.data;
      if (response?.data) return response.data;
      return response;
    } catch (error) {
      console.error(`Error fetching blog ${id}:`, error);
      throw error;
    }
  }
  
  // Get blogs created by the authenticated user
  // This is used in the Profile page to show user's blogs
  async getMyBlogs() {
    try {
      const response = await apiService.get("/blogs/my");

      // Handle nested response structures
      if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else if (
        response?.success &&
        response?.data &&
        Array.isArray(response.data)
      ) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }

      // Fallback for unknown structure
      console.warn("Unexpected blog response format:", response);
      return [];
    } catch (error) {
      console.error("Error fetching user blogs:", error);
      return [];
    }
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
