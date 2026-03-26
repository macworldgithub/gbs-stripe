import { useState } from 'react';
import {
  FiCreditCard,
  FiLock,
  FiCheck,
  FiChevronDown,
} from 'react-icons/fi';

export default function StripeCheckout() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPlan] = useState('pro');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) return v.slice(0, 2) + ' / ' + v.slice(2);
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2500);
  };

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <div className="max-w-[440px] mx-auto mt-10 text-center animate-scaleIn">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto">
              <svg className="w-20 h-20" viewBox="0 0 52 52">
                <circle className="stroke-gbs-success-DEFAULT stroke-2 fill-none" cx="26" cy="26" r="25" />
                <path className="stroke-gbs-success-DEFAULT stroke-[3px] fill-none" strokeLinecap="round" strokeLinejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>
          <h2 className="text-[28px] font-bold text-gbs-text-primary mb-2">Payment Successful!</h2>
          <p className="text-sm text-gbs-text-muted mb-6">Your Professional plan is now active. Welcome to GBS Pro!</p>
          <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-4 md:px-5 mb-6">
            <div className="flex justify-between py-2 text-[13px] text-gbs-text-secondary border-b border-gbs-border">
              <span>Plan</span>
              <span>Professional</span>
            </div>
            <div className="flex justify-between py-2 text-[13px] text-gbs-text-secondary border-b border-gbs-border">
              <span>Amount</span>
              <span className="font-bold text-gbs-text-primary">$29.99/mo</span>
            </div>
            <div className="flex justify-between py-2 text-[13px] text-gbs-text-secondary">
              <span>Transaction ID</span>
              <code className="text-[12px] bg-gbs-bg-input px-1.5 py-0.5 rounded font-mono text-gbs-text-secondary">txn_gbs_8f7d2e1a</code>
            </div>
          </div>
          <button className="mx-auto inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black rounded-md text-sm font-semibold transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] active:translate-y-0" onClick={() => setSuccess(false)}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] md:text-[24px] font-bold text-gbs-text-primary tracking-tight">Checkout</h1>
          <p className="text-sm text-gbs-text-muted mt-1">Complete your subscription purchase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Payment Form */}
        <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 md:p-7 animate-slide-up">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gbs-text-primary flex items-center gap-2 m-0 mb-1.5">
              <FiCreditCard />
              Payment Information
            </h3>
            <p className="text-[13px] text-gbs-text-muted">Enter your card details to complete the purchase</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Card Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gbs-text-secondary">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors pr-[120px] placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                  <div className="text-[9px] font-extrabold px-1.5 py-[3px] rounded-[3px] tracking-wide bg-[#1A1F71] text-black">VISA</div>
                  <div className="text-[9px] font-extrabold px-1.5 py-[3px] rounded-[3px] tracking-wide bg-[#EB001B] text-black">MC</div>
                  <div className="text-[9px] font-extrabold px-1.5 py-[3px] rounded-[3px] tracking-wide bg-[#006FCF] text-black">AMEX</div>
                </div>
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gbs-text-secondary">Cardholder Name</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>

            {/* Expiry & CVC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gbs-text-secondary">Expiry Date</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={7}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gbs-text-secondary">CVC</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                  <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gbs-text-muted text-sm" />
                </div>
              </div>
            </div>

            {/* Billing Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gbs-text-secondary">Country</label>
              <div className="relative">
                <select className="appearance-none cursor-pointer pr-9 w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]">
                  <option>Pakistan</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Canada</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gbs-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gbs-text-secondary">Promo Code (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  placeholder="Enter promo code"
                />
                <button type="button" className="whitespace-nowrap px-5 bg-gbs-accent-DEFAULT text-black rounded-md text-[13px] font-semibold transition-colors hover:bg-gbs-accent-hover shadow-[0_2px_8px_rgba(185,28,28,0.2)]">Apply</button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.15)] rounded-md text-[12px] text-[#34D399]">
              <FiLock />
              <span>Your payment is secured with 256-bit SSL encryption powered by Stripe</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full p-3.5 rounded-md text-base font-bold flex items-center justify-center gap-2 transition-all duration-150
                ${processing ? 'bg-gbs-bg-elevated shadow-none opacity-80 cursor-not-allowed' : 'bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-px hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'}`}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin-slow"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiLock />
                  Pay $29.99
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-6 md:sticky top-20 animate-slide-in-right">
            <h3 className="text-[18px] font-bold text-gbs-text-primary mb-5">Order Summary</h3>

            <div className="flex items-center gap-3.5 p-3.5 bg-gbs-accent-light border border-[rgba(239,68,68,0.4)] rounded-md mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] rounded-md flex items-center justify-center text-xl">
                {selectedPlan === 'pro' && '⭐'}
              </div>
              <div className="flex flex-col">
                <span className="block font-semibold text-[15px] text-gbs-text-primary">Professional Plan</span>
                <span className="block text-[12px] text-gbs-text-muted mt-0.5">Monthly billing</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              {['Unlimited events', 'Advanced analytics', 'Priority support 24/7', 'Up to 10 team members', 'Custom branding'].map(
                (f, i) => (
                  <div className="flex items-center gap-2 text-[13px] text-gbs-text-secondary" key={i}>
                    <FiCheck className="text-gbs-success-DEFAULT text-[14px] shrink-0" />
                    <span>{f}</span>
                  </div>
                )
              )}
            </div>

            <div className="h-px bg-gbs-border my-4"></div>

            <div className="flex justify-between py-1 text-[13px] text-gbs-text-secondary">
              <span>Subtotal</span>
              <span>$29.99</span>
            </div>
            <div className="flex justify-between py-1 text-[13px] text-gbs-text-secondary">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between py-1 text-[13px] text-gbs-success-DEFAULT">
              <span>Discount</span>
              <span>-$0.00</span>
            </div>

            <div className="h-px bg-gbs-border my-4"></div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[14px] font-semibold text-gbs-text-primary">Total</span>
              <span className="text-[24px] font-extrabold text-gbs-text-primary">$29.99</span>
            </div>

            <div className="flex items-center gap-2 mt-4 p-2.5 bg-gbs-bg-primary rounded-md text-[12px] text-gbs-text-muted">
              <FiShield />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FiShield() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}
