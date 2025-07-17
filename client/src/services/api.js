const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

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
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!response.ok) {
        let errorMessage;

        // Try to parse error as JSON
        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage =
              errorData.message || `HTTP error! status: ${response.status}`;
            console.error("API Error Response (JSON):", errorData);
          } catch (jsonError) {
            // If JSON parsing fails, try to get text
            const errorText = await response.text();
            console.error("API Error Response (Text):", errorText);
            errorMessage = `HTTP error! status: ${response.status}. Response is not valid JSON`;
          }
        } else {
          // Not JSON, get as text
          const errorText = await response.text();
          console.error("API Error Response (Text):", errorText);
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      // Handle JSON response
      if (isJson) {
        try {
          const data = await response.json();
          return data;
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
          console.log("Raw response text:", await response.clone().text());
          throw new Error("Invalid JSON response from server");
        }
      }

      // Handle non-JSON response
      const data = await response.text();
      console.log(
        "API Response (Text):",
        data.substring(0, 200) + (data.length > 200 ? "..." : "")
      );
      return data;
    } catch (error) {
      console.error(`API request to ${url} failed:`, error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
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
      headers, // Let browser set content-type for FormData
    });
  }

  // Debug methods to help with troubleshooting
  testConnection(endpoint = "/health") {
    console.log(`Testing API connection to ${this.baseURL}${endpoint}`);
    return this.get(endpoint)
      .then((data) => {
        console.log("API connection test successful:", data);
        return { success: true, data };
      })
      .catch((error) => {
        console.error("API connection test failed:", error);
        return { success: false, error: error.message };
      });
  }
}

export const apiService = new ApiService();
