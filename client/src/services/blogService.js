import { apiService } from "./api";

class BlogService {
  async getBlogs(status = "") {
    try {
      let endpoint = "/blogs";

      if (status === "pending") {
        endpoint = `/blogs/admin?status=pending`; // Endpoint for pending blogs
      } else if (status === "rejected") {
        endpoint = `/blogs/admin?status=rejected`; // Endpoint for rejected blogs
      } else if (status === "all" || status === "") {
        // For admin dashboard "all blogs" section, get all blogs regardless of status
        endpoint = `/blogs/admin`; // Admin endpoint with no status filter
      }

      const response = await apiService.get(endpoint);

      if (response?.data?.data) return response.data.data;
      if (response?.data) return response.data;
      return response;
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

      // Handle different response structures with more detailed logging
      if (response?.data?.data && Array.isArray(response.data.data)) {
        console.log(
          "Found blogs in response.data.data:",
          response.data.data.length
        );
        return response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        console.log("Found blogs in response.data:", response.data.length);
        return response.data;
      } else if (Array.isArray(response)) {
        console.log("Response itself is array:", response.length);
        return response;
      } else if (response?.data?.success && response?.data?.data) {
        console.log("Found blogs in response.data.data with success property");
        return Array.isArray(response.data.data) ? response.data.data : [];
      }

      // Log the full response for debugging
      console.warn(
        "Unexpected blog response format. Full response:",
        JSON.stringify(response)
      );
      return [];
    } catch (error) {
      console.error("Error in getMyBlogs:", error.response || error);
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
