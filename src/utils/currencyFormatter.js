export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const CATEGORIES = [
  { value: 'Food', label: 'Food', icon: '🍔', color: '#FF6B6B' },
  { value: 'Travel', label: 'Travel', icon: '✈️', color: '#4ECDC4' },
  { value: 'Rent', label: 'Rent', icon: '🏠', color: '#45B7D1' },
  { value: 'Shopping', label: 'Shopping', icon: '🛍️', color: '#96CEB4' },
  { value: 'Entertainment', label: 'Entertainment', icon: '🎬', color: '#FFEAA7' },
  { value: 'Health', label: 'Health', icon: '💊', color: '#DDA0DD' },
  { value: 'Utilities', label: 'Utilities', icon: '⚡', color: '#98D8C8' },
  { value: 'Subscriptions', label: 'Subscriptions', icon: '📱', color: '#F7DC6F' },
  { value: 'Income', label: 'Income', icon: '💰', color: '#58D68D' },
  { value: 'Other', label: 'Other', icon: '📦', color: '#AED6F1' },
];

export const getCategoryMeta = (cat) =>
  CATEGORIES.find((c) => c.value === cat) || CATEGORIES[CATEGORIES.length - 1];
