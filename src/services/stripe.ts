// src/services/stripe.ts
import { paymentsApi } from "./api";
import type { CreateCheckoutDto, UpdateUserPackageDto } from "./api";

// Stripe service - Web only (Hosted Checkout)
export const stripeService = {
  // Redirect to Stripe Checkout (Web - New Purchase)
  redirectToCheckout: async (data: CreateCheckoutDto): Promise<void> => {
    try {
      const response = await paymentsApi.createCheckout(data);
      window.location.href = response.url;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      throw error;
    }
  },

  // Redirect to Update Checkout (Web - Upgrade/Extend)
  redirectToUpdateCheckout: async (
    data: UpdateUserPackageDto,
  ): Promise<void> => {
    try {
      const response = await paymentsApi.createUpdateCheckout(data);
      window.location.href = response.url;
    } catch (error) {
      console.error("Failed to create update checkout session:", error);
      throw error;
    }
  },

  // Handle payment success (optional - you can call this from success page)
  handlePaymentSuccess: async (sessionId: string) => {
    try {
      const response = await paymentsApi.getPaymentSuccess(sessionId);
      return response;
    } catch (error) {
      console.error("Failed to get payment success:", error);
      throw error;
    }
  },

  // Handle payment cancel (optional)
  handlePaymentCancel: async () => {
    try {
      const response = await paymentsApi.getPaymentCancel();
      return response;
    } catch (error) {
      console.error("Failed to get payment cancel:", error);
      throw error;
    }
  },
};

// Helper functions (keep these - they are useful)
export const formatPrice = (
  amount: number,
  currency: string = "aud",
): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

export const formatPriceFromDecimal = (
  amount: number,
  currency: string = "aud",
): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

export const getPriceInCents = (amount: number): number => {
  return Math.round(amount * 100);
};

export default stripeService;
