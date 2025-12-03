import { useState, useMemo } from 'react';

export default function DailyTargetCalculator() {
  const [target, setTarget] = useState('');
  const [days, setDays] = useState('');

  const perDay = useMemo(() => {
    const t = Number(target);
    const d = Number(days);
    if (t > 0 && d > 0) return t / d;
    return null;
  }, [target, days]);

  const formatDuration = (days) => {
    const d = Math.max(0, Math.ceil(days));
    const years = Math.floor(d / 365);
    const months = Math.floor((d % 365) / 30);
    const remainingDays = d - (years * 365 + months * 30);
    
    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (remainingDays > 0 || parts.length === 0) parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Daily Target Calculator</h1>
        <p className="text-gray-600">
          Calculate how much you need to save daily to reach your goal within a specific timeframe
        </p>
      </div>

      {/* Calculator Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
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
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total amount needed for your goal
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Timeframe
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1" 
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Number of days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
                <span className="absolute right-3 top-3 text-gray-500">days</span>
              </div>
              {days && (
                <p className="text-xs text-blue-600 mt-2">
                  {formatDuration(Number(days))}
                </p>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Daily Target</h3>
            
            {perDay !== null ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ${perDay.toFixed(2)}
                  </div>
                  <div className="text-lg text-gray-600">per day</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-600">Weekly target:</span>
                    <span className="font-semibold text-gray-900">${(perDay * 7).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-600">Monthly target:</span>
                    <span className="font-semibold text-gray-900">${(perDay * 30).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-600">Total timeframe:</span>
                    <span className="font-semibold text-gray-900">{formatDuration(Number(days))}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">💡</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Save ${perDay.toFixed(2)} every day to reach your goal in time
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Calculate Your Target</h4>
                <p className="text-gray-600 text-sm">
                  Enter your goal amount and desired timeframe to see your daily savings target
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Savings Strategies */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Saving Strategies</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600">💰</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Automate Your Savings</h4>
                <p className="text-gray-600 text-sm">
                  Set up automatic daily transfers to make saving effortless and consistent
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600">📱</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Round-Up Transactions</h4>
                <p className="text-gray-600 text-sm">
                  Round up your daily purchases and save the difference automatically
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600">📊</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Track Daily Progress</h4>
                <p className="text-gray-600 text-sm">
                  Use the Progress Tracker to monitor your daily savings and stay motivated
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600">⚡</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Adjust Timeframe</h4>
                <p className="text-gray-600 text-sm">
                  If the daily amount seems high, extend your timeline to reduce daily pressure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example Targets */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Goal Examples</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-medium text-gray-900">Emergency Fund</div>
            <div className="text-gray-600">$1,000 in 90 days</div>
            <div className="text-green-600 font-medium mt-1">$11.11/day</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-medium text-gray-900">New Phone</div>
            <div className="text-gray-600">$800 in 60 days</div>
            <div className="text-green-600 font-medium mt-1">$13.33/day</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-medium text-gray-900">Vacation</div>
            <div className="text-gray-600">$2,400 in 180 days</div>
            <div className="text-green-600 font-medium mt-1">$13.33/day</div>
          </div>
        </div>
      </div>
    </div>
  );
}