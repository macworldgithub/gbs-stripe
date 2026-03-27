// src/components/stripe/StripePaymentCancel.tsx
import { useNavigate } from "react-router-dom";
import { FiXCircle, FiArrowLeft } from "react-icons/fi";

export default function StripePaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <FiXCircle className="text-red-500 text-7xl mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-2xl transition"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 hover:bg-gray-50 font-medium py-3.5 rounded-2xl transition flex items-center justify-center gap-2 mx-auto"
          >
            <FiArrowLeft /> Back to Plans
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-10">
          If you faced any issue, please contact support.
        </p>
      </div>
    </div>
  );
}
