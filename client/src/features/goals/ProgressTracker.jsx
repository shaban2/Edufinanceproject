import { useState } from 'react';
import {
  useGetGoalsQuery,
  useAddGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation
} from '../../services/api';
import { useMarkPurchasedMutation } from '../../services/api';

function ProgressBar({ percent, color = 'blue' }) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
        style={{ width: `${pct}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        role="progressbar"
      />
    </div>
  );
}

export default function ProgressTracker() {
  const { data: goals = [], isLoading } = useGetGoalsQuery();
  const [addGoal, { isLoading: adding }] = useAddGoalMutation();
  const [updateGoal] = useUpdateGoalMutation();
  const [deleteGoal] = useDeleteGoalMutation();
  const [markPurchased] = useMarkPurchasedMutation();

  const [form, setForm] = useState({ itemName: '', targetPrice: '', savedAmount: '' });

  // Validate form - target price cannot be less than saved amount
  const isFormValid = form.itemName && 
                     Number(form.targetPrice) > 0 && 
                     Number(form.savedAmount) >= 0 &&
                     Number(form.targetPrice) >= Number(form.savedAmount);

  async function submit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    
    await addGoal({
      itemName: form.itemName.trim(),
      targetPrice: Number(form.targetPrice),
      savedAmount: Number(form.savedAmount || 0)
    });
    setForm({ itemName: '', targetPrice: '', savedAmount: '' });
  }

  const handleAddMoney = (goal, amount) => {
    const newAmount = goal.savedAmount + amount;
    const maxAmount = goal.targetPrice; // Don't allow saving more than target
    updateGoal({ id: goal._id, savedAmount: Math.min(newAmount, maxAmount) });
  };

  const getProgressColor = (percent) => {
    if (percent >= 100) return 'green';
    if (percent >= 75) return 'purple';
    if (percent >= 50) return 'blue';
    return 'orange';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
          <p className="text-gray-600">Track your savings goals and financial progress</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter(g => g.status !== 'purchased');
  const completedGoals = goals.filter(g => g.status === 'purchased');
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <p className="text-gray-600">Track your savings goals and financial progress</p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${totalSaved.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Goal Form */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Goal</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you saving for?
            </label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., New Laptop, Vacation, Emergency Fund"
              value={form.itemName}
              onChange={(e) => setForm((s) => ({ ...s, itemName: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                  value={form.targetPrice}
                  onChange={(e) => setForm((s) => ({ ...s, targetPrice: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Already Saved
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                  value={form.savedAmount}
                  onChange={(e) => setForm((s) => ({ ...s, savedAmount: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Validation Messages */}
          {Number(form.savedAmount) > Number(form.targetPrice) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                ❌ Saved amount cannot be greater than target amount
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={adding || !isFormValid}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Creating Goal...' : 'Create Savings Goal'}
          </button>
        </form>
              </div>

        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
          
          {activeGoals.length === 0 && completedGoals.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
              <p className="text-gray-600">Create your first savings goal to get started!</p>
            </div>
          ) : (
            <>
              {/* Active Goals */}
              {activeGoals.map((goal) => {
                const percent = goal.targetPrice ? (goal.savedAmount / goal.targetPrice) * 100 : 0;
                const progressColor = getProgressColor(percent);
                const remaining = goal.targetPrice - goal.savedAmount;
                const isFullyFunded = percent >= 100;

                return (
                  <div key={goal._id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.itemName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Saved: <strong className="text-green-600">${goal.savedAmount.toFixed(2)}</strong></span>
                          <span>Target: <strong className="text-blue-600">${goal.targetPrice.toFixed(2)}</strong></span>
                          <span>Remaining: <strong className="text-orange-600">${remaining.toFixed(2)}</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        aria-label="Delete goal"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(percent)}%</span>
                      </div>
                      <ProgressBar percent={percent} color={progressColor} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const amount = Number(prompt('How much to add?', '10'));
                          if (amount > 0 && amount <= remaining) {
                            handleAddMoney(goal, amount);
                          } else if (amount > remaining) {
                            alert(`You can only add up to $${remaining.toFixed(2)} to reach your target.`);
                          }
                        }}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isFullyFunded}
                      >
                        {isFullyFunded ? 'Goal Funded!' : '+ Add Money'}
                      </button>
                      
                      <button
                        onClick={() => {
                          if (!isFullyFunded) {
                            alert(`You need to reach 100% savings ($${remaining.toFixed(2)} remaining) before marking as purchased.`);
                            return;
                          }
                          const price = Number(prompt('Purchase price', String(goal.targetPrice)));
                          if (price > 0) {
                            const date =  new Date().toISOString().slice(0, 10);
                            markPurchased({ id: goal._id, purchasePrice: price, purchasedAt: date });
                          }
                        }}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isFullyFunded}
                      >
                        Mark Purchased
                      </button>
                    </div>

                    {!isFullyFunded && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-sm">
                          💡 Save ${remaining.toFixed(2)} more to reach your goal and mark as purchased
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Completed Goals */}
              {completedGoals.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Goals</h3>
                  <div className="space-y-4">
                    {completedGoals.map((goal) => (
                      <div key={goal._id} className="bg-green-50 rounded-xl border border-green-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-green-900">{goal.itemName}</h4>
                            <p className="text-green-700 text-sm">
                              Purchased for ${goal.purchasePrice?.toFixed(2)} on {goal.purchasedAt ? new Date(goal.purchasedAt).toLocaleDateString() : 'unknown date'}
                            </p>
                          </div>
                          <span className="text-green-600 text-2xl">✅</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}