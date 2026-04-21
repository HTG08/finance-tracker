import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiEdit2, FiSave } from 'react-icons/fi';
import { useBudget, useCurrency } from '../hooks';
import BudgetCard from '../components/BudgetCard';
import { useFinance } from '../context/FinanceContext';
import { getCategoryMeta } from '../utils/currencyFormatter';
import { fetchExchangeRates } from '../services/api';

const Budget = () => {
  const { budget, updateBudget, totalExpenses } = useBudget();
  const { transactions, currency, setCurrency } = useFinance();
  const { format } = useCurrency();
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(budget.monthlyBudget);
  const [rates, setRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);

  useEffect(() => {
    setLoadingRates(true);
    fetchExchangeRates('INR').then((r) => {
      setRates(r);
      setLoadingRates(false);
    });
  }, []);

  const handleSave = () => {
    if (isNaN(inputVal) || Number(inputVal) <= 0) {
      toast.error('Please enter a valid budget');
      return;
    }
    updateBudget(inputVal);
    toast.success('Budget updated!');
    setEditing(false);
  };

  // Category breakdown
  const catMap = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const catList = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AED'];

  return (
    <>
      <div className="page-header">
        <h1>Budget Tracker</h1>
        <p>Monitor and control your monthly spending</p>
      </div>

      {/* Budget Setting */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700 }}>Monthly Budget</h3>
          {!editing ? (
            <button className="btn btn-ghost btn-sm" onClick={() => { setInputVal(budget.monthlyBudget); setEditing(true); }}>
              <FiEdit2 /> Edit
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              <FiSave /> Save
            </button>
          )}
        </div>
        {editing ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>₹</span>
            <input
              type="number"
              className="form-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{ fontSize: '1.3rem', fontWeight: 700, maxWidth: 220 }}
              autoFocus
            />
          </div>
        ) : (
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{format(budget.monthlyBudget)}</p>
        )}
      </div>

      {/* Progress */}
      <BudgetCard />

      {/* Currency Converter */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Currency Display</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {CURRENCIES.map((c) => (
            <button
              key={c}
              className={`filter-chip ${currency === c ? 'active' : ''}`}
              onClick={() => { setCurrency(c); toast.info(`Currency switched to ${c}`); }}
            >
              {c}
            </button>
          ))}
        </div>
        {loadingRates && <p style={{ color: 'var(--text-muted)', marginTop: 10, fontSize: '0.82rem' }}>Loading exchange rates…</p>}
        {rates && (
          <p style={{ color: 'var(--text-muted)', marginTop: 10, fontSize: '0.82rem' }}>
            Live rate: 1 INR = {rates['USD']?.toFixed(4)} USD
          </p>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Spending Breakdown</h3>
        {catList.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📊</span>
            <h3>No expenses yet</h3>
            <p>Add some transactions to see the breakdown</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {catList.map(([cat, amount]) => {
              const meta = getCategoryMeta(cat);
              const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{meta.icon} {cat}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: meta.color }}>{format(amount)} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="budget-bar-bg">
                    <motion.div
                      className="budget-bar-fill"
                      style={{ background: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Budget;
