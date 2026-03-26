import { useState, useEffect } from "react";
import { FiX, FiCreditCard, FiLock } from "react-icons/fi";
import { rolesApi } from "../services/api";
import { stripeService } from "../services/stripe";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planId,
}: PaymentModalProps) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  useEffect(() => {
    if (isOpen && planId) {
      fetchPlan();
    }
  }, [isOpen, planId]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const planData = await rolesApi.getRoleById(planId);
      setPlan(planData);
    } catch (error) {
      console.error("Failed to fetch plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan) return;

    try {
      setProcessing(true);
      const months = billingCycle === "monthly" ? 1 : 12;

      await stripeService.redirectToCheckout({
        roleId: planId,
        months,
        trial: false,
      });
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const price =
    billingCycle === "monthly"
      ? plan?.price || 0
      : (plan?.price || 0) * 12 * 0.83; // 17% discount for yearly

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading plan details...</p>
            </div>
          ) : plan ? (
            <>
              {/* Plan Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plan.label || plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${price.toFixed(2).split(".")[0]}
                  </span>
                  <span className="text-lg text-gray-600">
                    .{price.toFixed(2).split(".")[1]}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      billingCycle === "monthly"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setBillingCycle("monthly")}
                  >
                    Monthly
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      billingCycle === "yearly"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setBillingCycle("yearly")}
                  >
                    Yearly (Save 17%)
                  </button>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="text-lg" />
                    Proceed to Secure Payment
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <FiLock className="text-green-600" />
                <span>
                  Secured by Stripe - Your payment information is safe and
                  encrypted
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load plan details</p>
              <button
                onClick={fetchPlan}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
