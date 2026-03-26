import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { paymentsApi } from "./api";
import type { CreateCheckoutDto, UpdateUserPackageDto } from "./api";

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

// Get Stripe instance
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Stripe service functions
export const stripeService = {
  // Redirect to Stripe Checkout (Web)
  redirectToCheckout: async (data: CreateCheckoutDto): Promise<void> => {
    try {
      const response = await paymentsApi.createCheckout(data);

      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      throw error;
    }
  },

  // Create PaymentIntent for mobile
  createPaymentIntent: async (data: CreateCheckoutDto) => {
    try {
      const response = await paymentsApi.createPaymentIntent(data);
      return response;
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      throw error;
    }
  },

  // Redirect to Update Checkout (Web)
  redirectToUpdateCheckout: async (
    data: UpdateUserPackageDto,
  ): Promise<void> => {
    try {
      const response = await paymentsApi.createUpdateCheckout(data);

      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } catch (error) {
      console.error("Failed to create update checkout session:", error);
      throw error;
    }
  },

  // Create Update PaymentIntent for mobile
  createUpdatePaymentIntent: async (data: UpdateUserPackageDto) => {
    try {
      const response = await paymentsApi.createUpdatePaymentIntent(data);
      return response;
    } catch (error) {
      console.error("Failed to create update payment intent:", error);
      throw error;
    }
  },

  // Handle payment success
  handlePaymentSuccess: async (sessionId: string) => {
    try {
      const response = await paymentsApi.getPaymentSuccess(sessionId);
      return response;
    } catch (error) {
      console.error("Failed to get payment success:", error);
      throw error;
    }
  },

  // Handle payment cancel
  handlePaymentCancel: async () => {
    try {
      const response = await paymentsApi.getPaymentCancel();
      return response;
    } catch (error) {
      console.error("Failed to get payment cancel:", error);
      throw error;
    }
  },

  // Confirm payment on client side (for mobile PaymentIntents)
  confirmPayment: async (clientSecret: string): Promise<any> => {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error("Stripe failed to load");
    }

    try {
      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return (result as any).paymentIntent;
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      throw error;
    }
  },

  // Setup payment element for mobile
  setupPaymentElement: async (
    clientSecret: string,
    elementId: string,
  ): Promise<any> => {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error("Stripe failed to load");
    }

    const elements = stripe.elements({
      clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#ef4444",
          colorBackground: "#ffffff",
          colorText: "#1a1a1a",
        },
      },
    });

    const paymentElement = elements.create("payment");
    paymentElement.mount(`#${elementId}`);

    return { elements, paymentElement };
  },
};

// Helper functions
export const formatPrice = (
  amount: number,
  currency: string = "aud",
): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Convert from cents
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

// Payment status helpers
export const getPaymentStatusText = (status: string): string => {
  switch (status) {
    case "succeeded":
      return "Payment Successful";
    case "processing":
      return "Payment Processing";
    case "requires_payment_method":
      return "Payment Method Required";
    case "requires_confirmation":
      return "Payment Confirmation Required";
    case "requires_action":
      return "Action Required";
    case "canceled":
      return "Payment Canceled";
    default:
      return "Unknown Status";
  }
};

export const isPaymentSuccessful = (status: string): boolean => {
  return status === "succeeded";
};

export const isPaymentPending = (status: string): boolean => {
  return ["processing", "requires_confirmation", "requires_action"].includes(
    status,
  );
};

export const isPaymentFailed = (status: string): boolean => {
  return ["canceled", "requires_payment_method"].includes(status);
};

export default stripeService;
