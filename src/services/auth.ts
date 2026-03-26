import { authApi } from "./api";

// Authentication service
// Initialize auth token for testing
export const initializeTestAuth = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWM0Yzk2NWU0ZGNjMzdlOWFkYWI0M2IiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOlt7Im5hbWUiOiJkaXJlY3RvcnlfYWNjZXNzX2Z1bGwiLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoibWVzc2FnaW5nXzF0bzFfdW5saW1pdGVkIiwidmFsdWUiOnRydWV9LHsibmFtZSI6Im5vdGlmaWNhdGlvbl9jdXN0b20iLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoiZ3JvdXBfcGFydGljaXBhdGlvbl9mdWxsIiwidmFsdWUiOnRydWV9LHsibmFtZSI6Im5ldHdvcmtpbmdfYnVzaW5lc3MiLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoiYW5hbHl0aWNzX2Jhc2ljIiwidmFsdWUiOnRydWV9LHsibmFtZSI6InN1cHBvcnRfcHJpb3JpdHkiLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoibWVtYmVyc2hpcF9waW5faGF0IiwidmFsdWUiOmZhbHNlfSx7Im5hbWUiOiJnaWZ0X2JveCIsInZhbHVlIjp0cnVlfSx7Im5hbWUiOiJzcG9ydHNfY29tcGV0aXRpb25zIiwidmFsdWUiOnRydWV9LHsibmFtZSI6ImRyaW5rc19lZGl0X3ZpcCIsInZhbHVlIjp0cnVlfSx7Im5hbWUiOiJldmVudF90aWNrZXRzIiwidmFsdWUiOjF9LHsibmFtZSI6Im1lbWJlcl9pbnRyb2R1Y3Rpb25zIiwidmFsdWUiOjB9LHsibmFtZSI6InRhaWxvcmVkX2V2ZW50cyIsInZhbHVlIjowfSx7Im5hbWUiOiJnZW9yZ2Vfc2FtaW9zX2FjY2VzcyIsInZhbHVlIjpmYWxzZX1dLCJpYXQiOjE3NzQ1MjUzODd9.M0XV43RRK-KCvCudmyPbGKSR3qdM5UWbyghIWg-Hrr0";

  if (!localStorage.getItem("auth_token")) {
    localStorage.setItem("auth_token", token);
    console.log("Test auth token initialized");
  }
};

export const authService = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      // Store token in localStorage
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // Register user
  register: async (userData: any) => {
    try {
      const response = await authApi.register(userData);

      // Store token in localStorage
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/login";
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: () => {
    // For testing, return hardcoded token if no token exists
    const existingToken = localStorage.getItem("auth_token");
    if (!existingToken) {
      const hardcodedToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWM0Yzk2NWU0ZGNjMzdlOWFkYWI0M2IiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOlt7Im5hbWUiOiJkaXJlY3RvcnlfYWNjZXNzX2Z1bGwiLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoibWVzc2FnaW5nXzF0bzFfdW5saW1pdGVkIiwidmFsdWUiOnRydWV9LHsibmFtZSI6Im5vdGlmaWNhdGlvbl9jdXN0b20iLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoiZ3JvdXBfcGFydGljaXBhdGlvbl9mdWxsIiwidmFsdWUiOnRydWV9LHsibmFtZSI6Im5ldHdvcmtpbmdfYnVzaW5lc3MiLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoiYW5hbHl0aWNzX2Jhc2ljIiwidmFsdWUiOnRydWV9LHsibmFtZSI6InN1cHBvcnRfcHJpb3JpdHkiLCJ2YWx1ZSI6dHJ1ZX0seyJuYW1lIjoibWVtYmVyc2hpcF9waW5faGF0IiwidmFsdWUiOmZhbHNlfSx7Im5hbWUiOiJnaWZ0X2JveCIsInZhbHVlIjp0cnVlfSx7Im5hbWUiOiJzcG9ydHNfY29tcGV0aXRpb25zIiwidmFsdWUiOnRydWV9LHsibmFtZSI6ImRyaW5rc19lZGl0X3ZpcCIsInZhbHVlIjp0cnVlfSx7Im5hbWUiOiJldmVudF90aWNrZXRzIiwidmFsdWUiOjF9LHsibmFtZSI6Im1lbWJlcl9pbnRyb2R1Y3Rpb25zIiwidmFsdWUiOjB9LHsibmFtZSI6InRhaWxvcmVkX2V2ZW50cyIsInZhbHVlIjowfSx7Im5hbWUiOiJnZW9yZ2Vfc2FtaW9zX2FjY2VzcyIsInZhbHVlIjpmYWxzZX1dLCJpYXQiOjE3NzQ1MjUzODd9.M0XV43RRK-KCvCudmyPbGKSR3qdM5UWbyghIWg-Hrr0";
      localStorage.setItem("auth_token", hardcodedToken);
      console.log("Hardcoded auth token set for testing");
      return hardcodedToken;
    }
    return existingToken;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("auth_token");
    return !!token;
  },

  // Update user data
  updateUser: (userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
  },

  // Initialize auth state
  initializeAuth: () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // You could validate token here if needed
      return true;
    }
    return false;
  },
};

export default authService;
