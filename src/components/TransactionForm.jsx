import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { CATEGORIES } from '../utils/currencyFormatter';

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'At least 2 characters'),
  amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.string().required('Date is required'),
  notes: yup.string(),
  recurring: yup.boolean(),
});

const TransactionForm = ({ defaultValues, onSubmit, onCancel, title = 'Add Transaction' }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
      ...defaultValues,
    },
  });

  const type = watch('type');

  useEffect(() => {
    if (defaultValues) reset({ type: 'expense', date: new Date().toISOString().split('T')[0], recurring: false, ...defaultValues });
  }, [defaultValues]);

  const submit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="modal"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onCancel}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit(submit)}>
          {/* Type Toggle */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${type === 'income' ? 'active income' : ''}`}
                onClick={() => setValue('type', 'income')}
              >
                💰 Income
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setValue('type', 'expense')}
              >
                💸 Expense
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="e.g. Lunch" {...register('title')} />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input className="form-input" type="number" placeholder="0.00" step="0.01" {...register('amount')} />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" {...register('category')}>
                <option value="">Select category</option>
                {CATEGORIES.filter(c => type === 'income' ? ['Income', 'Other'].includes(c.value) : !['Income'].includes(c.value))
                  .map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
              </select>
              {errors.category && <p className="form-error">{errors.category.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" {...register('date')} />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              placeholder="Optional notes…"
              rows={2}
              style={{ resize: 'vertical' }}
              {...register('notes')}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="recurring"
              style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
              {...register('recurring')}
            />
            <label htmlFor="recurring" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              🔁 Mark as recurring
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TransactionForm;
