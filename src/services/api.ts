// import axios from "axios";
// import type { AxiosInstance, AxiosResponse } from "axios";

// // API base configuration
// const API_BASE_URL = "https://gbs.westsidecarcare.com.au";

// // Create axios instance with default config
// const api: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     // For testing, allow requests without auth token
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized - remove token and redirect to login
//       localStorage.removeItem("auth_token");
//       console.log("Auth token removed, redirecting to login");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

// // API Response types
// export interface ApiResponse<T = any> {
//   data: T;
//   message?: string;
//   status: number;
// }

// export interface Role {
//   _id: string;
//   name: string;
//   label?: string;
//   price: number;
//   description?: string;
//   features?: string[];
//   permissions?: Array<{
//     permission: {
//       _id: string;
//       name: string;
//       label: string;
//     };
//     value: boolean | number;
//     _id: string;
//   }>;
// }

// export interface CreateUserPackageDto {
//   role: string;
//   startDate: string;
//   months: number;
//   trial?: boolean;
// }

// export interface UpdateUserPackageDto {
//   role?: string;
//   months?: number;
//   startDate?: string;
//   trial?: boolean;
// }

// export interface CreateCheckoutDto {
//   roleId: string;
//   months?: number;
//   trial?: boolean;
// }

// export interface CreateCheckoutResponseDto {
//   sessionId: string;
//   url: string;
//   message: string;
// }

// export interface CreatePaymentIntentResponseDto {
//   clientSecret: string;
//   paymentIntentId: string;
// }

// export interface SuccessResponseDto {
//   message: string;
//   sessionId: string;
// }

// export interface CancelResponseDto {
//   message: string;
// }

// // Roles API
// export const rolesApi = {
//   // Get all available roles/plans
//   getAllRoles: async (): Promise<Role[]> => {
//     const response = await api.get("/roles");
//     return response.data;
//   },

//   // Get single role by ID
//   getRoleById: async (id: string): Promise<Role> => {
//     const response = await api.get(`/roles/${id}`);
//     return response.data;
//   },
// };

// // Payments API
// export const paymentsApi = {
//   // Create Stripe Checkout session (Web)
//   createCheckout: async (
//     data: CreateCheckoutDto,
//   ): Promise<CreateCheckoutResponseDto> => {
//     const response = await api.post("/payment/checkout", data);
//     return response.data;
//   },

//   // Create PaymentIntent (Mobile)
//   createPaymentIntent: async (
//     data: CreateCheckoutDto,
//   ): Promise<CreatePaymentIntentResponseDto> => {
//     const response = await api.post("/payment/create-payment-intent", data);
//     return response.data;
//   },

//   // Create Update Checkout session (Web)
//   createUpdateCheckout: async (
//     data: UpdateUserPackageDto,
//   ): Promise<CreateCheckoutResponseDto> => {
//     const response = await api.post("/payment/update-checkout", data);
//     return response.data;
//   },

//   // Create Update PaymentIntent (Mobile)
//   createUpdatePaymentIntent: async (
//     data: UpdateUserPackageDto,
//   ): Promise<CreatePaymentIntentResponseDto> => {
//     const response = await api.post("/payment/update-payment-intent", data);
//     return response.data;
//   },

//   // Get payment success page
//   getPaymentSuccess: async (sessionId: string): Promise<SuccessResponseDto> => {
//     const response = await api.get(`/payment/success?session_id=${sessionId}`);
//     return response.data;
//   },

//   // Get payment cancel page
//   getPaymentCancel: async (): Promise<CancelResponseDto> => {
//     const response = await api.get("/payment/cancel");
//     return response.data;
//   },
// };

// // User Package API
// export const userPackageApi = {
//   // Get user's active package
//   getActivePackage: async (): Promise<any> => {
//     const response = await api.get("/user-package/active");
//     return response.data;
//   },

//   // Get user's package history
//   getPackageHistory: async (): Promise<any[]> => {
//     const response = await api.get("/user-package/history");
//     return response.data;
//   },

