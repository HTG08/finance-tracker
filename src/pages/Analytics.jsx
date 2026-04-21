import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../hooks';
import { SpendingPieChart, MonthlyTrendChart, IncomeExpenseBarChart } from '../components/Charts';
import { getCategoryMeta } from '../utils/currencyFormatter';

const Analytics = () => {
  const { transactions, totalIncome, totalExpenses, netBalance } = useFinance();
  const { format } = useCurrency();

  const catMap = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const recurringTotal = transactions.filter(t => t.recurring && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0.0';

  return (
    <>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Deep dive into your financial patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Income', value: format(totalIncome), color: 'var(--success)', icon: '📈' },
          { label: 'Total Expenses', value: format(totalExpenses), color: 'var(--danger)', icon: '📉' },
          { label: 'Net Balance', value: format(netBalance), color: 'var(--accent)', icon: '💰' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: 'var(--warning)', icon: '🎯' },
          { label: 'Recurring Costs', value: format(recurringTotal), color: '#a78bfa', icon: '🔁' },
          { label: 'Transactions', value: transactions.length, color: 'var(--text-primary)', icon: '📋' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value" style={{ color: s.color, fontSize: '1.3rem' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        <div className="chart-card">
          <p className="chart-title">Spending by Category</p>
          <SpendingPieChart />
        </div>
        <div className="chart-card">
          <p className="chart-title">Monthly Spending Trend</p>
          <MonthlyTrendChart />
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <p className="chart-title">Income vs Expenses</p>
        <IncomeExpenseBarChart />
      </div>

      {/* Top categories table */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Top 5 Spending Categories</h3>
        {topCats.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📊</span>
            <h3>No expense data</h3>
            <p>Add expense transactions to view this breakdown</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Rank</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>% of Expenses</th>
                </tr>
              </thead>
              <tbody>
                {topCats.map(([cat, amount], i) => {
                  const meta = getCategoryMeta(cat);
                  const pct = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
                  return (
                    <tr key={cat} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>#{i + 1}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ color: meta.color, fontWeight: 600 }}>{meta.icon} {cat}</span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>{format(amount)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-secondary)' }}>{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;
