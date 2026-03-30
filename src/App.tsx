// // src/App.tsx
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

// initializeTestAuth();

// function HomePage() {
//   const [roleId, setRoleId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     // const receivedRoleId = urlParams.get("roleId"); // ← Changed from planId

//     // console.log("Received roleId from URL:", receivedRoleId); // Debug log

//     // if (!receivedRoleId) {
//     //   setError("No plan ID received. Please select a plan from the app.");
//     // } else {
//     //   setRoleId(receivedRoleId);
//     // }
//     // Hardcoded for testing
//     const hardcodedRoleId = "68677a975fd1bc732890d128";

//     setRoleId(hardcodedRoleId);
//     console.log("Using hardcoded roleId:", hardcodedRoleId);
//   }, []);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
//         <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center border border-zinc-800">
//           <div className="text-red-500 text-6xl mb-6">⚠️</div>
//           <h2 className="text-2xl font-bold text-white mb-4">
//             No Plan Selected
//           </h2>
//           <p className="text-zinc-400 mb-8">{error}</p>
//           <button
//             onClick={() => window.close()}
//             className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-medium"
//           >
//             Close Window
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {roleId && (
//         <PaymentModal
//           isOpen={true}
//           onClose={() => {}}
//           planId={roleId} // ← Passing roleId as planId to modal
//         />
//       )}
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
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
  const [roleId, setRoleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const receivedRoleId = urlParams.get("roleId");
    const receivedToken = urlParams.get("token");

    console.log("📥 Received roleId from URL:", receivedRoleId);
    console.log(
      "📥 Received token from URL:",
      receivedToken
        ? "✅ Token present (length: " + receivedToken.length + ")"
        : "❌ No token",
    );

    if (!receivedRoleId) {
      setError("No plan ID (roleId) received. Please open with ?roleId=xxx");
      return;
    }

    if (!receivedToken) {
      console.warn(
        "⚠️ No token received in query params. Falling back to localStorage/test token.",
      );
    }

    setRoleId(receivedRoleId);
    // setToken(receivedToken);

    // 🔥 Important: If token is passed, store it in localStorage so authService can use it
    if (receivedToken) {
      localStorage.setItem("auth_token", receivedToken);
      console.log("✅ Token saved to localStorage from query param");
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
      {roleId && (
        <PaymentModal
          isOpen={true}
          onClose={() => {}}
          planId={roleId} // ← now fully dynamic
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
