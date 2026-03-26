import { useState } from 'react';
import {
  FiArrowUpRight,
  FiArrowDownRight,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiCreditCard,
  FiRefreshCw,
  FiMoreVertical,
  FiExternalLink,
} from 'react-icons/fi';

const statsData = [
  { label: 'Total Revenue', value: '$24,850.00', change: '+12.5%', trend: 'up' as const, icon: FiDollarSign, color: '#34D399', bg: 'bg-emerald-400/15', text: 'text-emerald-400' },
  { label: 'Active Subscribers', value: '1,240', change: '+8.2%', trend: 'up' as const, icon: FiUsers, color: '#60A5FA', bg: 'bg-blue-400/15', text: 'text-blue-400' },
  { label: 'Transactions', value: '3,456', change: '+23.1%', trend: 'up' as const, icon: FiCreditCard, color: '#A78BFA', bg: 'bg-indigo-400/15', text: 'text-indigo-400' },
  { label: 'Refunds', value: '$340.00', change: '-4.3%', trend: 'down' as const, icon: FiRefreshCw, color: '#FBBF24', bg: 'bg-amber-400/15', text: 'text-amber-400' },
];

const recentTransactions = [
  { id: 'txn_1A2B3C', customer: 'Ahmed Ali', email: 'ahmed@email.com', amount: '$120.00', status: 'Completed', date: 'Mar 26, 2026', method: 'Visa •••• 4242' },
  { id: 'txn_4D5E6F', customer: 'Sara Khan', email: 'sara@email.com', amount: '$85.00', status: 'Completed', date: 'Mar 25, 2026', method: 'Mastercard •••• 5555' },
  { id: 'txn_7G8H9I', customer: 'Umar Farooq', email: 'umar@email.com', amount: '$200.00', status: 'Pending', date: 'Mar 25, 2026', method: 'Visa •••• 1234' },
  { id: 'txn_0J1K2L', customer: 'Fatima Zahra', email: 'fatima@email.com', amount: '$45.00', status: 'Refunded', date: 'Mar 24, 2026', method: 'AMEX •••• 3782' },
  { id: 'txn_3M4N5O', customer: 'Hassan Raza', email: 'hassan@email.com', amount: '$150.00', status: 'Completed', date: 'Mar 24, 2026', method: 'Visa •••• 9876' },
];

const chartData = [30, 45, 35, 60, 50, 70, 55, 80, 75, 90, 85, 95];
const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StripeDashboard() {
  const [activeChart, setActiveChart] = useState<'revenue' | 'subscribers'>('revenue');
  const maxVal = Math.max(...chartData);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[24px] font-bold text-gbs-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-gbs-text-muted mt-1">Overview of your payment activity</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 rounded-md text-sm font-semibold transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] active:translate-y-0 text-black">
          <FiExternalLink />
          Open Stripe
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gbs-border-light group animate-slide-up" key={stat.label} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center text-lg ${stat.bg} ${stat.text}`}>
                  <Icon />
                </div>
                <button className="text-gbs-text-muted p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiMoreVertical />
                </button>
              </div>
              <div className="text-[24px] md:text-[28px] font-bold text-gbs-text-primary tracking-tight mb-2">{stat.value}</div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gbs-text-muted">{stat.label}</span>
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${stat.trend === 'up' ? 'bg-gbs-success-bg text-gbs-success-DEFAULT' : 'bg-gbs-error-bg text-gbs-error-DEFAULT'}`}>
                  {stat.trend === 'up' ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gbs-text-primary">Revenue Overview</h2>
            <div className="flex gap-1 p-1 bg-gbs-bg-input rounded-md">
              <button
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${activeChart === 'revenue' ? 'bg-gbs-accent-DEFAULT text-white' : 'text-gbs-text-muted hover:text-gbs-text-primary'}`}
                onClick={() => setActiveChart('revenue')}
              >
                Revenue
              </button>
              <button
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${activeChart === 'subscribers' ? 'bg-gbs-accent-DEFAULT text-white' : 'text-gbs-text-muted hover:text-gbs-text-primary'}`}
                onClick={() => setActiveChart('subscribers')}
              >
                Subscribers
              </button>
            </div>
          </div>
          <div className="py-2.5">
            <div className="flex items-end gap-2 h-[200px]">
              {chartData.map((val, i) => (
                <div className="flex-1 flex flex-col items-center h-full justify-end gap-2 group/bar" key={i}>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-[#F87171] to-gbs-accent-DEFAULT rounded-t opacity-80 cursor-pointer transition-opacity group-hover/bar:opacity-100 relative animate-slide-up"
                    style={{ height: `${(val / maxVal) * 100}%`, animationDelay: `${i * 0.05 + 0.5}s` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gbs-bg-elevated text-gbs-text-primary text-[11px] font-semibold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none">
                      ${(val * 28).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[11px] text-gbs-text-muted">{chartLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-base font-semibold text-gbs-text-primary mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {[
              { title: 'New Payment', desc: 'Create a payment link', icon: FiCreditCard, bg: 'bg-red-500/15', color: 'text-gbs-accent-DEFAULT' },
              { title: 'Add Customer', desc: 'Register new customer', icon: FiUsers, bg: 'bg-gbs-info-bg', color: 'text-gbs-info-DEFAULT' },
              { title: 'Create Invoice', desc: 'Send invoice to customer', icon: FiDollarSign, bg: 'bg-gbs-success-bg', color: 'text-gbs-success-DEFAULT' },
              { title: 'View Reports', desc: 'Detailed analytics', icon: FiTrendingUp, bg: 'bg-indigo-400/15', color: 'text-indigo-400' },
            ].map((qa, i) => (
              <button key={i} className="flex items-center gap-3 p-3 bg-gbs-bg-primary border border-gbs-border rounded flex-1 text-left transition-colors hover:border-gbs-border-light hover:bg-gbs-bg-elevated group/qa">
                <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 text-base ${qa.bg} ${qa.color}`}>
                  <qa.icon />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-gbs-text-primary">{qa.title}</span>
                  <span className="block text-[11px] text-gbs-text-muted mt-[1px]">{qa.desc}</span>
                </div>
                <FiArrowUpRight className="text-gbs-text-muted text-sm shrink-0 transition-transform group-hover/qa:translate-x-0.5 group-hover/qa:-translate-y-0.5 group-hover/qa:text-gbs-accent-DEFAULT" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gbs-bg-card border border-gbs-border rounded-xl p-5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gbs-text-primary">Recent Transactions</h2>
          <button className="px-4 py-2 bg-red-600 text-black rounded text-[13px] font-medium transition-colors hover:bg-gbs-accent-hover shadow-[0_2px_8px_rgba(185,28,28,0.2)]">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[12px] font-medium text-gbs-text-muted uppercase tracking-wider py-2.5 px-3 border-b border-gbs-border">Transaction ID</th>
                <th className="text-left text-[12px] font-medium text-gbs-text-muted uppercase tracking-wider py-2.5 px-3 border-b border-gbs-border">Customer</th>
                <th className="text-left text-[12px] font-medium text-gbs-text-muted uppercase tracking-wider py-2.5 px-3 border-b border-gbs-border">Amount</th>
                <th className="text-left text-[12px] font-medium text-gbs-text-muted uppercase tracking-wider py-2.5 px-3 border-b border-gbs-border">Status</th>
                <th className="text-left text-[12px] font-medium text-gbs-text-muted uppercase tracking-wider py-2.5 px-3 border-b border-gbs-border">Date</th>
                <th className="text-left text-[12px] font-medium text-gbs-text-muted uppercase tracking-wider py-2.5 px-3 border-b border-gbs-border">Method</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => {
                const isCompleted = txn.status === 'Completed';
                const isPending = txn.status === 'Pending';
                return (
                  <tr key={txn.id} className="transition-colors hover:bg-gbs-bg-primary group/tr border-b border-gbs-border last:border-b-0">
                    <td className="py-3 px-3">
                      <code className="font-mono text-[12px] px-2 py-[3px] bg-gbs-bg-input rounded text-gbs-text-secondary">{txn.id}</code>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gbs-accent-light text-gbs-accent-DEFAULT flex items-center justify-center font-semibold text-[13px] shrink-0">{txn.customer[0]}</div>
                        <div>
                          <div className="font-medium text-gbs-text-primary text-[13px]">{txn.customer}</div>
                          <div className="text-[11px] text-gbs-text-muted mt-[1px]">{txn.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gbs-text-primary text-[13px]">{txn.amount}</td>
                    <td className="py-3 px-3 text-[13px]">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold
                        ${isCompleted ? 'bg-gbs-success-bg text-gbs-success-DEFAULT' : isPending ? 'bg-gbs-warning-bg text-gbs-warning-DEFAULT' : 'bg-gbs-error-bg text-gbs-error-DEFAULT'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[13px] text-gbs-text-secondary whitespace-nowrap">{txn.date}</td>
                    <td className="py-3 px-3 font-mono text-[12px] text-gbs-text-secondary">{txn.method}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
