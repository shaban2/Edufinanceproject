import { useState, useMemo } from 'react';

function formatDays(days) {
  const d = Math.max(0, Math.ceil(days));
  const years = Math.floor(d / 365);
  const months = Math.floor((d % 365) / 30);
  const rem = d - (years * 365 + months * 30);
  
  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (rem > 0 || parts.length === 0) parts.push(`${rem} day${rem !== 1 ? 's' : ''}`);
  
  return parts.join(', ');
}

export default function DurationCalculator() {
  const [daily, setDaily] = useState('');
  const [target, setTarget] = useState('');

  const result = useMemo(() => {
    const perDay = Number(daily);
    const price = Number(target);
    if (perDay > 0 && price > 0) {
      const days = price / perDay;
      return { 
        days, 
        text: formatDays(days),
        totalDays: Math.ceil(days)
      };
    }
    return null;
  }, [daily, target]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Saving Duration Calculator</h1>
        <p className="text-gray-600">
          Calculate how long it will take to reach your savings goal based on daily savings
        </p>
      </div>

      {/* Calculator Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Daily Saving Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                  value={daily}
                  onChange={(e) => setDaily(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                How much can you save each day?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Item Price
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
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Timeline</h3>
            
            {result ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {result.totalDays}
                  </div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">📅</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Estimated Duration</p>
                      <p className="text-gray-600 text-sm">{result.text}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Daily savings:</span>
                    <span className="font-medium">${Number(daily).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target amount:</span>
                    <span className="font-medium">${Number(target).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span>Daily rate needed:</span>
                    <span className="font-medium text-green-600">
                      ${(Number(target) / result.totalDays).toFixed(2)}/day
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Enter Your Numbers</h4>
                <p className="text-gray-600 text-sm">
                  Fill in both fields to see how long it will take to reach your savings goal
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Faster Savings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600">💰</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Increase Daily Amount</h4>
              <p className="text-gray-600 text-sm">Even small increases can significantly reduce your timeline</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">🎯</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Set Smaller Milestones</h4>
              <p className="text-gray-600 text-sm">Break large goals into smaller, achievable targets</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600">📊</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Track Your Progress</h4>
              <p className="text-gray-600 text-sm">Use the Progress Tracker to monitor your savings journey</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600">⚡</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Find Extra Income</h4>
              <p className="text-gray-600 text-sm">Consider side hustles to boost your daily savings rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Scenarios */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Scenarios</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-medium text-gray-900">Coffee Savings</div>
            <div className="text-gray-600">$5 daily → $1,000 goal</div>
            <div className="text-blue-600 font-medium mt-1">200 days</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-medium text-gray-900">Laptop Fund</div>
            <div className="text-gray-600">$10 daily → $1,500 goal</div>
            <div className="text-blue-600 font-medium mt-1">150 days</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-medium text-gray-900">Vacation</div>
            <div className="text-gray-600">$20 daily → $2,400 goal</div>
            <div className="text-blue-600 font-medium mt-1">120 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}