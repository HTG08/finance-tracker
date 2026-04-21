import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign, FiRepeat } from 'react-icons/fi';
import { useFinance } from '../context/FinanceContext';
import { useBudget, useCurrency } from '../hooks';
import BudgetCard from '../components/BudgetCard';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import { getCategoryMeta } from '../utils/currencyFormatter';
import { SpendingPieChart } from '../components/Charts';

const Dashboard = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, totalIncome, totalExpenses, netBalance } = useFinance();
  const { format } = useCurrency();
  const [editTx, setEditTx] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const recent = transactions.slice(0, 5);
  const recurring = transactions.filter((t) => t.recurring);

  // Top category
  const catMap = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

  const handleAdd = (data) => {
    addTransaction(data);
    toast.success('Transaction added!');
    setShowForm(false);
  };

  const handleEdit = (data) => {
    updateTransaction(editTx.id, data);
    toast.success('Transaction updated!');
    setEditTx(null);
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

  const stats = [
    { label: 'Total Income', value: format(totalIncome), cls: 'income', icon: '📈', bg: 'rgba(61,214,140,0.1)' },
    { label: 'Total Expenses', value: format(totalExpenses), cls: 'expense', icon: '📉', bg: 'rgba(255,95,126,0.1)' },
    { label: 'Net Balance', value: format(netBalance), cls: 'balance', icon: '💰', bg: 'rgba(124,111,255,0.1)' },
    { label: 'Top Category', value: topCat ? `${getCategoryMeta(topCat[0]).icon} ${topCat[0]}` : '—', cls: '', icon: '🏆', bg: 'rgba(255,169,77,0.1)' },
  ];

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Your financial overview at a glance</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Add Transaction
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <span className="stat-label">{s.label}</span>
            <span className={`stat-value ${s.cls}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <BudgetCard />

      <div className="charts-grid" style={{ marginBottom: 24 }}>
        <div className="chart-card">
          <p className="chart-title">Spending by Category</p>
          <SpendingPieChart />
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p className="chart-title" style={{ margin: 0 }}>Recent Transactions</p>
            <Link to="/transactions" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No transactions yet</h3>
              <p>Start adding to see your activity here</p>
            </div>
          ) : (
            <div className="tx-list">
              <AnimatePresence>
                {recent.map((tx) => (
                  <TransactionCard key={tx.id} transaction={tx} onEdit={setEditTx} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {recurring.length > 0 && (
        <div className="card">
          <p className="chart-title" style={{ marginBottom: 16 }}>
            <FiRepeat style={{ marginRight: 8, color: 'var(--accent)' }} />
            Recurring Expenses
          </p>
          <div className="tx-list">
            {recurring.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} onEdit={setEditTx} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && <TransactionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
        {editTx && <TransactionForm defaultValues={editTx} title="Edit Transaction" onSubmit={handleEdit} onCancel={() => setEditTx(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
