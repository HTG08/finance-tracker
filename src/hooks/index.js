import { useMemo, useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currencyFormatter';

export const useTransactions = (filters = {}) => {
  const { transactions } = useFinance();
  const { search = '', category = '', type = '', dateFrom = '', dateTo = '', sort = 'date-desc' } = filters;

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter((t) => t.category === category);
    if (type) list = list.filter((t) => t.type === type);
    if (dateFrom) list = list.filter((t) => new Date(t.date) >= new Date(dateFrom));
    if (dateTo) list = list.filter((t) => new Date(t.date) <= new Date(dateTo));

    const [sortKey, sortDir] = sort.split('-');
    list.sort((a, b) => {
      let va, vb;
      if (sortKey === 'date') { va = new Date(a.date); vb = new Date(b.date); }
      else if (sortKey === 'amount') { va = Number(a.amount); vb = Number(b.amount); }
      else { va = a.category; vb = b.category; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [transactions, search, category, type, dateFrom, dateTo, sort]);

  return { filtered };
};

export const useBudget = () => {
  const { budget, updateBudget, totalExpenses, totalIncome, netBalance } = useFinance();
  const remaining = budget.monthlyBudget - totalExpenses;
  const percentUsed = budget.monthlyBudget > 0 ? Math.min((totalExpenses / budget.monthlyBudget) * 100, 100) : 0;
  return { budget, updateBudget, totalExpenses, totalIncome, netBalance, remaining, percentUsed };
};

export const useCurrency = () => {
  const { currency } = useFinance();
  const format = (amount) => formatCurrency(amount, currency);
  return { currency, format };
};

export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};
