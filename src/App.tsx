// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeTestAuth } from "./services/auth";

import PaymentModal from "./components/PaymentModal";
import StripePaymentSuccess from "./components/stripe/StripePaymentSuccess";
import StripePaymentCancel from "./components/stripe/StripePaymentCancel";

initializeTestAuth();

function HomePage() {
  const [planId, setPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const receivedPlanId = urlParams.get("planId");

    if (!receivedPlanId) {
      setError("No plan ID received. Please select a plan from the app.");
    } else {
      setPlanId(receivedPlanId);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center border border-zinc-800">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            No Plan Selected
          </h2>
          <p className="text-zinc-400 mb-8">{error}</p>
          <button
            onClick={() => window.close()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-medium"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {planId && (
        <PaymentModal
          isOpen={true}
          onClose={() => {}} // Not closable if opened from app
          planId={planId}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment/success" element={<StripePaymentSuccess />} />
          <Route path="/payment/cancel" element={<StripePaymentCancel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
