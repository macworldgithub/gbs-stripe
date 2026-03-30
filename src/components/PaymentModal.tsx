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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && planId) {
      fetchPlan();
    } else if (isOpen && !planId) {
      setError("No plan selected");
      setLoading(false);
    }
  }, [isOpen, planId]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const planData = await rolesApi.getRoleById(planId);
      console.log("Fetched Plan:", planData);
      setPlan(planData);
    } catch (err: any) {
      console.error("Failed to fetch plan:", err);
      setError("Failed to load plan details. Please check the plan ID.");
    } finally {
      setLoading(false);
    }
  };

  // const handlePayment = async () => {
  //   if (!plan) return;

  //   try {
  //     setProcessing(true);
  //     setError(null);

  //     const months = billingCycle === "monthly" ? 1 : 12;
  //     const now = new Date().toISOString();

  //     // 🔥 POST /user-package — runs RIGHT HERE on button click
  //     const userPackageDto = {
  //       role: planId, // ← "role" (not roleId)
  //       startDate: now,
  //       months: months,
  //       trial: false,
  //     };

  //     console.log("🚀 Calling POST /user-package with:", userPackageDto);
  //     await userPackageApi.createPackage(userPackageDto);

  //     console.log("✅ Package created successfully via /user-package");

  //     // Optional: still save for success page (safe to keep)
  //     const selectedPlan = { roleId: planId, months, trial: false };
  //     localStorage.setItem("pendingPackage", JSON.stringify(selectedPlan));

  //     // Now redirect to Stripe
  //     await stripeService.redirectToCheckout({
  //       roleId: planId,
  //       months,
  //       trial: false,
  //     });
  //   } catch (err: any) {
  //     console.error("Package creation or payment failed:", err);
  //     setError(
  //       err.response?.data?.message ||
  //         "Failed to create package. Please try again.",
  //     );
  //   } finally {
  //     setProcessing(false);
  //   }
  // };
  // PaymentModal.tsx

  const handlePayment = async () => {
    if (!plan) return;

    try {
      setProcessing(true);
      setError(null);

      const months = billingCycle === "monthly" ? 1 : 12;

      // ✅ ONLY save pending package info - DO NOT create package yet
      const selectedPlan = {
        roleId: planId,
        months,
        trial: false,
      };
      localStorage.setItem("pendingPackage", JSON.stringify(selectedPlan));

      console.log("✅ Pending package saved to localStorage:", selectedPlan);

      // 🔥 Redirect to Stripe Checkout ONLY (no user-package call here)
      await stripeService.redirectToCheckout({
        roleId: planId,
        months,
        trial: false,
      });
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to start payment process. Please try again.",
      );

      // Clean up on failure
      localStorage.removeItem("pendingPackage");
    } finally {
      setProcessing(false);
    }
  };
  const basePrice = plan?.price ? Number(plan.price) : 0;
  const finalPrice =
    billingCycle === "monthly" ? basePrice : Math.round(basePrice * 12 * 0.83);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-6 text-gray-600">Loading plan details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={fetchPlan}
                className="px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : plan ? (
            <>
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {plan.label || plan.name || "Membership Plan"}
                </h3>
                <div className="flex items-baseline mt-3">
                  <span className="text-5xl font-bold text-gray-900">
                    ${finalPrice}
                  </span>
                  <span className="text-xl text-gray-500 ml-2">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
              </div>

              <div className="flex bg-gray-100 rounded-2xl p-1 mb-10">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`flex-1 py-3.5 rounded-xl font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`flex-1 py-3.5 rounded-xl font-medium transition-all ${
                    billingCycle === "yearly"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  Yearly (Save 17%)
                </button>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-3 transition"
              >
                {processing ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Creating package &amp; redirecting...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="text-xl" />
                    Proceed to Secure Payment
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                <FiLock className="text-green-600" />
                Secured by Stripe - Your information is safe
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
