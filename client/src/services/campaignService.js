import { apiService } from './api';

class CampaignService {
  async getCampaigns(status = 'approved') {
    return apiService.get(`/campaigns?status=${status}`);
  }

  async getCampaign(id) {
    return apiService.get(`/campaigns/${id}`);
  }

  async createCampaign(campaignData) {
    return apiService.post('/campaigns', campaignData);
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

  // Admin functions
  async approveCampaign(id) {
    return apiService.post(`/admin/campaigns/${id}/approve`);
  }

  async rejectCampaign(id) {
    return apiService.post(`/admin/campaigns/${id}/reject`);
  }
}

export const campaignService = new CampaignService();
