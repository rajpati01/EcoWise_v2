import { apiService } from './api';

class WasteService {
  async classifyWaste(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile); // FastAPI expects 'file' not 'image'

    const response = await fetch(`${import.meta.env.VITE_AI_API_URL}/api/classify`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Classification failed");
    }

    return await response.json();
  }

  async getClassifications() {
    return apiService.get('/waste-classifications');
  }

  async getDisposalCenters() {
    return apiService.get('/disposal-centers');
  }
}

export const wasteService = new WasteService();
