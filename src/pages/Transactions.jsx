import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import { useFinance } from '../context/FinanceContext';
import { useTransactions } from '../hooks';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';

const DEFAULT_FILTERS = { search: '', category: '', type: '', dateFrom: '', dateTo: '', sort: 'date-desc' };

const Transactions = () => {
  const { addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [rawSearch, setRawSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);

  // Debounce search
  const [debTimer, setDebTimer] = useState(null);
  const handleSearch = (val) => {
    setRawSearch(val);
    clearTimeout(debTimer);
    setDebTimer(setTimeout(() => setFilters((f) => ({ ...f, search: val })), 350));
  };

  const { filtered } = useTransactions(filters);

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

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Transactions</h1>
          <p>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Add
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar value={rawSearch} onChange={handleSearch} />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No transactions found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="tx-list">
          <AnimatePresence>
            {filtered.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} onEdit={setEditTx} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showForm && <TransactionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
        {editTx && <TransactionForm defaultValues={editTx} title="Edit Transaction" onSubmit={handleEdit} onCancel={() => setEditTx(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Transactions;
