import { useState } from 'react';
import { useGetQuizQuery } from '../../services/api';

export default function Quiz() {
  const { data = [], isLoading } = useGetQuizQuery();
  const [answers, setAnswers] = useState({}); // id -> 'need' | 'want'
  

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Needs vs Wants Quiz</h1>
          <p className="text-gray-600">Test your financial knowledge</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const score = data.reduce((sum, q) => (answers[q._id] === q.answer ? sum + 1 : sum), 0);
  const allAnswered = Object.keys(answers).length === data.length;
  const percentage = data.length > 0 ? Math.round((score / data.length) * 100) : 0;

  const getScoreColor = (percent) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percent) => {
    if (percent >= 90) return 'Excellent! You know your needs from wants!';
    if (percent >= 70) return 'Good job! You have solid financial understanding.';
    if (percent >= 50) return 'Not bad! Keep learning about financial basics.';
    return 'Keep practicing! Financial literacy takes time.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Needs vs Wants Quiz</h1>
        <p className="text-gray-600">
          Test your understanding of essential expenses versus discretionary spending
        </p>
      </div>

      {/* Progress & Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{Object.keys(answers).length}</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-sm text-gray-600">Current Score</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round((Object.keys(answers).length / data.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / data.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quiz Questions */}
      <div className="space-y-4">
        {data.map((q) => {
          const a = answers[q._id];
          const correct = a && a === q.answer;
          const selected = Boolean(a);
          
          return (
            <div key={q._id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{q.prompt}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['need', 'want'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers((s) => ({ ...s, [q._id]: opt }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          a === opt 
                            ? opt === 'need' 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                        }`}
                        aria-pressed={a === opt}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{opt}</span>
                          {a === opt && (
                            <span className="text-lg">
                              {correct ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className={`font-medium ${correct ? 'text-green-800' : 'text-red-800'}`}>
                        {correct ? 'Correct!' : `Incorrect - The answer is ${q.answer.toUpperCase()}`}
                      </div>
                      {q.explanation && (
                        <p className="text-gray-700 mt-2">{q.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Results Section */}
      {allAnswered && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">{percentage}%</span>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quiz Complete!
              </h3>
              <p className={`text-lg font-medium ${getScoreColor(percentage)} mb-2`}>
                {getScoreMessage(percentage)}
              </p>
              <p className="text-gray-600">
                You scored {score} out of {data.length} questions correctly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Instructions */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">About This Quiz</h3>
        <div className="text-gray-600 space-y-2">
          <p>
            Understanding the difference between needs and wants is fundamental to smart financial planning. 
            Needs are essential for survival and basic well-being, while wants are things that improve your 
            quality of life but aren't strictly necessary.
          </p>
          <p>
            This quiz helps you practice identifying which category common expenses fall into - a crucial 
            skill for budgeting and saving money effectively.
          </p>
        </div>
      </div>
    </div>
  );
}