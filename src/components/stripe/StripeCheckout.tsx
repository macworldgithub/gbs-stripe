import { useState, useEffect } from "react";
import { FiCreditCard, FiLock, FiCheck, FiLoader } from "react-icons/fi";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "../../services/stripe";
import { rolesApi } from "../../services/api";
import StripeMobilePayment from "./StripeMobilePayment";

export default function StripeCheckout() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [paymentMethod, setPaymentMethod] = useState<"web" | "mobile">("web");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const roles = await rolesApi.getAllRoles();
      const proPlan = roles.find(
        (role) =>
          role.name.toLowerCase() === "professional" ||
          role.name.toLowerCase() === "pro",
      );
      setSelectedPlan(proPlan || roles[0]);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      setError("Failed to load plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiLoader className="text-4xl text-gbs-accent-DEFAULT animate-spin-slow" />
        <p className="text-gbs-text-muted">Loading checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gbs-text-error">{error}</p>
        <button
          onClick={fetchPlans}
          className="px-4 py-2 bg-gbs-accent-DEFAULT text-black rounded-md text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gbs-text-error">No plan selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] md:text-[24px] font-bold text-gbs-text-primary tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-gbs-text-muted mt-1">
            Complete your subscription purchase
          </p>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gbs-text-primary mb-4">
          Selected Plan
        </h3>
        <div className="flex items-center justify-between p-4 bg-gbs-accent-light border border-[rgba(239,68,68,0.4)] rounded-md">
          <div>
            <h4 className="font-semibold text-gbs-text-primary">
              {selectedPlan.label || selectedPlan.name}
            </h4>
            <p className="text-sm text-gbs-text-muted">
              {billingCycle === "monthly" ? "Monthly" : "Yearly"} billing
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gbs-text-primary">
              $
              {billingCycle === "monthly"
                ? selectedPlan.price
                : (selectedPlan.price * 12 * 0.83).toFixed(2)}
            </div>
            <div className="text-sm text-gbs-text-muted">
              /{billingCycle === "monthly" ? "mo" : "yr"}
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-1 p-1 bg-gbs-bg-input border border-gbs-border rounded-full">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-gbs-accent-DEFAULT text-black"
                  : "text-gbs-text-secondary hover:text-gbs-text-primary"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-gbs-accent-DEFAULT text-black"
                  : "text-gbs-text-secondary hover:text-gbs-text-primary"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gbs-text-primary mb-4">
          Payment Method
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className={`p-4 border rounded-lg transition-all ${
              paymentMethod === "web"
                ? "border-gbs-accent-DEFAULT bg-gbs-accent-light"
                : "border-gbs-border hover:border-gbs-border-light"
            }`}
            onClick={() => setPaymentMethod("web")}
          >
            <FiCreditCard className="text-xl mb-2 text-gbs-accent-DEFAULT" />
            <div className="text-left">
              <h4 className="font-semibold text-gbs-text-primary">
                Stripe Checkout
              </h4>
              <p className="text-sm text-gbs-text-muted">
                Secure payment via Stripe
              </p>
            </div>
          </button>
          <button
            className={`p-4 border rounded-lg transition-all ${
              paymentMethod === "mobile"
                ? "border-gbs-accent-DEFAULT bg-gbs-accent-light"
                : "border-gbs-border hover:border-gbs-border-light"
            }`}
            onClick={() => setPaymentMethod("mobile")}
          >
            <FiLock className="text-xl mb-2 text-gbs-accent-DEFAULT" />
            <div className="text-left">
              <h4 className="font-semibold text-gbs-text-primary">
                In-App Payment
              </h4>
              <p className="text-sm text-gbs-text-muted">
                Direct payment in app
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Payment Form */}
      {paymentMethod === "web" ? (
        <WebCheckout
          plan={selectedPlan}
          months={billingCycle === "monthly" ? 1 : 12}
        />
      ) : (
        <Elements stripe={getStripe()}>
          <StripeMobilePayment
            planId={selectedPlan._id}
            planName={selectedPlan.label || selectedPlan.name}
            planPrice={selectedPlan.price}
            months={billingCycle === "monthly" ? 1 : 12}
            trial={false}
          />
        </Elements>
      )}
    </div>
  );
}

// Web Checkout Component
function WebCheckout({ plan, months }: { plan: any; months: number }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWebCheckout = async () => {
    try {
      setProcessing(true);
      setError(null);

      const { stripeService } = await import("../../services/stripe");

      await stripeService.redirectToCheckout({
        roleId: plan._id,
        months,
        trial: false,
      });
    } catch (err: any) {
      console.error("Failed to start checkout:", err);
      setError(err.message || "Failed to start checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gbs-text-primary mb-4">
        Complete Payment
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gbs-bg-input border border-gbs-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <FiCreditCard className="text-gbs-accent-DEFAULT" />
            <span className="font-medium text-gbs-text-primary">
              Secure Stripe Checkout
            </span>
          </div>
          <p className="text-sm text-gbs-text-muted mb-3">
            You'll be redirected to Stripe's secure payment page to complete
            your purchase.
          </p>
          <div className="flex gap-2 text-xs text-gbs-text-muted">
            <span>✓ SSL Encrypted</span>
            <span>✓ PCI Compliant</span>
            <span>✓ 3D Secure</span>
          </div>
        </div>

        <button
          onClick={handleWebCheckout}
          disabled={processing}
          className="w-full p-4 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black rounded-md font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <FiLoader className="animate-spin-slow" />
              Redirecting to Stripe...
            </>
          ) : (
            <>
              <FiCreditCard />
              Pay ${(plan.price * months).toFixed(2)} with Stripe
            </>
          )}
        </button>

        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <FiLock className="text-green-600 text-sm" />
          <p className="text-xs text-green-700">
            Your payment information is processed securely by Stripe. We never
            store your card details.
          </p>
        </div>
      </div>
    </div>
  );
}
