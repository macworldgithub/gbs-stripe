import { useState } from 'react';
import {
  FiCheck,
  FiStar,
  FiZap,
  FiShield,
  FiArrowRight,
} from 'react-icons/fi';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals getting started',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    icon: FiZap,
    color: '#60A5FA',
    bg: 'bg-blue-400/15',
    text: 'text-blue-400',
    popular: false,
    features: [
      'Up to 100 events per month',
      'Basic analytics dashboard',
      'Email support',
      'Single member access',
      'Standard event pages',
      'Basic notifications',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Best for growing organizations',
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    icon: FiStar,
    color: '#EF4444',
    bg: 'bg-red-500/15',
    text: 'text-[#EF4444]',
    popular: true,
    features: [
      'Unlimited events',
      'Advanced analytics & reporting',
      'Priority support 24/7',
      'Up to 10 team members',
      'Custom event branding',
      'Push notifications',
      'Member location tracking',
      'Event review system',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large scale operations',
    monthlyPrice: 79.99,
    yearlyPrice: 799.99,
    icon: FiShield,
    color: '#A78BFA',
    bg: 'bg-indigo-400/15',
    text: 'text-indigo-400',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Custom API integrations',
      'Dedicated account manager',
      'White-label solution',
      'Advanced security features',
      'SLA guarantee 99.9%',
      'Custom analytics reports',
      'Bulk event management',
    ],
  },
];

export default function StripePlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] md:text-[24px] font-bold text-gbs-text-primary tracking-tight">Subscription Plans</h1>
          <p className="text-sm text-gbs-text-muted mt-1">Choose the perfect plan for your needs</p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex gap-1 p-1 bg-gbs-bg-card border border-gbs-border rounded-full">
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-gbs-accent-DEFAULT text-black' : 'bg-gbs-accent-DEFAULT bg-opacity-70 text-black hover:bg-opacity-100'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-gbs-accent-DEFAULT text-black' : 'bg-gbs-accent-DEFAULT bg-opacity-70 text-black hover:bg-opacity-100'}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${billingCycle === 'yearly' ? 'bg-white text-gbs-accent-DEFAULT' : 'bg-[#34D399] text-black'}`}>Save 17%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 max-w-[420px] md:max-w-none mx-auto gap-5 items-start">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          return (
            <div
              className={`relative flex flex-col bg-gbs-bg-card border rounded-2xl p-7 transition-all duration-300 animate-slide-up hover:-translate-y-1 hover:border-gbs-border-light
                ${plan.popular ? 'border-gbs-accent-DEFAULT shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-gradient-to-b from-[rgba(239,68,68,0.05)] to-gbs-bg-card hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]' : 'border-gbs-border hover:shadow-lg'}`}
              key={plan.id}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] text-black text-[11px] font-bold rounded-b-md flex items-center gap-1 uppercase tracking-wide">
                  <FiStar />
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <div className={`w-11 h-11 rounded-md flex items-center justify-center text-xl mb-3.5 ${plan.bg} ${plan.text}`}>
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-gbs-text-primary mb-1.5">{plan.name}</h3>
                <p className="text-[13px] text-gbs-text-muted m-0">{plan.description}</p>
              </div>

              <div className="flex items-start gap-px mb-6 pb-6 border-b border-gbs-border">
                <span className="text-xl font-semibold text-gbs-text-primary mt-1.5">$</span>
                <span className="text-5xl md:text-[40px] font-extrabold text-gbs-text-primary leading-none tracking-tight">{price.toFixed(2).split('.')[0]}</span>
                <span className="text-xl font-semibold text-gbs-text-primary mt-1.5">.{price.toFixed(2).split('.')[1]}</span>
                <span className="text-sm text-gbs-text-muted mt-7 ml-1">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <div className="flex-1 flex flex-col gap-2.5 mb-6">
                {plan.features.map((feature, fi) => (
                  <div className="flex items-center gap-2.5 text-[13px] text-gbs-text-secondary" key={fi}>
                    <FiCheck className={`text-[14px] shrink-0 ${plan.text}`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full p-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150
                  ${plan.popular ? ' text-black border-none shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-px hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-gbs-accent-DEFAULT text-black border-none shadow-[0_2px_10px_rgba(185,28,28,0.2)] hover:bg-gbs-accent-hover'}`}
              >
                Get Started
                <FiArrowRight />
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="pt-4">
        <h2 className="text-[22px] font-bold text-gbs-text-primary mb-5 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 hover:border-gbs-border-light transition-colors">
            <h4 className="text-sm font-semibold text-gbs-text-primary mb-2">Can I switch plans anytime?</h4>
            <p className="text-[13px] text-gbs-text-muted leading-relaxed">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 hover:border-gbs-border-light transition-colors">
            <h4 className="text-sm font-semibold text-gbs-text-primary mb-2">What payment methods do you accept?</h4>
            <p className="text-[13px] text-gbs-text-muted leading-relaxed">We accept all major credit/debit cards (Visa, Mastercard, AMEX), and support Apple Pay and Google Pay.</p>
          </div>
          <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 hover:border-gbs-border-light transition-colors">
            <h4 className="text-sm font-semibold text-gbs-text-primary mb-2">Is there a free trial available?</h4>
            <p className="text-[13px] text-gbs-text-muted leading-relaxed">Yes! All plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
          <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 hover:border-gbs-border-light transition-colors">
            <h4 className="text-sm font-semibold text-gbs-text-primary mb-2">How do refunds work?</h4>
            <p className="text-[13px] text-gbs-text-muted leading-relaxed">We offer a 30-day money-back guarantee. Contact our support team for a full refund if you're not satisfied.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
