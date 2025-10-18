const API_BASE_URL = "";
class ApiService {
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    };
    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || data.error || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async submitQuoteRequest(data) {
    return this.makeRequest("/api/quote", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async checkHealth() {
    return this.makeRequest("/api/health");
  }
  async login(email, password) {
    const url = "/api/auth/login";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 1e4);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          const error = new Error(data.error || "Rate limited");
          error.code = "RATE_LIMITED";
          error.retryAfterSeconds = data.retryAfterSeconds;
          error.remainingAttempts = data.remainingAttempts;
          error.resetTime = data.resetTime;
          throw error;
        }
        if (response.status === 401) {
          const error = new Error(data.error || "Invalid credentials");
          error.code = "INVALID_CREDENTIALS";
          throw error;
        }
        if (response.status === 403) {
          const error = new Error(data.error || "Access denied");
          error.code = "FORBIDDEN";
          throw error;
        }
        const errorMessage = data.message || data.error || "Login failed";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = new Error("Login request timed out. Please check your connection and try again.");
        timeoutError.code = "TIMEOUT";
        throw timeoutError;
      }
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = new Error("Network error. Please check your connection and try again.");
        networkError.code = "NETWORK_ERROR";
        throw networkError;
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }
  async register(email, password, name, phone) {
    const url = "/api/auth/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, name, phone })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          const error = new Error(data.error || "Rate limited");
          error.code = "RATE_LIMITED";
          error.retryAfterSeconds = data.retryAfterSeconds;
          error.remainingAttempts = data.remainingAttempts;
          error.resetTime = data.resetTime;
          throw error;
        }
        if (response.status === 400) {
          const errorMessage2 = data.message || data.error || "Registration failed";
          const error = new Error(errorMessage2);
          error.code = "VALIDATION_ERROR";
          throw error;
        }
        const errorMessage = data.message || data.error || "Registration failed";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  }
  async getUsers(status) {
    const endpoint = status && status !== "all-users" ? `/api/admin/users?status=${status}` : "/api/admin/users";
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return this.makeRequest(endpoint, {
      headers
    });
  }
  async getPendingApplications() {
    const url = "/api/admin/pending-applications";
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        headers
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async approveApplication(applicationId, approvedSlug, adminNotes, serviceAreas) {
    const url = `/api/admin/approve-application/${applicationId.toString()}`;
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          approved_slug: approvedSlug,
          admin_notes: adminNotes,
          ...serviceAreas && serviceAreas.length > 0 && { service_areas: serviceAreas }
        })
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async rejectApplication(applicationId, rejectionReason, adminNotes) {
    const url = `/api/admin/reject-application/${applicationId.toString()}`;
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          rejection_reason: rejectionReason,
          admin_notes: adminNotes
        })
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async deleteAffiliate(affiliateId) {
    const url = `/api/admin/tenants/${affiliateId.toString()}`;
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        method: "DELETE",
        headers
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
}
const apiService = new ApiService();

export { apiService as a };
//# sourceMappingURL=api-BcBw9jk9.js.map
