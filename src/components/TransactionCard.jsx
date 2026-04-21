import { format } from 'date-fns';
import { FiEdit2, FiTrash2, FiRepeat } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getCategoryMeta } from '../utils/currencyFormatter';
import { useCurrency } from '../hooks';

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const { format: fmt } = useCurrency();
  const meta = getCategoryMeta(transaction.category);

  return (
    <motion.div
      className={`tx-card ${transaction.recurring ? 'recurring' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
    >
      <div
        className="tx-icon"
        style={{ background: `${meta.color}22`, fontSize: '1.4rem' }}
      >
        {meta.icon}
      </div>

      <div className="tx-info">
        <div className="tx-title">
          {transaction.title}
          {transaction.recurring && (
            <span className="badge badge-recurring" style={{ marginLeft: 8 }}>
              <FiRepeat size={10} /> Recurring
            </span>
          )}
        </div>
        <div className="tx-meta">
          <span
            className="tx-category"
            style={{ background: `${meta.color}22`, color: meta.color }}
          >
            {meta.icon} {transaction.category}
          </span>
          <span className="tx-date">
            {format(new Date(transaction.date), 'dd MMM yyyy')}
          </span>
        </div>
        {transaction.notes && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>
            {transaction.notes}
          </p>
        )}
      </div>

      <div style={{ textAlign: 'right' }}>
        <div className={`tx-amount ${transaction.type}`}>
          {transaction.type === 'income' ? '+' : '-'}{fmt(transaction.amount)}
        </div>
        <div className="tx-actions" style={{ justifyContent: 'flex-end', marginTop: 6 }}>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onEdit(transaction)}
            title="Edit"
          >
            <FiEdit2 />
          </button>
          <button
            className="btn btn-danger btn-icon btn-sm"
            onClick={() => onDelete(transaction.id)}
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
