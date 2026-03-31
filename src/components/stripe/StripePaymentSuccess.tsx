import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiAward } from "react-icons/fi";
import { paymentsApi, userPackageApi } from "../../services/api";

export default function StripePaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [activePackage, setActivePackage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

   const activatePackage = async () => {
    try {
      setActivating(true);

      await paymentsApi.getPaymentSuccess(sessionId);

      const pendingStr = localStorage.getItem("pendingPackage");
      if (!pendingStr) throw new Error("No pending package found");

      const pending = JSON.parse(pendingStr) as {
        roleId: string;
        months: number;
        trial: boolean;
        isUpgrade?: boolean;     // ← NEW
      };

      const now = new Date().toISOString();

      if (pending.isUpgrade) {
        // Upgrade flow - you can call update here if needed
        console.log("🔄 Upgrade flow - skipping createPackage");
        // If backend already handled upgrade via /payment/update-checkout, you may not need to call anything here
        // Or call updatePackage if you have the ID
      } else {
        // New purchase
        const userPackageDto = {
          role: pending.roleId,
          startDate: now,
          months: pending.months,
          trial: pending.trial,
        };

        console.log("✅ Creating new package via POST /user-package");
        await userPackageApi.createPackage(userPackageDto);
      }

      // Refresh active package
      const latestPackage = await userPackageApi.getActivePackage();
      setActivePackage(latestPackage);

      localStorage.removeItem("pendingPackage");
    } catch (err: any) {
      console.error("Activation failed:", err);
      setError("Payment successful but activation failed.");
    } finally {
      setActivating(false);
      setLoading(false);
    }
  };

  activatePackage();
}, [sessionId]);

  // Loading / Activating UI
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

  // Error UI
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

  // Success UI
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
