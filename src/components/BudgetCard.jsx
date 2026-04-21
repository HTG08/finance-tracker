import { useBudget, useCurrency } from '../hooks';
import { motion } from 'framer-motion';

const BudgetCard = () => {
  const { budget, totalExpenses, remaining, percentUsed } = useBudget();
  const { format } = useCurrency();

  const color =
    percentUsed >= 90 ? 'var(--danger)' :
    percentUsed >= 70 ? 'var(--warning)' :
    'var(--success)';

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Monthly Budget</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{format(budget.monthlyBudget)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Remaining</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {format(Math.abs(remaining))} {remaining < 0 && '⚠️'}
          </p>
        </div>
      </div>

      <div className="budget-bar-wrap">
        <div className="budget-bar-bg">
          <motion.div
            className="budget-bar-fill"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentUsed}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spent: {format(totalExpenses)}</span>
        <span style={{ fontSize: '0.8rem', color, fontWeight: 600 }}>{percentUsed.toFixed(1)}% used</span>
      </div>
    </div>
  );
};

export default BudgetCard;
