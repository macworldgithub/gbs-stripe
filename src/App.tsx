// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { AuthProvider } from "./contexts/AuthContext";
// import { initializeTestAuth } from "./services/auth";
// import PaymentModal from "./components/PaymentModal";
// import StripePaymentSuccess from "./components/stripe/StripePaymentSuccess";
// import StripePaymentCancel from "./components/stripe/StripePaymentCancel";

// // Initialize test auth token
// initializeTestAuth();

// function AppContent() {
//   const [showPayment, setShowPayment] = useState(false);
//   const [selectedPlanId, setSelectedPlanId] = useState("");

//   useEffect(() => {
//     // Get planId from your main app
//     const urlParams = new URLSearchParams(window.location.search);
//     const planId = urlParams.get("planId") || "68677a975fd1bc732890d128"; // Default: Business Member

//     setSelectedPlanId(planId);
//     setShowPayment(true); // Auto-open payment modal
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Payment Modal */}
//       <PaymentModal
//         isOpen={showPayment}
//         onClose={() => setShowPayment(false)}
//         planId={selectedPlanId}
//       />
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<AppContent />} />
//           <Route path="/payment/success" element={<StripePaymentSuccess />} />
//           <Route path="/payment/cancel" element={<StripePaymentCancel />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
// src/App.tsx
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

function AppContent() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("planId") || "68677a975fd1bc732890d128";

    setSelectedPlanId(planId);
    setShowPayment(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        planId={selectedPlanId}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/payment/success" element={<StripePaymentSuccess />} />
          <Route path="/payment/cancel" element={<StripePaymentCancel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
