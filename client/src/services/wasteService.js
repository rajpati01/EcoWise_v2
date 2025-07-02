import { apiService } from './api';

class WasteService {
  async classifyWaste(imageFile) {
    return apiService.uploadFile('/waste-classifications', imageFile);
  }

  async getClassifications() {
    return apiService.get('/waste-classifications');
  }

  async getDisposalCenters() {
    return apiService.get('/disposal-centers');
  }
}

export const wasteService = new WasteService();
