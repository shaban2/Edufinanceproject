import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from './features/auth/authSlice';
import Login from './features/auth/Login';
import TipCard from './features/tips/TipCard';
import Quiz from './features/quiz/Quiz';
import ProgressTracker from './features/goals/ProgressTracker';
import DurationCalculator from './features/calculators/DurationCalculator';
import DailyTargetCalculator from './features/calculators/DailyTargetCalculator';
import ExpensesTracker from './features/expenses/ExpensesTracker';
import ResourceList from './features/resources/ResourceList';
import {
  useGetGoalsQuery,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { data: goalsData, isLoading } = useGetGoalsQuery();
  console.log(goalsData)
  
  // Calculate stats from actual data
  const goals = goalsData || [];
  console.log(goals);
  const activeGoals = goals.filter(goal => goal.status !== 'purchased');
  const completedGoals = goals.filter(goal => goal.status === 'purchased');
  const totalSaved = goals.reduce((sum, goal) => sum + (goal.savedAmount || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + (goal.targetPrice || 0), 0);
  const overallProgress = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  const featureCards = [
    { 
      key: 'tips', 
      label: 'Daily Tips', 
      icon: '💡',
      description: 'Personalized saving tips',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      public: true
    },
    { 
      key: 'quiz', 
      label: 'Needs vs Wants', 
      icon: '❓',
      description: 'Financial knowledge quiz',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      public: true
    },
    { 
      key: 'goals', 
      label: 'Progress', 
      icon: '📊',
      description: 'Track savings goals',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      public: false
    },
    { 
      key: 'duration', 
      label: 'Duration Calc', 
      icon: '⏰',
      description: 'Time to reach goals',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      public: true
    },
    { 
      key: 'target', 
      label: 'Daily Target', 
      icon: '🎯',
      description: 'Set savings targets',
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      public: true
    },
    { 
      key: 'expenses', 
      label: 'Expenses', 
      icon: '💰',
      description: 'Monitor spending',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      public: false
    },
    { 
      key: 'resources', 
      label: 'Resources', 
      icon: '📚',
      description: 'Learning materials',
      color: 'bg-gray-50 border-gray-200',
      iconColor: 'text-gray-600',
      public: true
    }
  ];

  const renderContent = () => {
    if (!user && !featureCards.find(card => card.key === activeTab)?.public) {
      return <Login />;
    }

    switch(activeTab) {
      case 'tips': return <TipCard />;
      case 'quiz': return <Quiz />;
      case 'goals': return <ProgressTracker />;
      case 'duration': return <DurationCalculator />;
      case 'target': return <DailyTargetCalculator />;
      case 'expenses': return <ExpensesTracker />;
      case 'resources': return <ResourceList />;
      default: return renderDashboard();
    }
  };

  const getProgressPercentage = (savedAmount, targetPrice) => {
    if (!targetPrice || targetPrice === 0) return 0;
    return Math.min((savedAmount / targetPrice) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user ? `Welcome back, ${user.name || user.email}` : 'EduFinance Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user ? 'Manage your financial journey' : 'Start your financial literacy journey today'}
          </p>
        </div>
        {!user && (
          <button 
            onClick={() => document.querySelector('#login-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-4 lg:mt-0 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started - It's Free
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalSaved.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-green-600 text-sm font-medium">
              {overallProgress.toFixed(1)}% of total goals
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeGoals.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-blue-600 text-sm font-medium">
              {completedGoals.length} completed
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{goals.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-orange-600 text-sm font-medium">Keep saving!</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tools & Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featureCards.map((card) => (
            <div
              key={card.key}
              onClick={() => {
                if (!user && !card.public) {
                  document.querySelector('#login-section')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab(card.key);
                }
              }}
              className={`${card.color} border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md hover:border-gray-300 group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-white border flex items-center justify-center group-hover:scale-110 transition-transform ${card.iconColor}`}>
                  <span className="text-lg">{card.icon}</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{card.label}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity / Quick Overview */}
      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goals Progress */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Goals Progress</h3>
              <span className="text-sm text-gray-500">{goals.length} goals</span>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex justify-between mb-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2"></div>
                  </div>
                ))
              ) : goals.length > 0 ? (
                goals.slice(0, 3).map((goal) => {
                  const progress = getProgressPercentage(goal.savedAmount, goal.targetPrice);
                  const progressColor = getProgressColor(progress);
                  const isCompleted = goal.status === 'purchased';
                  
                  return (
                    <div key={goal._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm truncate max-w-[70%]">
                          {goal.itemName}
                          {isCompleted && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Completed
                            </span>
                          )}
                        </span>
                        <span className={`font-semibold text-sm ${
                          isCompleted ? 'text-green-600' : 
                          progress >= 100 ? 'text-green-600' : 
                          progress >= 50 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {isCompleted ? '100%' : `${progress.toFixed(0)}%`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
                          style={{ width: `${isCompleted ? 100 : progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Saved: ${goal.savedAmount?.toLocaleString()}</span>
                        <span>Target: ${goal.targetPrice?.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No goals yet. Start saving for something!</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Savings Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Total Target</span>
                <span className="font-semibold text-blue-600">${totalTarget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Total Saved</span>
                <span className="font-semibold text-green-600">${totalSaved.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">Overall Progress</span>
                  <span className="font-bold text-gray-900">{overallProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Section for guests */}
      {!user && (
        <div id="login-section" className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock All Features</h2>
            <p className="text-gray-600 mb-6">
              Create a free account to track your progress, set goals, and access personalized financial tools.
            </p>
            <Login />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">EF</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">EduFinance</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-right hidden sm:block">
                    <p className="font-medium text-gray-900">{user.name || user.email}</p>
                    <p className="text-sm text-gray-500">Welcome back!</p>
                  </div>
                  <button 
                    onClick={() => dispatch(logout())}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <span className="text-gray-500 text-sm">Guest Mode</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            
            {featureCards.map((card) => (
              <button
                key={card.key}
                onClick={() => {
                  if (!user && !card.public) {
                    document.querySelector('#login-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setActiveTab(card.key);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === card.key 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${!user && !card.public ? 'opacity-60' : ''}`}
              >
                {card.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 EduFinance. Empowering financial literacy for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}