const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"; //

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      options.body &&
      typeof options.body === "object" &&
      !(options.body instanceof FormData)
    ) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return response;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return this.request(endpoint, {
    method: "POST",
    body: data,
    headers,
  });
}

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append("file", file);

    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    const token = localStorage.getItem("token");

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return this.request(endpoint, {
      method: "POST",
      body: formData,
      headers: {}, // Let browser handle it
    });
  }
}

export const apiService = new ApiService();
