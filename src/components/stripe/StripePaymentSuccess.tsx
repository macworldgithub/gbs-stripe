import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheck, FiArrowRight, FiHome, FiPackage } from "react-icons/fi";
import { stripeService } from "../../services/stripe";
import { userPackageApi } from "../../services/api";

export default function StripePaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      handlePaymentSuccess();
    } else {
      setError("No session ID found");
      setLoading(false);
    }
  }, [sessionId]);

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);

      // Get payment success data from backend
      const response = await stripeService.handlePaymentSuccess(sessionId!);
      setPaymentData(response);

      // Optionally refresh user package data
      try {
        await userPackageApi.getActivePackage();
      } catch (err) {
        console.log(
          "User package not available yet, might need webhook processing",
        );
      }
    } catch (err) {
      console.error("Failed to process payment success:", err);
      setError(
        "Payment was successful but we had trouble updating your account. Please contact support.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
          <FiCheck className="text-4xl text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gbs-text-primary mb-2">
            Processing Your Payment...
          </h2>
          <p className="text-gbs-text-muted">
            Please wait while we confirm your subscription.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gbs-text-primary mb-2">
            Payment Issue
          </h2>
          <p className="text-gbs-text-muted mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/stripe/plans")}
              className="px-4 py-2 bg-gbs-accent-DEFAULT text-black rounded-md text-sm font-semibold flex items-center gap-2"
            >
              <FiPackage />
              Back to Plans
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gbs-bg-card border border-gbs-border rounded-md text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
        <FiCheck className="text-4xl text-green-600" />
      </div>

      <div className="text-center animate-fade-in">
        <h2 className="text-[28px] font-bold text-gbs-text-primary mb-2">
          Payment Successful!
        </h2>
        <p className="text-gbs-text-muted mb-6">
          {paymentData?.message ||
            "Your subscription has been activated successfully."}
        </p>

        {sessionId && (
          <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gbs-text-primary mb-3">
              Transaction Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gbs-text-muted">Session ID:</span>
                <code className="text-xs bg-gbs-bg-input px-2 py-1 rounded font-mono text-gbs-text-secondary">
                  {sessionId.slice(0, 8)}...{sessionId.slice(-8)}
                </code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gbs-text-muted">Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gbs-text-muted">Date:</span>
                <span className="text-gbs-text-secondary">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/stripe")}
            className="px-5 py-2.5 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black rounded-md text-sm font-semibold flex items-center gap-2 transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          >
            <FiHome />
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/stripe/plans")}
            className="px-4 py-2 bg-gbs-bg-card border border-gbs-border rounded-md text-sm font-semibold flex items-center gap-2"
          >
            <FiPackage />
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
