import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'finance_transactions';
const BUDGET_KEY = 'finance_budget';

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [budget, setBudget] = useState(() => {
    try {
      const stored = localStorage.getItem(BUDGET_KEY);
      return stored ? JSON.parse(stored) : { monthlyBudget: 50000 };
    } catch {
      return { monthlyBudget: 50000 };
    }
  });

  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget]);

  const addTransaction = useCallback((data) => {
    const tx = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    setTransactions((prev) => [tx, ...prev]);
    return tx;
  }, []);

  const updateTransaction = useCallback((id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateBudget = useCallback((val) => {
    setBudget({ monthlyBudget: Number(val) });
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budget,
        updateBudget,
        totalIncome,
        totalExpenses,
        netBalance,
        loading,
        setLoading,
        currency,
        setCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};
