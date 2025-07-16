import { apiService } from "./api";
const API_URL = import.meta.env.VITE_API_URL;
class WasteService {
  async classifyWaste(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const token = localStorage.getItem('token');

    // POST to backend, which will forward to FastAPI
    const response = await fetch("http://localhost:3001/api/waste/classify", {
      method: "POST",
      body: formData,
      credentials: "include", // Include cookies for auth
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if content-type is JSON before parsing
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Classification failed");
      return data;
    } else {
      // Non-JSON response
      throw new Error("Unexpected server response (not JSON)");
    }
  }

  async getClassifications() {
  const token = localStorage.getItem('token');
  const response = await fetch("http://localhost:3001/api/waste/classifications", {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to load classifications");
  }
  return response.json();
}

  async getDisposalCenters() {
    return apiService.get("/disposal-centers");
  }
}

export const wasteService = new WasteService();