//   // Create new package for user
//   createPackage: async (data: CreateUserPackageDto): Promise<any> => {
//     const response = await api.post("/user-package", data);
//     return response.data;
//   },

//   // Update existing package
//   updatePackage: async (
//     id: string,
//     data: UpdateUserPackageDto,
//   ): Promise<any> => {
//     const response = await api.put(`/user-package/${id}`, data);
//     return response.data;
//   },
// };

// // Auth API (placeholder - implement based on your auth system)
// export const authApi = {
//   // Login
//   login: async (credentials: {
//     email: string;
//     password: string;
//   }): Promise<{ token: string; user: any }> => {
//     const response = await api.post("/auth/login", credentials);
//     return response.data;
//   },

//   // Register
//   register: async (userData: any): Promise<{ token: string; user: any }> => {
//     const response = await api.post("/auth/register", userData);
//     return response.data;
//   },

//   // Get current user
//   getCurrentUser: async (): Promise<any> => {
//     const response = await api.get("/auth/me");
//     return response.data;
//   },

//   // Logout
//   logout: async (): Promise<void> => {
//     await api.post("/auth/logout");
//     localStorage.removeItem("auth_token");
//   },
// };

// export default api;
// src/services/api.ts
import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// API base configuration
const API_BASE_URL = "https://gbs.westsidecarcare.com.au";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      console.log("Auth token removed, redirecting to login");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ==================== TYPES ====================

export interface Role {
  _id: string;
  name: string;
  label?: string;
  price: number;
  description?: string;
  features?: string[];
  permissions?: Array<{
    permission: {
      _id: string;
      name: string;
      label: string;
    };
    value: boolean | number;
    _id: string;
  }>;
}

export interface CreateUserPackageDto {
  role: string;
  startDate: string;
  months: number;
  trial?: boolean;
}

export interface UpdateUserPackageDto {
  role?: string;
  months?: number;
  startDate?: string;
  trial?: boolean;
}

export interface CreateCheckoutDto {
  roleId: string;
  months?: number;
  trial?: boolean;
}

export interface CreateCheckoutResponseDto {
  sessionId: string;
  url: string;
  message: string;
}

export interface SuccessResponseDto {
  message: string;
  sessionId: string;
}

export interface CancelResponseDto {
  message: string;
}

// ==================== API SERVICES ====================

// Roles API
export const rolesApi = {
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get("/roles");
    return response.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },
};

// Payments API - Web only (Hosted Checkout)
export const paymentsApi = {
  // Create new package payment
  createCheckout: async (
    data: CreateCheckoutDto,
  ): Promise<CreateCheckoutResponseDto> => {
    const response = await api.post("/payment/checkout", data);
    return response.data;
  },

  // Update/upgrade/extend package payment
  createUpdateCheckout: async (
    data: UpdateUserPackageDto,
  ): Promise<CreateCheckoutResponseDto> => {
    const response = await api.post("/payment/update-checkout", data);
    return response.data;
  },

  // Success page data (optional)
  getPaymentSuccess: async (sessionId: string): Promise<SuccessResponseDto> => {
    const response = await api.get(`/payment/success?session_id=${sessionId}`);
    return response.data;
  },

  // Cancel page data (optional)
  getPaymentCancel: async (): Promise<CancelResponseDto> => {
    const response = await api.get("/payment/cancel");
    return response.data;
  },
};

// User Package API
export const userPackageApi = {
  getActivePackage: async (): Promise<any> => {
    const response = await api.get("/user-package/active");
    return response.data;
  },

  getPackageHistory: async (): Promise<any[]> => {
    const response = await api.get("/user-package/history");
    return response.data;
  },

  createPackage: async (data: CreateUserPackageDto): Promise<any> => {
    const response = await api.post("/user-package", data);
    return response.data;
  },

  updatePackage: async (
    id: string,
    data: UpdateUserPackageDto,
  ): Promise<any> => {
    const response = await api.put(`/user-package/${id}`, data);
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: any }> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: any): Promise<{ token: string; user: any }> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("auth_token");
  },
};

export default api;
