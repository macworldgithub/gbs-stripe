import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeTestAuth } from "./services/auth";
import StripeLayout from "./components/stripe/StripeLayout";
import StripeDashboard from "./components/stripe/StripeDashboard";
import StripePlans from "./components/stripe/StripePlans";
import StripeCheckout from "./components/stripe/StripeCheckout";
import StripePaymentMethods from "./components/stripe/StripePaymentMethods";
import StripePaymentSuccess from "./components/stripe/StripePaymentSuccess";
import StripePaymentCancel from "./components/stripe/StripePaymentCancel";

// Initialize test auth token
initializeTestAuth();

// A simple dummy component for routes we haven't built yet
const ComingSoon = ({ title }: { title: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      minHeight: "400px",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>{title}</h2>
      <p style={{ color: "var(--gbs-text-muted)" }}>
        This page is coming soon.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to stripe dashboard */}
          <Route path="/" element={<Navigate to="/stripe" replace />} />

          {/* Stripe Layout Routes */}
          <Route
            path="/stripe"
            element={
              <StripeLayout>
                <StripeDashboard />
              </StripeLayout>
            }
          />
          <Route
            path="/stripe/plans"
            element={
              <StripeLayout>
                <StripePlans />
              </StripeLayout>
            }
          />
          <Route
            path="/stripe/checkout"
            element={
              <StripeLayout>
                <StripeCheckout />
              </StripeLayout>
            }
          />
          <Route
            path="/stripe/payment-methods"
            element={
              <StripeLayout>
                <StripePaymentMethods />
              </StripeLayout>
            }
          />
          <Route
            path="/stripe/transactions"
            element={
              <StripeLayout>
                <ComingSoon title="Transactions" />
              </StripeLayout>
            }
          />
          <Route
            path="/stripe/settings"
            element={
              <StripeLayout>
                <ComingSoon title="Settings" />
              </StripeLayout>
            }
          />

          {/* Payment Result Routes (without layout) */}
          <Route path="/payment/success" element={<StripePaymentSuccess />} />
          <Route path="/payment/cancel" element={<StripePaymentCancel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
