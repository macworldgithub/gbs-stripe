import { useState, useEffect } from "react";
import { FiCreditCard, FiLock, FiLoader } from "react-icons/fi";
import { stripeService, formatPriceFromDecimal } from "../../services/stripe";
import { paymentsApi } from "../../services/api";
import { useNavigate } from "react-router-dom";

interface StripeMobilePaymentProps {
  planId: string;
  planName: string;
  planPrice: number;
  months?: number;
  trial?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StripeMobilePayment({
  planId,
  planName,
  planPrice,
  months = 1,
  trial = false,
  onSuccess,
  onCancel,
}: StripeMobilePaymentProps) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentElement, setPaymentElement] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializePayment();
  }, [planId, months, trial]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create PaymentIntent for mobile
      const response = await paymentsApi.createPaymentIntent({
        roleId: planId,
        months,
        trial,
      });

      // Setup Stripe Payment Element
      const { elements } = await stripeService.setupPaymentElement(
        response.clientSecret,
        "payment-element",
      );

      setPaymentElement(elements);
    } catch (err) {
      console.error("Failed to initialize payment:", err);
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!paymentElement) {
      setError("Payment element not loaded");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Confirm payment using Stripe Elements
      const { error } = await paymentElement.submit();

      if (error) {
        throw new Error(error.message);
      }

      // Payment successful
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/payment/success");
      }
    } catch (err: any) {
      console.error("Payment failed:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiLoader className="text-4xl text-gbs-accent-DEFAULT animate-spin-slow" />
        <p className="text-gbs-text-muted">Setting up payment...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gbs-text-primary mb-2">
          Complete Payment
        </h2>
        <p className="text-gbs-text-muted">
          Pay {formatPriceFromDecimal(planPrice * months, "aud")} for {planName}
          {months > 1 && ` (${months} months)`}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stripe Payment Element */}
        <div className="bg-gbs-bg-card border border-gbs-border rounded-lg p-4">
          <div id="payment-element" className="min-h-[60px]">
            {/* Stripe Payment Element will be mounted here */}
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <FiLock className="text-green-600 text-sm" />
          <p className="text-xs text-green-700">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gbs-bg-card border border-gbs-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gbs-text-primary mb-2">
            Order Summary
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gbs-text-muted">{planName}</span>
              <span className="text-gbs-text-primary">
                {formatPriceFromDecimal(planPrice, "aud")}
              </span>
            </div>
            {months > 1 && (
              <div className="flex justify-between">
                <span className="text-gbs-text-muted">Duration</span>
                <span className="text-gbs-text-primary">{months} months</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gbs-border font-semibold">
              <span>Total</span>
              <span className="text-gbs-text-primary">
                {formatPriceFromDecimal(planPrice * months, "aud")}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing || !paymentElement}
          className="w-full p-3 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black rounded-md font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {processing ? (
            <>
              <FiLoader className="animate-spin-slow" />
              Processing...
            </>
          ) : (
            <>Pay {formatPriceFromDecimal(planPrice * months, "aud")}</>
          )}
        </button>

        {/* Cancel Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full p-3 bg-gbs-bg-card border border-gbs-border rounded-md font-semibold text-gbs-text-secondary hover:bg-gbs-bg-elevated transition-colors"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
