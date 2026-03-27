// // src/components/PaymentModal.tsx
// import { useState, useEffect } from "react";
// import { FiX, FiCreditCard, FiLock } from "react-icons/fi";
// import { rolesApi } from "../services/api";
// import { stripeService } from "../services/stripe";

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   planId: string;
// }

// export default function PaymentModal({
//   isOpen,
//   onClose,
//   planId,
// }: PaymentModalProps) {
//   const [plan, setPlan] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
//     "monthly",
//   );
//   const [error, setError] = useState<string | null>(null);

//   // Fetch plan when modal opens and planId is available
//   useEffect(() => {
//     if (isOpen && planId) {
//       fetchPlan();
//     } else if (isOpen && !planId) {
//       setError("No plan ID provided");
//       setLoading(false);
//     }
//   }, [isOpen, planId]);

//   const fetchPlan = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const planData = await rolesApi.getRoleById(planId);
//       setPlan(planData);
//     } catch (err: any) {
//       console.error("Failed to fetch plan:", err);
//       setError("Failed to load plan details. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (!plan) return;

//     try {
//       setProcessing(true);
//       const months = billingCycle === "monthly" ? 1 : 12;

//       await stripeService.redirectToCheckout({
//         roleId: planId,
//         months,
//         trial: false,
//       });
//     } catch (error) {
//       console.error("Payment failed:", error);
//       alert("Payment failed. Please try again.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Calculate price properly
//   const basePrice = plan?.price || 0;
//   const price =
//     billingCycle === "monthly" ? basePrice : Math.round(basePrice * 12 * 0.83); // 17% discount for yearly

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
//           {/* Hide close button when opened from external app */}
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <FiX className="text-xl" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
//               <p className="mt-5 text-gray-600">Loading plan details...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-12">
//               <p className="text-red-600 text-lg mb-4">{error}</p>
//               <button
//                 onClick={fetchPlan}
//                 className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : plan ? (
//             <>
//               {/* Plan Details */}
//               <div className="mb-8">
//                 <h3 className="text-2xl font-semibold text-gray-900 mb-1">
//                   {plan.label || plan.name}
//                 </h3>
//                 <div className="flex items-baseline gap-1">
//                   <span className="text-4xl font-bold text-gray-900">
//                     ${price.toFixed(2).split(".")[0]}
//                   </span>
//                   <span className="text-2xl text-gray-600">
//                     .{price.toFixed(2).split(".")[1] || "00"}
//                   </span>
//                   <span className="text-sm text-gray-500 ml-1">
//                     /{billingCycle === "monthly" ? "month" : "year"}
//                   </span>
//                 </div>
//               </div>

//               {/* Billing Cycle Toggle */}
//               <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-8">
//                 <button
//                   className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
//                     billingCycle === "monthly"
//                       ? "bg-white shadow-sm text-gray-900"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                   onClick={() => setBillingCycle("monthly")}
//                 >
//                   Monthly
//                 </button>
//                 <button
//                   className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
//                     billingCycle === "yearly"
//                       ? "bg-white shadow-sm text-gray-900"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                   onClick={() => setBillingCycle("yearly")}
//                 >
//                   Yearly (Save 17%)
//                 </button>
//               </div>

//               {/* Payment Button */}
//               <button
//                 onClick={handlePayment}
//                 disabled={processing || !plan}
//                 className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg"
//               >
//                 {processing ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <FiCreditCard className="text-xl" />
//                     Proceed to Secure Payment
//                   </>
//                 )}
//               </button>

//               {/* Security Note */}
//               <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 justify-center">
//                 <FiLock className="text-green-600" />
//                 <span>
//                   Secured by Stripe - Your payment information is safe and
//                   encrypted
//                 </span>
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-red-600">Failed to load plan details</p>
//               <button
//                 onClick={fetchPlan}
//                 className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               >
//                 Try Again
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/PaymentModal.tsx
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

  // Fetch plan details
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
      console.log("Fetched Plan:", planData); // ← Add this for debugging

      setPlan(planData);
    } catch (err: any) {
      console.error("Failed to fetch plan:", err);
      setError("Failed to load plan details. Please check the plan ID.");
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
    } catch (error: any) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Calculate price
  const basePrice = plan?.price ? Number(plan.price) : 0;
  const finalPrice =
    billingCycle === "monthly" ? basePrice : Math.round(basePrice * 12 * 0.83);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
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
              {/* Plan Name & Price */}
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

              {/* Billing Toggle */}
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
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="text-xl" />
                    Proceed to Secure Payment
                  </>
                )}
              </button>

              {/* Security */}
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
