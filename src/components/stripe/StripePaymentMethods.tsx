import { useState } from 'react';
import {
  FiPlus,
  FiTrash2,
  FiStar,
  FiCreditCard,
  FiAlertCircle,
  FiX,
} from 'react-icons/fi';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  name: string;
  isDefault: boolean;
}

const initialMethods: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/27', name: 'Ahmed Ali', isDefault: true },
  { id: '2', type: 'mastercard', last4: '5555', expiry: '08/26', name: 'Ahmed Ali', isDefault: false },
  { id: '3', type: 'amex', last4: '3782', expiry: '03/28', name: 'Ahmed Business', isDefault: false },
];

const cardBgMap = {
  visa: 'bg-gradient-to-br from-[#1A1F71] to-[#2F3BA2]',
  mastercard: 'bg-gradient-to-br from-[#EB001B] to-[#F79E1B]',
  amex: 'bg-gradient-to-br from-[#006FCF] to-[#00ADEF]',
};

const cardLabelMap = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'American Express',
};

export default function StripePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [showAddCard, setShowAddCard] = useState(false);

  const setDefault = (id: string) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const removeCard = (id: string) => {
    setMethods(methods.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] md:text-[24px] font-bold text-gbs-text-primary tracking-tight">Payment Methods</h1>
          <p className="text-sm text-gbs-text-muted mt-1">Manage your saved payment methods</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black rounded-md text-sm font-semibold transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] active:translate-y-0" onClick={() => setShowAddCard(!showAddCard)}>
          <FiPlus />
          Add Card
        </button>
      </div>

      {/* Add Card Form */}
      {showAddCard && (
        <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-6 animate-slide-up mb-2 max-w-[500px]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold m-0">Add New Card</h3>
            <button className="text-gbs-text-muted text-xl hover:text-gbs-text-primary" onClick={() => setShowAddCard(false)}>
              <FiX />
            </button>
          </div>
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setShowAddCard(false); }}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gbs-text-secondary">Card Number</label>
              <input type="text" className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gbs-text-secondary">Cardholder Name</label>
              <input type="text" className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" placeholder="Full name on card" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gbs-text-secondary">Expiry Date</label>
                <input type="text" className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" placeholder="MM / YY" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gbs-text-secondary">CVC</label>
                <input type="text" className="w-full px-3.5 py-2.5 bg-gbs-bg-input border border-gbs-border rounded-md text-gbs-text-primary text-sm font-sans outline-none transition-colors placeholder:text-gbs-text-disabled focus:border-gbs-accent-DEFAULT focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" placeholder="123" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" className="px-4 py-2 bg-gbs-accent-DEFAULT text-black rounded text-[13px] font-medium transition-colors hover:bg-gbs-accent-hover shadow-[0_2px_8px_rgba(185,28,28,0.2)]" onClick={() => setShowAddCard(false)}>Cancel</button>
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black rounded-md text-sm font-semibold transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] active:translate-y-0">Save Card</button>
            </div>
          </form>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {methods.map((method, index) => (
          <div
            className={`flex flex-col gap-5 bg-gbs-bg-card border rounded-xl p-5 animate-slide-up
              ${method.isDefault ? 'border-[rgba(239,68,68,0.4)] shadow-[0_4px_12px_rgba(0,0,0,0.05)]' : 'border-gbs-border'}`}
            key={method.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`h-[180px] rounded-xl p-5 relative flex flex-col justify-between text-black shadow-[0_4px_15px_rgba(0,0,0,0.4)] ${cardBgMap[method.type]}`}>
              <div className="w-11 h-8 rounded relative overflow-hidden bg-gradient-to-br from-[#e0c879] to-[#d4af37]">
                <div className="absolute inset-0">
                  <span className="absolute bg-black/20 top-[20%] left-0 right-0 h-px leading-none"></span>
                  <span className="absolute bg-black/20 top-[50%] left-0 right-0 h-px leading-none"></span>
                  <span className="absolute bg-black/20 top-[80%] left-0 right-0 h-px leading-none"></span>
                  <span className="absolute bg-black/20 top-0 bottom-0 left-[30%] w-px leading-none"></span>
                </div>
              </div>
              <div className="flex justify-between font-mono text-[20px] tracking-[2px] shadow-sm mt-auto mb-5 drop-shadow-md">
                <span>••••</span>
                <span>••••</span>
                <span>••••</span>
                <span>{method.last4}</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[9px] opacity-70 tracking-wide uppercase">CARD HOLDER</div>
                  <div className="text-[14px] font-medium uppercase tracking-wide drop-shadow-md">{method.name}</div>
                </div>
                <div>
                  <div className="text-[9px] opacity-70 tracking-wide uppercase">EXPIRES</div>
                  <div className="text-[14px] font-medium uppercase tracking-wide drop-shadow-md">{method.expiry}</div>
                </div>
              </div>
              <div className="absolute top-5 right-5 text-[16px] font-extrabold italic drop-shadow-md">{cardLabelMap[method.type]}</div>
              {method.isDefault && (
                <div className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-gbs-accent-DEFAULT text-black rounded-full flex items-center justify-center text-[14px] shadow-md border-2 border-gbs-bg-card">
                  <FiStar fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              {!method.isDefault ? (
                <button className="flex items-center gap-1.5 text-[13px] font-medium text-gbs-text-secondary hover:text-gbs-accent-DEFAULT transition-colors" onClick={() => setDefault(method.id)}>
                  <FiStar />
                  Set as Default
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gbs-accent-DEFAULT">
                  <FiStar fill="currentColor" />
                  Default
                </span>
              )}
              {!method.isDefault && (
                <button className="text-gbs-text-muted p-1.5 rounded hover:text-gbs-error-DEFAULT hover:bg-gbs-error-bg transition-colors" onClick={() => removeCard(method.id)}>
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Card Placeholder */}
        <div className="flex flex-col justify-center items-center min-h-[260px] border-2 border-dashed border-gbs-border-light rounded-xl cursor-pointer transition-all hover:border-[rgba(239,68,68,0.4)] hover:bg-gbs-accent-light group" onClick={() => setShowAddCard(true)}>
          <div className="flex flex-col items-center gap-3 text-gbs-text-secondary font-medium group-hover:text-gbs-accent-DEFAULT transition-colors">
            <div className="w-12 h-12 rounded-full bg-gbs-bg-input flex items-center justify-center text-xl transition-all group-hover:bg-gradient-to-br group-hover:from-gbs-accent-DEFAULT group-hover:to-[#F87171] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <FiCreditCard />
            </div>
            <span>Add New Card</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3">
        <div className="flex items-start gap-3 p-4 bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.2)] rounded-xl">
          <FiAlertCircle className="text-[#60A5FA] text-xl shrink-0 mt-0.5" />
          <div>
            <h4 className="m-0 mb-1 text-sm text-gbs-text-primary">Secure Payment Storage</h4>
            <p className="m-0 text-[13px] text-gbs-text-secondary">Your card details are securely stored and encrypted by Stripe. We never have access to your full card number.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
