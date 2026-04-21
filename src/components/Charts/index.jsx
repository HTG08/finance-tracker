import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { format, startOfMonth, getMonth } from 'date-fns';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryMeta } from '../../utils/currencyFormatter';
import { useCurrency } from '../../hooks';

const tooltipStyle = {
  backgroundColor: '#1e1e2a',
  border: '1px solid #2a2a3a',
  borderRadius: 8,
  color: '#f0f0ff',
  fontSize: '0.82rem',
};

export const SpendingPieChart = () => {
  const { transactions } = useFinance();
  const { format: fmt } = useCurrency();

  const data = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find((d) => d.name === t.category);
      if (existing) existing.value += Number(t.amount);
      else acc.push({ name: t.category, value: Number(t.amount) });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  if (!data.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No expense data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} dataKey="value">
          {data.map((entry) => {
            const meta = getCategoryMeta(entry.name);
            return <Cell key={entry.name} fill={meta.color} />;
          })}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} />
        <Legend formatter={(val) => val} wrapperStyle={{ fontSize: '0.78rem', color: '#8888aa' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const MonthlyTrendChart = () => {
  const { transactions } = useFinance();
  const { format: fmt } = useCurrency();

  const monthly = transactions.reduce((acc, t) => {
    const key = format(new Date(t.date), 'MMM yy');
    if (!acc[key]) acc[key] = { month: key, income: 0, expense: 0 };
    if (t.type === 'income') acc[key].income += Number(t.amount);
    else acc[key].expense += Number(t.amount);
    return acc;
  }, {});

  const data = Object.values(monthly).slice(-6);

  if (!data.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
        <XAxis dataKey="month" tick={{ fill: '#8888aa', fontSize: 11 }} />
        <YAxis tick={{ fill: '#8888aa', fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} />
        <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#8888aa' }} />
        <Line type="monotone" dataKey="income" stroke="#3dd68c" strokeWidth={2} dot={{ fill: '#3dd68c', r: 4 }} />
        <Line type="monotone" dataKey="expense" stroke="#ff5f7e" strokeWidth={2} dot={{ fill: '#ff5f7e', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const IncomeExpenseBarChart = () => {
  const { transactions } = useFinance();
  const { format: fmt } = useCurrency();

  const monthly = transactions.reduce((acc, t) => {
    const key = format(new Date(t.date), 'MMM yy');
    if (!acc[key]) acc[key] = { month: key, income: 0, expense: 0 };
    if (t.type === 'income') acc[key].income += Number(t.amount);
    else acc[key].expense += Number(t.amount);
    return acc;
  }, {});

  const data = Object.values(monthly).slice(-6);

  if (!data.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
        <XAxis dataKey="month" tick={{ fill: '#8888aa', fontSize: 11 }} />
        <YAxis tick={{ fill: '#8888aa', fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} />
        <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#8888aa' }} />
        <Bar dataKey="income" fill="#3dd68c" radius={[4,4,0,0]} />
        <Bar dataKey="expense" fill="#ff5f7e" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
