// // src/components/stripe/StripePaymentSuccess.tsx
// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { FiCheckCircle, FiAward } from "react-icons/fi";
// import { paymentsApi, userPackageApi } from "../../services/api";

// export default function StripePaymentSuccess() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [activePackage, setActivePackage] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const roleId = searchParams.get("roleId");
//   const token = searchParams.get("token");

//   useEffect(() => {
//     if (!roleId || !token) {
//       setError(
//         "Missing required parameters. Please select a plan from the app.",
//       );
//       setLoading(false);
//       return;
//     }

//     const verifySuccess = async () => {
//       try {
//         // Call backend success endpoint with roleId instead of sessionId
//         await paymentsApi.getPaymentSuccess(roleId);

//         // Get latest active package
//         const packageData = await userPackageApi.getActivePackage();
//         setActivePackage(packageData);
//       } catch (err: any) {
//         console.error("Error loading success data:", err);
//         setError("Payment was successful! Your package is now active.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifySuccess();
//   }, [roleId, token]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="mt-6 text-zinc-400 text-lg">
//             Confirming your payment...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-6">
//           <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
//             <FiCheckCircle className="text-3xl text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-white mb-4">Payment Status</h1>
//           <p className="text-zinc-400 mb-8">{error}</p>
//           <button
//             onClick={() => navigate("/")}
//             className="bg-red-600 hover:bg-red-700 transition px-8 py-3 rounded-xl font-medium"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white">
//       {/* GBS Header */}
//       <div className="bg-black py-6 border-b border-zinc-800">
//         <div className="max-w-2xl mx-auto px-6 flex items-center gap-3">
//           <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-2xl">
//             G
//           </div>
//           <div>
//             <p className="font-bold tracking-widest text-lg">
//               WESTSIDE CAR CARE
//             </p>
//             <p className="text-xs text-zinc-500 -mt-1">GBS Membership</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-2xl mx-auto px-6 py-12">
//         <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
//           {/* Success Banner */}
//           <div className="bg-gradient-to-br from-red-600 to-red-700 py-20 text-center">
//             <FiCheckCircle className="text-[100px] text-white mx-auto mb-6" />
//             <h1 className="text-4xl font-bold tracking-tight">
//               Payment Successful!
//             </h1>
//             <p className="text-red-100 mt-3 text-xl">
//               Thank you for becoming a member
//             </p>
//           </div>

//           {/* Package Info */}
//           <div className="p-10">
//             {activePackage ? (
//               <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 mb-8">
//                 <div className="flex items-start gap-5">
//                   <FiAward className="text-5xl text-red-500 mt-1 flex-shrink-0" />
//                   <div className="flex-1">
//                     <p className="uppercase text-xs tracking-widest text-zinc-500">
//                       YOUR NEW PLAN
//                     </p>
//                     <p className="text-3xl font-semibold text-white mt-2">
//                       {activePackage.role?.label ||
//                         activePackage.role?.name ||
//                         "Premium Membership"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-8 pt-6 border-t border-zinc-800">
//                   <p className="text-zinc-500 text-sm">
//                     Membership Valid Until
//                   </p>
//                   <p className="text-2xl font-medium mt-2">
//                     {new Date(activePackage.endDate).toLocaleDateString(
//                       "en-AU",
//                       {
//                         weekday: "long",
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       },
//                     )}
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-10 text-zinc-400">
//                 Your payment was successful.
//                 <br />
//                 Your package is being activated.
//               </div>
//             )}

//             <div className="text-center text-zinc-400 text-sm mb-10">
//               A confirmation email has been sent to your registered email
//               address.
//             </div>

//             {/* Buttons */}
//             <div className="space-y-4">
//               <button
//                 onClick={() => navigate("/")}
//                 className="w-full bg-red-600 hover:bg-red-700 transition py-4 rounded-2xl font-semibold text-lg"
//               >
//                 Go to Dashboard
//               </button>

//               <button
//                 onClick={() => navigate("/")}
//                 className="w-full border border-zinc-700 hover:bg-zinc-950 py-4 rounded-2xl font-medium"
//               >
//                 ← Back to Plans
//               </button>
//             </div>
//           </div>
//         </div>

//         <p className="text-center text-xs text-zinc-600 mt-12">
//           Secured by Stripe • Westside Car Care
//         </p>
//       </div>
//     </div>
//   );
// }
// src/components/stripe/StripePaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiAward } from "react-icons/fi";
import { paymentsApi, userPackageApi } from "../../services/api";

export default function StripePaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activePackage, setActivePackage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    const handleSuccess = async () => {
      try {
        setActivating(true);

        // 1. Call backend success endpoint (as you already have)
        await paymentsApi.getPaymentSuccess(sessionId);

        // 2. Activate / Create the user package (THIS IS THE IMPORTANT PART)
        const now = new Date().toISOString();
        const dto = {
          role: "68677a975fd1bc732890d128", // You can make this dynamic later if needed
          startDate: now,
          months: 12, // Change according to your logic (monthly/yearly)
          trial: false,
        };

        const packageResponse = await userPackageApi.createPackage(dto);

        // 3. Get latest active package
        const latestPackage = await userPackageApi.getActivePackage();
        setActivePackage(latestPackage);

        console.log("Package activated successfully:", packageResponse);
      } catch (err: any) {
        console.error("Activation failed:", err);
        setError(
          "Payment was successful, but package activation failed. Please contact support.",
        );
      } finally {
        setActivating(false);
        setLoading(false);
      }
    };

    handleSuccess();
  }, [sessionId]);

  if (loading || activating) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-6 text-zinc-400 text-lg">
            {activating
              ? "Activating your package..."
              : "Confirming payment..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Activation Issue
          </h2>
          <p className="text-zinc-400 mb-8">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="bg-black py-6 border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-2xl">
            G
          </div>
          <div>
            <p className="font-bold tracking-widest text-lg">
              WESTSIDE CAR CARE
            </p>
            <p className="text-xs text-zinc-500 -mt-1">GBS Membership</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
          <div className="bg-gradient-to-br from-red-600 to-red-700 py-20 text-center">
            <FiCheckCircle className="text-[100px] text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-red-100 mt-3 text-xl">
              Your membership is now active
            </p>
          </div>

          <div className="p-10">
            {activePackage && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 mb-8">
                <div className="flex items-start gap-5">
                  <FiAward className="text-5xl text-red-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="uppercase text-xs tracking-widest text-zinc-500">
                      YOUR NEW PLAN
                    </p>
                    <p className="text-3xl font-semibold text-white mt-2">
                      {activePackage.role?.label ||
                        activePackage.role?.name ||
                        "Premium Membership"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <p className="text-zinc-500 text-sm">Valid Until</p>
                  <p className="text-2xl font-medium mt-2">
                    {new Date(activePackage.endDate).toLocaleDateString(
                      "en-AU",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center text-zinc-400 text-sm mb-10">
              A confirmation email has been sent to your registered email.
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-semibold text-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
