# FinTrack — Personal Finance & Expense Analytics App ()

## Problem Statement

Many students and young professionals struggle to understand where their money is going every month. Expenses are often scattered across UPI transactions, credit cards, subscriptions, and cash spending — with no clear system to answer questions like *"How much did I spend this month?"*, *"Which category eats the most?"*, or *"Am I exceeding my budget?"*. Most people rely on manual spreadsheets or basic notes, which lack automated categorization, analytics, filtering, and visual insights.

**FinTrack** solves this by providing a clean, all-in-one personal finance dashboard that lets users record income and expenses, categorize spending, track monthly budgets, search and filter transactions, and analyze financial behavior through rich interactive charts — simulating a real consumer finance product.


## Who Is the User?

- **Students** managing day-to-day personal expenses
- **Early-career professionals** keeping tabs on salary and spending
- **Freelancers** handling irregular income streams

Users often overspend unknowingly, lose track of subscriptions, and fail to spot problematic spending patterns. FinTrack provides the financial clarity they need through a single, frictionless interface.


## Why Does This Problem Matter?

Without visibility into spending, healthy financial habits cannot form. By unifying income tracking, expense categorization, budget monitoring, and trend analysis into one elegant dashboard — complete with animated charts, recurring expense alerts, and real-time search — FinTrack turns raw transaction data into actionable financial awareness.


## Features

- **Analytics Dashboard** — Real-time key metrics (Total Income, Total Expenses, Net Balance, Top Spending Category), a spending pie chart, monthly trend line chart, and income vs. expense bar chart.
- **Transaction Management** — Add, edit, and delete income or expense transactions with full CRUD support. Each transaction includes a title, amount, category, date, type, notes, and a recurring flag.
- **Smart Search** — Dynamically search transactions by title or notes using a debounced search bar for optimal performance.
- **Filtering & Sorting** — Filter transactions by category, transaction type (income/expense), and date range. Sort by date, amount, or category in ascending or descending order.
- **Budget Tracker** — Set a monthly budget, view total spending vs. remaining balance, and monitor a live animated progress bar that turns from green → amber → red as limits approach.
- **Category Breakdown** — Visual per-category expense bars on the budget page showing exactly where money is going and what percentage of total spending each category represents.
- **Recurring Expense Tracking** — Mark transactions (e.g., Netflix, Rent, Gym) as recurring. Recurring items are visually highlighted with a purple left border and a badge throughout the app.
- **Currency Switcher** — Switch display currency between INR, USD, EUR, GBP, JPY, and AED using live exchange rates fetched from the Exchange Rate API.
- **Fully Responsive** — Optimized for mobile screens with a hamburger sidebar, collapsible filters, and adaptive grid layouts.
- **Premium UI** — Dark-mode glassmorphism design, smooth Framer Motion page transitions, micro-animations on cards, and color-coded category chips for a polished experience.



## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Functional Components, Hooks) |
| **Routing** | React Router DOM v6 |
| **Form Handling** | React Hook Form + Yup validation |
| **State Management** | Context API (`FinanceContext`) |
| **Charts** | Recharts (Pie, Line, Bar) |
| **Animations** | Framer Motion |
| **Styling** | Vanilla CSS (Custom dark-mode design system) |
| **Icons** | React Icons |
| **Notifications** | React Toastify |
| **Dates** | date-fns |
| **IDs** | uuid |
| **HTTP Client** | Axios |
| **Build Tool** | Vite |

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/HTG08/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

**Note:** All transaction and budget data is persisted automatically via `localStorage` — no backend or API keys are required. The Exchange Rate API is called live for currency conversion; if unavailable, the app falls back gracefully.

---

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Sidebar navigation shell with responsive hamburger
│   ├── TransactionCard.jsx # Individual transaction row with edit/delete actions
│   ├── TransactionForm.jsx # Modal form (react-hook-form + yup validation)
│   ├── SearchBar.jsx       # Debounced search input with clear button
│   ├── Filters.jsx         # Category chips, type select, date range, sort select
│   ├── BudgetCard.jsx      # Animated budget progress bar card
│   └── Charts/
│       └── index.jsx       # SpendingPieChart, MonthlyTrendChart, IncomeExpenseBarChart
│
├── pages/
│   ├── Dashboard.jsx       # Overview: stats, pie chart, recent & recurring transactions
│   ├── Transactions.jsx    # Full transaction list with search, filter, and sort
│   ├── AddTransaction.jsx  # Standalone /transactions/new route
│   ├── Budget.jsx          # Budget setting, progress, currency switcher, breakdown
│   └── Analytics.jsx       # Detailed charts + top-5 category table
│
├── context/
│   └── FinanceContext.jsx  # Global state: transactions, budget, CRUD methods, totals
│
├── hooks/
│   └── index.js            # useTransactions, useBudget, useCurrency, useDebounce
│
├── services/
│   └── api.js              # fetchExchangeRates (exchangerate-api.com), fetchFinancialNews
│
├── utils/
│   └── currencyFormatter.js # formatCurrency, CATEGORIES array with icons and colors
│
├── index.css               # Complete dark-mode design system (variables, layout, components)
└── App.jsx                 # Router setup, FinanceProvider, ToastContainer
```

---

## Routes

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Financial overview, stats, and charts |
| `/transactions` | Transactions | Full transaction list with search & filters |
| `/transactions/new` | Add Transaction | Transaction form (modal) |
| `/budget` | Budget | Budget management and category breakdown |
| `/analytics` | Analytics | Detailed charts and spending insights |

---

## Data Models

**Transaction**
```js
{
  id: string,          // uuid v4
  title: string,
  amount: number,
  category: string,    // Food | Travel | Rent | Shopping | Entertainment | Health | Utilities | Subscriptions | Other
  type: "income" | "expense",
  date: string,        // ISO date string
  notes: string,
  recurring: boolean,
  createdAt: string    // ISO timestamp
}
```

**Budget**
```js
{
  monthlyBudget: number   // default ₹50,000
}
```
