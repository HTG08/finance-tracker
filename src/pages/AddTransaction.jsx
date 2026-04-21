import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = () => {
  const { addTransaction } = useFinance();
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    addTransaction(data);
    toast.success('Transaction added!');
    navigate('/transactions');
  };

  return (
    <AnimatePresence>
      <TransactionForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/transactions')}
        title="New Transaction"
      />
    </AnimatePresence>
  );
};

export default AddTransaction;
