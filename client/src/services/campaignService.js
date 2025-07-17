import { apiService } from "./api";

class CampaignService {
  async getCampaigns(status = "approved") {
    return apiService.get(`/campaigns?status=${status}`);
  }

  async getCampaign(id) {
    return apiService.get(`/campaigns/${id}`);
  }

  // Fetch campaigns where the user is a participant
  async getMyCampaigns() {
    return apiService.get("/campaigns/my");
  }

  async createCampaign(campaignData) {
    return apiService.post("/campaigns", campaignData);
  }

  async updateCampaign(id, campaignData) {
    return apiService.put(`/campaigns/${id}`, campaignData);
  }

  async deleteCampaign(id) {
    return apiService.delete(`/campaigns/${id}`);
  }

  async joinCampaign(id) {
    return apiService.post(`/campaigns/${id}/join`);
  }

  async getJoinedCampaigns() {
    try {
      const response = await apiService.get("/campaigns/joined");
      // console.log("Joined campaigns API response status:", response.status);

      // Check if response has data
      if (response && response.data) {
        console.log("API response successful:", response.data);
        return response.data;
      }

      // Use the fallback - fetch all campaigns and filter
      return this.getJoinedCampaignsFallback();
    } catch (error) {
      console.log("API call failed, using fallback:", error.message);
      return this.getJoinedCampaignsFallback();
    }
  }

  // Add this helper method to handle the fallback logic
  async getJoinedCampaignsFallback() {
    try {
      const allCampaigns = await this.getCampaigns();
      const userId = localStorage.getItem("userId"); // Assuming you store user ID

      if (!userId || !allCampaigns) {
        return [];
      }

      // Filter campaigns where user is a participant
      return allCampaigns.filter((campaign) => {
        if (!campaign.participants || !Array.isArray(campaign.participants)) {
          return false;
        }

        // Check different participant formats
        if (campaign.participants.length > 0 && campaign.participants[0].user) {
          return campaign.participants.some(
            (p) => p.user && (p.user === userId || p.user.toString() === userId)
          );
        } else {
          return campaign.participants.some(
            (id) => id && (id === userId || id.toString() === userId)
          );
        }
      });
    } catch (error) {
      return [];
    }
  }
  // Admin functions
  async approveCampaign(id) {
    return apiService.post(`/admin/campaigns/${id}/approve`);
  }

  async rejectCampaign(id) {
    return apiService.post(`/admin/campaigns/${id}/reject`);
  }
}

export const campaignService = new CampaignService();
