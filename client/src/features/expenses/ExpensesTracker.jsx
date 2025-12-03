import { useMemo, useState } from 'react';
import {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseSummaryQuery
} from '../../services/api';

function fmt(n) { return `$${Number(n).toFixed(2)}`; }
function today() { return new Date().toISOString().slice(0, 10); }

function rangeToFrom(range) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const to = new Date(y, m + 1, 1).toISOString().slice(0, 10);
  if (range === 'all') return { from: undefined, to: undefined };
  const months = range === '1m' ? 1 : range === '3m' ? 3 : 12;
  const from = new Date(y, m + 1 - months, 1).toISOString().slice(0, 10);
  return { from, to };
}

function getCategoryColor(category) {
  const colors = {
    purchase: 'bg-blue-100 text-blue-700 border-blue-200',
    accessory: 'bg-purple-100 text-purple-700 border-purple-200',
    maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
    subscription: 'bg-green-100 text-green-700 border-green-200',
    other: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  return colors[category] || colors.other;
}

export default function ExpensesTracker() {
  const [range, setRange] = useState('3m'); // '1m' | '3m' | '12m' | 'all'
  const { from, to } = useMemo(() => rangeToFrom(range), [range]);

  const { data: expenses = [], isLoading } = useGetExpensesQuery({ from, to });
  const { data: summary } = useGetExpenseSummaryQuery({ from, to });
  const [addExpense, { isLoading: adding }] = useAddExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const [form, setForm] = useState({ amount: '', category: 'other', date: today(), note: '' });

  async function submit(e) {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!Number.isFinite(amt) || amt < 0) return alert('Invalid amount');
    await addExpense({ amount: amt, category: form.category, date: form.date, note: form.note }).unwrap();
    setForm({ amount: '', category: form.category, date: today(), note: '' });
  }

  const top = summary?.topCategory;
  const categoryTotals = summary?.byCategory || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
        <p className="text-gray-600">Monitor your spending and understand your financial habits</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(summary?.total || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-red-600">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Top Category</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">
                {top?.category || 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-blue-600">📊</span>
            </div>
          </div>
          {top && (
            <p className="text-sm text-gray-600 mt-2">{fmt(top.total)}</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Time Range</p>
              <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                {range === '1m' ? 'This Month' : 
                 range === '3m' ? 'Last 3 Months' : 
                 range === '12m' ? 'Last 12 Months' : 'All Time'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-green-600">📅</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Expense</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={form.category}
                  onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                >
                  <option value="purchase">Purchase</option>
                  <option value="accessory">Accessory</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="subscription">Subscription</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={form.date}
                  onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (Optional)
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Store, details…"
                  value={form.note}
                  onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
                />
              </div>

              <button 
                type="submit" 
                disabled={adding || !form.amount}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? 'Adding Expense...' : 'Add Expense'}
              </button>
            </form>
          </div>

          {/* Time Range Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">View Expenses For</h3>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={range} 
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="1m">This Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="12m">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Category Breakdown */}
          {categoryTotals.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Spending by Category</h3>
              <div className="space-y-3">
                {categoryTotals.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(cat.category)}`}>
                        {cat.category}
                      </span>
                    </span>
                    <span className="font-semibold text-gray-900">{fmt(cat.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
              <span className="text-sm text-gray-600">
                {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                <p className="text-gray-600">Add your first expense to start tracking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(expense.category)}`}>
                        <span className="text-sm">
                          {expense.category === 'purchase' ? '🛒' :
                           expense.category === 'accessory' ? '🎧' :
                           expense.category === 'maintenance' ? '🔧' :
                           expense.category === 'subscription' ? '📱' : '📄'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">{expense.category}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(expense.date).toLocaleDateString()} • {expense.note || 'No note'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">{fmt(expense.amount)}</span>
                      <button
                        onClick={() => deleteExpense(expense._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        aria-label="Delete expense"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly History */}
          {summary?.byMonth?.length ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly History</h3>
              <div className="space-y-3">
                {summary.byMonth.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{month.month}</span>
                    <span className="font-semibold text-gray-900">{fmt(month.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}