import { useEffect, useMemo, useState } from 'react';
import { useGetAllTipsQuery } from '../../services/api';

const BAG_KEY = 'edufin_tip_bag_v1';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TipCard() {
  const { data: tips = [], isLoading } = useGetAllTipsQuery();
  const [currentId, setCurrentId] = useState(null);
  const [bagSize, setBagSize] = useState(0);

  // map for quick lookup
  const byId = useMemo(() => {
    const m = new Map();
    for (const t of tips) m.set(String(t._id), t);
    return m;
  }, [tips]);

  // read bag (ids) from localStorage
  function loadBag() {
    try {
      const raw = localStorage.getItem(BAG_KEY);
      if (!raw) return [];
      const ids = JSON.parse(raw);
      // keep only ids that still exist
      return ids.filter((id) => byId.has(String(id)));
    } catch {
      return [];
    }
  }

  function saveBag(ids) {
    localStorage.setItem(BAG_KEY, JSON.stringify(ids));
    setBagSize(ids.length);
  }

  function refillBag() {
    const allIds = tips.map((t) => String(t._id));
    const bag = shuffle(allIds);
    saveBag(bag);
    return bag;
  }

  function nextTip() {
    let bag = loadBag();
    if (bag.length === 0) bag = refillBag();
    const id = bag.pop();      // take one
    saveBag(bag);
    setCurrentId(id || null);
  }

  // init: ensure a bag exists and pick the first
  useEffect(() => {
    if (isLoading || tips.length === 0) return;
    // if the tip set changed, rebuild bag
    const bag = loadBag();
    setBagSize(bag.length);
    
    if (bag.length === 0) {
      const newBag = refillBag();
      const first = newBag.pop();
      saveBag(newBag);
      setCurrentId(first || null);
    } else if (!currentId) {
      // pick next if nothing selected yet
      const b = loadBag();
      const id = b.pop();
      saveBag(b);
      setCurrentId(id || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tips.length]);

  const tip = currentId ? byId.get(String(currentId)) : null;
  const totalTips = tips.length;
  const tipsRemaining = bagSize;
  const tipsSeen = totalTips - tipsRemaining;
  const progress = totalTips > 0 ? (tipsSeen / totalTips) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Daily Saving Tips</h1>
        <p className="text-gray-600">
          Discover new ways to save money and build better financial habits
        </p>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Your Progress</h3>
          <span className="text-sm text-gray-600">
            {tipsSeen} of {totalTips} tips seen
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>{Math.round(progress)}%</span>
          <span>100%</span>
        </div>
        {tipsRemaining === 0 && totalTips > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm text-center">
              🎉 You've seen all our tips! The cycle will continue with fresh tips.
            </p>
          </div>
        )}
      </div>

      {/* Main Tip Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
              <span className="text-lg text-blue-600">💡</span>
            </div>
          </div>
          
          <button 
            onClick={nextTip}
            disabled={isLoading}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-gray-300"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Next Tip</span>
              </>
            )}
          </button>
        </div>

        {/* Tip Content */}
        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
            </div>
          ) : tip ? (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm">💡</span>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed">
                  {tip.text}
                </p>
              </div>
            </div>
          ) : tips.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
              <p className="text-gray-600">No tips available yet</p>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 text-center">
              <p className="text-gray-600">Click "Next Tip" to start your financial journey</p>
            </div>
          )}
        </div>

        {/* Tip Stats */}
        {tip && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <span>📚</span>
                  <span>Financial Wisdom</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🔄</span>
                  <span>No repeats until all seen</span>
                </span>
              </div>
             
            </div>
          </div>
        )}
      </div>

          {/* Page Description Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-gray-600 text-xl">📊</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">About Daily Saving Tips</h3>
            <div className="space-y-3 text-gray-600">
              <p>
                Welcome to your personalized financial guidance center! Each day, you'll discover new, 
                actionable tips to help you save money and build lasting financial habits.
              </p>
              <p>
                Our tips are carefully curated to cover various aspects of personal finance - from everyday 
                spending habits to long-term savings strategies. Whether you're just starting your financial 
                journey or looking to optimize your existing habits, you'll find valuable insights here.
              </p>
              <p>
                <strong>How to make the most of this feature:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check back daily for new tips</li>
                <li>Click "Next Tip" to explore more advice</li>
                <li>Try implementing one tip each week</li>
                <li>Track your progress in the Goals section</li>
              </ul>
            </div>
          </div>
        </div>
          </div>

      {/* Motivational Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 italic">
            "Consistent small steps lead to massive financial growth over time."
          </p>
          <p className="text-gray-600 mt-2">- Financial Wisdom</p>
        </div>
      </div>
    </div>
  );
}