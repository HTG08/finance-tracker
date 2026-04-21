import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { RiDashboardLine, RiExchangeLine, RiAddCircleLine, RiWalletLine, RiBarChartLine } from 'react-icons/ri';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: <RiDashboardLine />, label: 'Dashboard' },
  { to: '/transactions', icon: <RiExchangeLine />, label: 'Transactions' },
  { to: '/transactions/new', icon: <RiAddCircleLine />, label: 'Add Transaction' },
  { to: '/budget', icon: <RiWalletLine />, label: 'Budget' },
  { to: '/analytics', icon: <RiBarChartLine />, label: 'Analytics' },
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <button className="hamburger" onClick={() => setSidebarOpen(true)}>
        <HiMenuAlt2 />
      </button>

      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">💸</div>
          FinTrack
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
