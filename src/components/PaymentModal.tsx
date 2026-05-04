// import { useState, useEffect } from "react";
// import { FiX, FiCreditCard, FiLock } from "react-icons/fi";
// import { rolesApi, userPackageApi } from "../services/api"; // ← added userPackageApi
// import { stripeService } from "../services/stripe";

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   planId: string;
//   isRole?: boolean;
// }

// export default function PaymentModal({
//   isOpen,
//   onClose,
//   planId,
//   isRole = false,
// }: PaymentModalProps) {
//   const [plan, setPlan] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
//     "monthly",
//   );
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (isOpen && planId) {
//       fetchPlan();
//     } else if (isOpen && !planId) {
//       setError("No plan selected");
//       setLoading(false);
//     }
//   }, [isOpen, planId]);

//   const fetchPlan = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const planData = await rolesApi.getRoleById(planId);
//       console.log("Fetched Plan:", planData);
//       setPlan(planData);
//     } catch (err: any) {
//       console.error("Failed to fetch plan:", err);
//       setError("Failed to load plan details. Please check the plan ID.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (!plan) return;

//     try {
//       setProcessing(true);
//       setError(null);

//       const months = billingCycle === "monthly" ? 1 : 12;
//       const now = new Date().toISOString();

//       const userPackageDto = {
//         role: planId,
//         startDate: now,
//         months: months,
//         trial: false,
//       };

//       console.log(`🚀 isRole=${isRole} →`, isRole ? "UPGRADE" : "NEW PURCHASE");

//       if (isRole) {
//         // === UPGRADE / EXTEND FLOW ===
//         console.log("✅ Calling upgrade flow...");

//         // Option 1: If you have a dedicated update endpoint on user-package
//         // For now, using existing updatePackage – but we need package ID.
//         // Better approach: Use the update checkout directly (you already have it)

//         const selectedPlan = {
//           roleId: planId,
//           months,
//           trial: false,
//           isUpgrade: true,
//         };
//         localStorage.setItem("pendingPackage", JSON.stringify(selectedPlan));
//         console.log("abc");
//         // Use update checkout
//         await stripeService.redirectToUpdateCheckout({
//           role: planId,
//           months,
//           // startDate: now,
//           trial: false,
//         });
//       } else {
//         // === NEW PURCHASE FLOW (existing) ===
//         console.log("✅ Calling POST /user-package (new)");
//         await userPackageApi.createPackage(userPackageDto);

//         const selectedPlan = { roleId: planId, months, trial: false };
//         localStorage.setItem("pendingPackage", JSON.stringify(selectedPlan));

//         await stripeService.redirectToCheckout({
//           roleId: planId,
//           months,
//           trial: false,
//         });
//       }
//     } catch (err: any) {
//       console.error("Payment initiation failed:", err);
//       setError(err.response?.data?.message || "Failed to process request.");
//     } finally {
//       setProcessing(false);
//     }
//   };
//   const basePrice = plan?.price ? Number(plan.price) : 0;
//   const finalPrice =
//     billingCycle === "monthly" ? basePrice : Math.round(basePrice * 12 * 0.83);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <FiX className="text-2xl" />
//           </button>
//         </div>

//         <div className="p-8">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//               <p className="mt-6 text-gray-600">Loading plan details...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-12">
//               <p className="text-red-600 text-lg mb-4">{error}</p>
//               <button
//                 onClick={fetchPlan}
//                 className="px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : plan ? (
//             <>
//               <div className="mb-10">
//                 <h3 className="text-2xl font-semibold text-gray-900">
//                   {plan.label || plan.name || "Membership Plan"}
//                 </h3>
//                 <div className="flex items-baseline mt-3">
//                   <span className="text-5xl font-bold text-gray-900">
//                     ${finalPrice}
//                   </span>
//                   <span className="text-xl text-gray-500 ml-2">
//                     /{billingCycle === "monthly" ? "month" : "year"}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex bg-gray-100 rounded-2xl p-1 mb-10">
//                 <button
//                   onClick={() => setBillingCycle("monthly")}
//                   className={`flex-1 py-3.5 rounded-xl font-medium transition-all ${
//                     billingCycle === "monthly"
//                       ? "bg-white shadow text-gray-900"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   Monthly
//                 </button>
//                 <button
//                   onClick={() => setBillingCycle("yearly")}
//                   className={`flex-1 py-3.5 rounded-xl font-medium transition-all ${
//                     billingCycle === "yearly"
//                       ? "bg-white shadow text-gray-900"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   Yearly (Save 17%)
//                 </button>
//               </div>

//               {/* Pay Button */}
//               <button
//                 onClick={handlePayment}
//                 disabled={processing}
//                 className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-3 transition"
//               >
//                 {processing ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                     Creating package &amp; redirecting...
//                   </>
//                 ) : (
//                   <>
//                     <FiCreditCard className="text-xl" />
//                     Proceed to Secure Payment
//                   </>
//                 )}
//               </button>

//               <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
//                 <FiLock className="text-green-600" />
//                 Secured by Stripe - Your information is safe
//               </div>
//             </>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }
// import { useState, useEffect } from "react";
// import { FiX, FiCreditCard, FiLock } from "react-icons/fi";
// import { rolesApi, userPackageApi } from "../services/api";
// import { stripeService } from "../services/stripe";

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   planId: string;
//   isRole?: boolean;
// }

// export default function PaymentModal({
//   isOpen,
//   onClose,
//   planId,
//   isRole = false,
// }: PaymentModalProps) {
//   const [plan, setPlan] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
//     "monthly",
//   );
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (isOpen && planId) {
//       fetchPlan();
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
//       setError("Failed to load plan details. Please check the plan ID.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (!plan) return;

//     try {
//       setProcessing(true);
//       setError(null);

//       const months = billingCycle === "monthly" ? 1 : 12;
//       const now = new Date().toISOString();

//       const packageDto = {
//         role: planId,
//         startDate: now,
//         months: months,
//         trial: false,
//       };

//       console.log(
//         `🚀 isRole=${isRole} →`,
//         isRole
//           ? "UPGRADE (PATCH /user-package)"
//           : "NEW PURCHASE (POST /user-package)",
//       );

//       if (isRole) {
//         // ====================== UPGRADE FLOW (PATCH) ======================
//         console.log("🔄 Calling PATCH on /user-package for upgrade");

//         // Directly calling patch on /user-package as you requested
//         await userPackageApi.patchPackage(packageDto); // ← New method we'll add

//         console.log("✅ Package upgraded via PATCH /user-package");

//         const pendingData = {
//           roleId: planId,
//           months,
//           trial: false,
//           isUpgrade: true,
//         };
//         localStorage.setItem("pendingPackage", JSON.stringify(pendingData));

//         // Then redirect to Stripe Update Checkout
//         await stripeService.redirectToUpdateCheckout({
//           role: planId,
//           months,
//           startDate: now,
//           trial: false,
//         });
//       } else {
//         // ====================== NEW PURCHASE FLOW ======================
//         console.log("✅ Calling POST /user-package (new)");
//         await userPackageApi.createPackage(packageDto);

//         const pendingData = { roleId: planId, months, trial: false };
//         localStorage.setItem("pendingPackage", JSON.stringify(pendingData));

//         await stripeService.redirectToCheckout({
//           roleId: planId,
//           months,
//           trial: false,
//         });
//       }
//     } catch (err: any) {
//       console.error("Payment initiation failed:", err);
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to process request.",
//       );
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const basePrice = plan?.price ? Number(plan.price) : 0;
//   const finalPrice =
//     billingCycle === "monthly" ? basePrice : Math.round(basePrice * 12 * 0.83);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {isRole ? "Upgrade Membership" : "Complete Payment"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <FiX className="text-2xl" />
//           </button>
//         </div>

//         <div className="p-8">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//               <p className="mt-6 text-gray-600">Loading plan details...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-12">
//               <p className="text-red-600 text-lg mb-4">{error}</p>
//               <button
//                 onClick={fetchPlan}
//                 className="px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : plan ? (
//             <>
//               <div className="mb-10">
//                 <h3 className="text-2xl font-semibold text-gray-900">
//                   {plan.label || plan.name || "Membership Plan"}
//                 </h3>
//                 <div className="flex items-baseline mt-3">
//                   <span className="text-5xl font-bold text-gray-900">
//                     ${finalPrice}
//                   </span>
//                   <span className="text-xl text-gray-500 ml-2">
//                     /{billingCycle === "monthly" ? "month" : "year"}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex bg-gray-100 rounded-2xl p-1 mb-10">
//                 <button
//                   onClick={() => setBillingCycle("monthly")}
//                   className={`flex-1 py-3.5 rounded-xl font-medium ${billingCycle === "monthly" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
//                 >
//                   Monthly
//                 </button>
//                 <button
//                   onClick={() => setBillingCycle("yearly")}
//                   className={`flex-1 py-3.5 rounded-xl font-medium ${billingCycle === "yearly" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
//                 >
//                   Yearly (Save 17%)
//                 </button>
//               </div>

//               <button
//                 onClick={handlePayment}
//                 disabled={processing}
//                 className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-3"
//               >
//                 {processing ? (
//                   <>Processing...</>
//                 ) : (
//                   <>
//                     <FiCreditCard className="text-xl" />
//                     {isRole
//                       ? "Upgrade & Pay Securely"
//                       : "Proceed to Secure Payment"}
//                   </>
//                 )}
//               </button>

//               <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
//                 <FiLock className="text-green-600" />
//                 Secured by Stripe
//               </div>
//             </>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }
// import { useState, useEffect } from "react";
// import { FiX, FiCreditCard, FiLock } from "react-icons/fi";
// import { rolesApi, userPackageApi } from "../services/api";
// import { stripeService } from "../services/stripe";

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   planId: string;
//   isRole?: boolean;
// }

// export default function PaymentModal({
//   isOpen,
//   onClose,
//   planId,
//   isRole = false,
// }: PaymentModalProps) {
//   const [plan, setPlan] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
//     "monthly",
//   );
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (isOpen && planId) fetchPlan();
//   }, [isOpen, planId]);

//   const fetchPlan = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const planData = await rolesApi.getRoleById(planId);
//       setPlan(planData);
//     } catch (err: any) {
//       setError("Failed to load plan details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (!plan) return;

//     try {
//       setProcessing(true);
//       setError(null);

//       const months = billingCycle === "monthly" ? 1 : 12;
//       const now = new Date().toISOString();

//       const packageDto = {
//         role: planId,
//         startDate: now,
//         months: months,
//         trial: false,
//       };

//       console.log(`🚀 Flow: ${isRole ? "UPGRADE (PATCH)" : "NEW PURCHASE"}`);

//       if (isRole) {
//         // ====================== UPGRADE FLOW ======================
//         console.log("🔄 1. Calling PATCH /user-package");
//         await userPackageApi.patchPackage(packageDto);

//         console.log("✅ Package upgraded via PATCH");

//         // Prepare data for Stripe Update Checkout (WITHOUT startDate)
//         const pendingData = {
//           roleId: planId,
//           months,
//           trial: false,
//           isUpgrade: true,
//         };
//         localStorage.setItem("pendingPackage", JSON.stringify(pendingData));

//         console.log("🔄 2. Calling /payment/update-checkout");
//         await stripeService.redirectToUpdateCheckout({
//           role: planId,
//           months,
//           trial: false,
//           // startDate is removed intentionally
//         });
//       } else {
//         // ====================== NEW PURCHASE FLOW ======================
//         console.log("✅ Calling POST /user-package");
//         await userPackageApi.createPackage(packageDto);

//         const pendingData = { roleId: planId, months, trial: false };
//         localStorage.setItem("pendingPackage", JSON.stringify(pendingData));

//         await stripeService.redirectToCheckout({
//           roleId: planId,
//           months,
//           trial: false,
//         });
//       }
//     } catch (err: any) {
//       console.error("Payment failed:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to process payment. Please try again.",
//       );
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const basePrice = plan?.price ? Number(plan.price) : 0;
//   const finalPrice =
//     billingCycle === "monthly" ? basePrice : Math.round(basePrice * 12 * 0.83);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {isRole ? "Upgrade Membership" : "Complete Payment"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <FiX className="text-2xl" />
//           </button>
//         </div>

//         <div className="p-8">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//               <p className="mt-6 text-gray-600">Loading plan details...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-12">
//               <p className="text-red-600 text-lg mb-4">{error}</p>
//               <button
//                 onClick={fetchPlan}
//                 className="px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : plan ? (
//             <>
//               <div className="mb-10">
//                 <h3 className="text-2xl font-semibold text-gray-900">
//                   {plan.label || plan.name || "Membership Plan"}
//                 </h3>
//                 <div className="flex items-baseline mt-3">
//                   <span className="text-5xl font-bold text-gray-900">
//                     ${finalPrice}
//                   </span>
//                   <span className="text-xl text-gray-500 ml-2">
//                     /{billingCycle === "monthly" ? "month" : "year"}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex bg-gray-100 rounded-2xl p-1 mb-10">
//                 <button
//                   onClick={() => setBillingCycle("monthly")}
//                   className={`flex-1 py-3.5 rounded-xl font-medium ${billingCycle === "monthly" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
//                 >
//                   Monthly
//                 </button>
//                 <button
//                   onClick={() => setBillingCycle("yearly")}
//                   className={`flex-1 py-3.5 rounded-xl font-medium ${billingCycle === "yearly" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
//                 >
//                   Yearly (Save 17%)
//                 </button>
//               </div>

//               <button
//                 onClick={handlePayment}
//                 disabled={processing}
//                 className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-3"
//               >
//                 {processing ? (
//                   <>Processing...</>
//                 ) : (
//                   <>
//                     <FiCreditCard className="text-xl" />
//                     {isRole
//                       ? "Upgrade & Pay Securely"
//                       : "Proceed to Secure Payment"}
//                   </>
//                 )}
//               </button>

//               <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
//                 <FiLock className="text-green-600" />
//                 Secured by Stripe
//               </div>
//             </>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import {  FiCreditCard, FiLock } from "react-icons/fi";
import { rolesApi, userPackageApi } from "../services/api";
import { stripeService } from "../services/stripe";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  isRole?: boolean;
}

export default function PaymentModal({
  isOpen,
 
  planId,
  isRole = false,
}: PaymentModalProps) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && planId) fetchPlan();
  }, [isOpen, planId]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const planData = await rolesApi.getRoleById(planId);
      setPlan(planData);
    } catch (err: any) {
      setError("Failed to load plan details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan) return;

    try {
      setProcessing(true);
      setError(null);

      const months = billingCycle === "monthly" ? 1 : 12;
      const now = new Date().toISOString();

      const packageDto = {
        role: planId,
        startDate: now,
        months: months,
        trial: false,
      };

      if (isRole) {
        // ====================== UPGRADE FLOW ======================
        console.log("🔄 1. PATCH /user-package (Upgrade)");
        await userPackageApi.patchPackage(packageDto);

        console.log("✅ PATCH successful");

        // Prepare pending data
        const pendingData = {
          roleId: planId,
          months,
          trial: false,
          isUpgrade: true,
        };
        localStorage.setItem("pendingPackage", JSON.stringify(pendingData));

        // ====================== IMPORTANT: Do NOT send trial field ======================
        console.log("🔄 2. Calling /payment/update-checkout");
        await stripeService.redirectToUpdateCheckout({
          role: planId,
          months,
          // trial: false  ← Removed intentionally
        });
      } else {
        // ====================== NEW PURCHASE ======================
        console.log("✅ POST /user-package (New)");
        await userPackageApi.createPackage(packageDto);

        const pendingData = { roleId: planId, months, trial: false };
        localStorage.setItem("pendingPackage", JSON.stringify(pendingData));

        await stripeService.redirectToCheckout({
          roleId: planId,
          months,
          trial: false,
        });
      }
    } catch (err: any) {
      console.error("Payment failed:", err);
      setError(err.response?.data?.message || "Failed to process payment.");
    } finally {
      setProcessing(false);
    }
  };

  const basePrice = plan?.price ? Number(plan.price) : 0;
  const finalPrice = billingCycle === "monthly" ? basePrice / 12 : basePrice;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isRole ? "Upgrade Membership" : "Complete Payment"}
          </h2>
          {/* <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="text-2xl" />
          </button> */}
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
                  className={`flex-1 py-3.5 rounded-xl font-medium ${billingCycle === "monthly" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`flex-1 py-3.5 rounded-xl font-medium ${billingCycle === "yearly" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
                >
                  Yearly
                </button>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FiCreditCard className="text-xl" />
                    {isRole
                      ? "Upgrade & Pay Securely"
                      : "Proceed to Secure Payment"}
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                <FiLock className="text-green-600" />
                Secured by Stripe
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
