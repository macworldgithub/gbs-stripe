import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiArrowLeft, FiPackage, FiCreditCard } from 'react-icons/fi';
import { stripeService } from '../../services/stripe';

export default function StripePaymentCancel() {
  const [loading, setLoading] = useState(true);
  const [cancelData, setCancelData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    handlePaymentCancel();
  }, []);

  const handlePaymentCancel = async () => {
    try {
      setLoading(true);
      
      // Get payment cancel data from backend
      const response = await stripeService.handlePaymentCancel();
      setCancelData(response);
    } catch (err) {
      console.error('Failed to process payment cancel:', err);
      setError('Unable to load cancellation information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center animate-pulse">
          <FiX className="text-4xl text-yellow-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gbs-text-primary mb-2">Processing Cancellation...</h2>
          <p className="text-gbs-text-muted">Please wait while we process your request.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center animate-scale-in">
        <FiX className="text-4xl text-yellow-600" />
      </div>
      
      <div className="text-center animate-fade-in">
        <h2 className="text-[28px] font-bold text-gbs-text-primary mb-2">Payment Cancelled</h2>
        <p className="text-gbs-text-muted mb-6">
          {cancelData?.message || 'Your payment was cancelled. No charges were made to your account.'}
        </p>

        <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-4 mb-6 text-left">
          <h3 className="text-sm font-semibold text-gbs-text-primary mb-3">What happened?</h3>
          <div className="space-y-2 text-sm text-gbs-text-muted">
            <p>• You cancelled the payment process</p>
            <p>• No money was charged from your account</p>
            <p>• Your subscription was not activated</p>
            <p>• You can try again anytime</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/stripe/plans')}
            className="px-5 py-2.5 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          >
            <FiPackage />
            Try Again
          </button>
          <button
            onClick={() => navigate('/stripe')}
            className="px-4 py-2 bg-gbs-bg-card border border-gbs-border rounded-md text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gbs-border">
          <p className="text-xs text-gbs-text-muted mb-3">Need help?</p>
          <div className="flex gap-3 justify-center">
            <button className="text-xs text-gbs-accent-DEFAULT hover:underline flex items-center gap-1">
              <FiCreditCard className="text-xs" />
              Payment Issues
            </button>
            <button className="text-xs text-gbs-accent-DEFAULT hover:underline">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
