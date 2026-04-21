import { CATEGORIES } from '../utils/currencyFormatter';

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'amount-desc', label: 'Highest Amount' },
  { value: 'amount-asc', label: 'Lowest Amount' },
  { value: 'category-asc', label: 'Category A–Z' },
];

const Filters = ({ filters, setFilters }) => {
  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Category chips */}
      <div className="filter-row">
        <button
          className={`filter-chip ${!filters.category ? 'active' : ''}`}
          onClick={() => set('category', '')}
        >
          All
        </button>
        {CATEGORIES.filter(c => c.value !== 'Income' && c.value !== 'Other').map((cat) => (
          <button
            key={cat.value}
            className={`filter-chip ${filters.category === cat.value ? 'active' : ''}`}
            onClick={() => set('category', filters.category === cat.value ? '' : cat.value)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Type + Date range + Sort */}
      <div className="filter-row">
        <select
          className="form-input"
          style={{ width: 'auto', paddingRight: 32 }}
          value={filters.type}
          onChange={(e) => set('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="date"
          className="form-input"
          style={{ width: 'auto' }}
          value={filters.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
        />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
        <input
          type="date"
          className="form-input"
          style={{ width: 'auto' }}
          value={filters.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
        />

        <select
          className="form-input"
          style={{ width: 'auto', paddingRight: 32 }}
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
