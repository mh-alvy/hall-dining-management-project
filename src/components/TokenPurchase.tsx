import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { calculateTokenPrice } from '../utils/pricing';
import { addDays } from '../utils/dateUtils';

const TokenPurchase: React.FC = () => {
  const { state, dispatch } = useApp();
  const [duration, setDuration] = useState<5 | 7 | 15 | 30>(7);
  const [mealType, setMealType] = useState<'lunch' | 'lunch_dinner'>('lunch_dinner');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const totalCost = calculateTokenPrice(duration, mealType);
  const canAfford = (state.currentUser?.balance || 0) >= totalCost;
  const activeDiningMonth = state.diningMonths.find(dm => dm.isActive);

  const handlePurchase = async () => {
    if (!state.currentUser || !canAfford || !activeDiningMonth) return;

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const startDate = new Date();
      const endDate = addDays(startDate, duration);
      
      const newToken = {
        id: `token-${Date.now()}`,
        studentId: state.currentUser!.id,
        duration,
        mealType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalCost,
        isActive: true,
        purchaseDate: new Date().toISOString(),
        diningMonthId: activeDiningMonth!.id
      };

      dispatch({ type: 'ADD_TOKEN', payload: newToken });
      dispatch({ 
        type: 'UPDATE_STUDENT_BALANCE', 
        payload: { studentId: state.currentUser!.id, amount: -totalCost }
      });

      setIsProcessing(false);
      setPurchaseSuccess(true);
      
      setTimeout(() => setPurchaseSuccess(false), 3000);
    }, 2000);
  };

  const mealOptions = [
    { value: 'lunch' as const, label: 'Lunch Only', description: 'Available for 5 or 7 days only' },
    { value: 'lunch_dinner' as const, label: 'Lunch + Dinner', description: 'Available for all durations' }
  ];

  const durationOptions = mealType === 'lunch' 
    ? [5, 7] as const
    : [5, 7, 15, 30] as const;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Purchase Meal Token
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Select your preferred meal plan and duration
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Meal Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mealOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                    mealType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setMealType(option.value);
                    if (option.value === 'lunch' && duration > 7) {
                      setDuration(7);
                    }
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={mealType === option.value}
                        onChange={() => setMealType(option.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {durationOptions.map((days) => (
                <button
                  key={days}
                  onClick={() => setDuration(days)}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                    duration === days
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{days} Days</div>
                  <div className="text-xs text-gray-500 mt-1">
                    ৳{calculateTokenPrice(days, mealType)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Special Pricing Notice */}
          {mealType === 'lunch_dinner' && (duration === 15 || duration === 30) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Special Offer!</p>
                  <p className="text-sm text-green-700 mt-1">
                    This {duration}-day package includes special mini feasts at a discounted rate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cost Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Cost Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meal Type:</span>
                <span className="font-medium">
                  {mealType === 'lunch' ? 'Lunch Only' : 'Lunch + Dinner'}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-900 font-medium">Total Cost:</span>
                <span className="text-lg font-bold text-gray-900">৳{totalCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                  ৳{state.currentUser?.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {!canAfford && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">Insufficient Balance</p>
                  <p className="text-sm text-red-700 mt-1">
                    You need ৳{(totalCost - (state.currentUser?.balance || 0)).toLocaleString()} more to purchase this token.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Success */}
          {purchaseSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Purchase Successful!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your meal token has been activated and is ready to use.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={!canAfford || isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              canAfford && !isProcessing
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Purchase...
              </div>
            ) : (
              `Purchase Token for ৳${totalCost}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchase;