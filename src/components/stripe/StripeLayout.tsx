import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiSearch,
  FiMenu,
} from 'react-icons/fi';

interface StripeLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/stripe', icon: FiGrid, label: 'Dashboard' },
  { path: '/stripe/plans', icon: FiDollarSign, label: 'Plans' },
  { path: '/stripe/checkout', icon: FiCreditCard, label: 'Checkout' },
  { path: '/stripe/payment-methods', icon: FiCreditCard, label: 'Payment Methods' },
  { path: '/stripe/transactions', icon: FiFileText, label: 'Transactions' },
  { path: '/stripe/settings', icon: FiSettings, label: 'Settings' },
];

export default function StripeLayout({ children }: StripeLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gbs-bg-primary font-sans no-scrollbar">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-gbs-bg-secondary border-b border-gbs-border px-4 flex items-center justify-between z-50">
        <button className="text-gbs-text-primary text-xl p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FiMenu />
        </button>
        <div className="flex items-center gap-2 font-bold text-lg text-gbs-text-primary">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            G
          </div>
          <span>GBS Pay</span>
        </div>
        <button className="relative text-gbs-text-primary text-xl p-2">
          <FiBell />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gbs-accent border border-gbs-bg-secondary"></span>
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-gbs-bg-secondary border-r border-gbs-border transition-all duration-250
          md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarCollapsed ? 'md:w-[72px]' : 'md:w-[260px]'} w-[260px]`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gbs-border">
          <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity" onClick={() => navigate('/stripe')}>
            <div className="w-9 h-9 flex items-center justify-center rounded bg-gradient-to-br from-gbs-accent-DEFAULT to-[#F87171] font-extrabold text-lg text-white shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              G
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl text-gbs-text-primary whitespace-nowrap">GBS Pay</span>}
          </div>
          <button
            className="hidden md:flex items-center justify-center w-7 h-7 bg-gbs-bg-input border border-gbs-border rounded text-gbs-text-secondary hover:bg-gbs-bg-elevated hover:text-gbs-text-primary shrink-0 transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 w-full text-left rounded text-sm font-medium transition-colors
                  ${isActive ? 'bg-gbs-accent-light text-gbs-accent-DEFAULT' : 'text-gbs-text-secondary hover:bg-gbs-bg-card hover:text-gbs-text-primary'}
                `}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="text-lg shrink-0" />
                {(!sidebarCollapsed || mobileMenuOpen) && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gbs-accent-DEFAULT rounded-r" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gbs-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-gbs-bg-card rounded">
            <svg viewBox="0 0 60 25" className="w-10 h-4 text-[#635BFF] shrink-0">
              <path d="M5 10.2c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V6.7c-1.4-.6-2.9-.8-4.3-.8C3.4 5.9 1 7.8 1 10.5c0 4.2 5.7 3.5 5.7 5.3 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v3.6c1.7.7 3.3 1 4.9 1 3.2 0 5.5-1.6 5.5-4.3-.1-4.5-5.5-3.7-5.5-5.6z" fill="currentColor"/>
              <path d="M14.4 2.3l-4 .9V6.7l4-1v-3.4zM10.4 8h4v12h-4V8zM19.2 8l-.3-1h-3.5v12h4v-8.1c.9-1.2 2.5-1 3-.8V6.9c-.5-.2-2.5-.6-3.2 1.1zM24 8h4v12h-4V8zm0-4.7l4-.9v3.5l-4 .9V3.3zM33.6 5.9h-3.9v3.6h3.9V12c0 4.6 2.5 6.1 5.5 6.1 1.1 0 2.2-.3 2.9-.6v-3.1c-.6.3-1.4.4-2.3.4-1.3 0-2.1-.5-2.1-2.4V9.5h2.3v-3h-2.3V3.8l-4 .8v1.3z" fill="currentColor"/>
              <path d="M48.8 5.9c-1.6 0-2.6.8-3.2 1.3l-.2-1h-3.5v16.1l4-.8v-3.9c.6.4 1.5 1 2.9 1 2.9 0 5.6-2.4 5.6-7.6-.1-4.7-2.7-5.1-5.6-5.1zm-1 9.7c-1 0-1.5-.4-1.9-.8v-6.3c.4-.5 1-.9 1.9-.9 1.5 0 2.5 1.6 2.5 4 0 2.5-1 4-2.5 4z" fill="currentColor"/>
              <path d="M58.3 14c0-4.2-2-7.1-5.8-7.1s-6.1 3-6.1 7.1c0 4.7 2.7 7.1 6.6 7.1 1.9 0 3.3-.4 4.4-1v-3c-1.1.5-2.3.8-3.9.8-1.5 0-2.9-.6-3-2.4h7.7c0-.2.1-1 .1-1.5zm-7.8-1.5c0-1.8 1.1-2.5 2.1-2.5 1 0 2 .8 2 2.5h-4.1z" fill="currentColor"/>
            </svg>
            {(!sidebarCollapsed || mobileMenuOpen) && <span className="text-[11px] text-gbs-text-muted whitespace-nowrap">Powered by Stripe</span>}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-250 pt-14 md:pt-0
          ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'}`}
      >
        <div className="sticky top-0 z-20 md:z-10 bg-gbs-bg-primary/85 backdrop-blur-md border-b border-gbs-border px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-[400px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gbs-text-muted text-base" />
            <input
              type="text"
              placeholder="Search transactions, plans..."
              className="w-full pl-9 pr-3 py-2 bg-gbs-bg-input border border-gbs-border rounded-full text-gbs-text-primary text-[13px] outline-none transition-colors placeholder:text-gbs-text-muted focus:border-gbs-accent-DEFAULT"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 text-gbs-text-secondary hover:text-gbs-text-primary transition-colors text-lg">
              <FiBell />
              <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-gbs-accent-DEFAULT rounded-full border-2 border-gbs-bg-secondary"></span>
            </button>
            <div className="w-[34px] h-[34px] rounded-full bg-red-500 flex items-center justify-center font-semibold text-sm text-white cursor-pointer select-none">
              A
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 md:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
