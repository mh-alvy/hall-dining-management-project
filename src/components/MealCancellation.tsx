import React, { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { isDateValid, formatDate, isTokenActive } from '../utils/dateUtils';
import { calculateRefund } from '../utils/pricing';

const MealCancellation: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'lunch' | 'dinner' | 'both'>('both');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const activeTokens = state.tokens.filter(token => 
    token.studentId === state.currentUser?.id && isTokenActive(token)
  );

  const handleCancellation = async () => {
    if (!state.currentUser || !selectedDate) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const refundAmount = calculateRefund(selectedMealType);
      
      const newCancellation = {
        id: `cancel-${Date.now()}`,
        studentId: state.currentUser!.id,
        tokenId: activeTokens[0]?.id || '',
        cancelledDate: selectedDate,
        mealType: selectedMealType,
        refundAmount,
        requestDate: new Date().toISOString(),
        status: 'pending' as const
      };

      dispatch({ type: 'ADD_CANCELLED_DAY', payload: newCancellation });
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSelectedDate('');
      
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  const isValidDate = selectedDate ? isDateValid(selectedDate) : false;
  const refundAmount = selectedMealType ? calculateRefund(selectedMealType) : 0;

  const pendingCancellations = state.cancelledDays.filter(
    day => day.studentId === state.currentUser?.id && day.status === 'pending'
  );

  const mealTypeOptions = [
    { value: 'lunch' as const, label: 'Lunch Only', refund: calculateRefund('lunch') },
    { value: 'dinner' as const, label: 'Dinner Only', refund: calculateRefund('dinner') },
    { value: 'both' as const, label: 'Both Meals', refund: calculateRefund('both') }
  ];

  if (activeTokens.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Tokens</h2>
          <p className="text-gray-600 mb-6">
            You need an active meal token to cancel meals. Purchase a token first to start using this feature.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Purchase Token
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cancellation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-orange-600" />
            Cancel Meals
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Cancel meals at least 2 days in advance for 90% refund
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date to Cancel
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {selectedDate && !isValidDate && (
              <div className="mt-2 flex items-start text-red-600">
                <AlertTriangle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Cancellation must be requested at least 2 days in advance.
                </p>
              </div>
            )}
          </div>

          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Meals to Cancel
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mealTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                    selectedMealType === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMealType(option.value)}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={selectedMealType === option.value}
                        onChange={() => setSelectedMealType(option.value)}
                        className="w-4 h-4 text-orange-600"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Refund: ৳{option.refund}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Information */}
          {selectedDate && isValidDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Cancellation Summary</h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                <p><strong>Meals:</strong> {selectedMealType === 'both' ? 'Lunch + Dinner' : selectedMealType === 'lunch' ? 'Lunch Only' : 'Dinner Only'}</p>
                <p><strong>Refund Amount:</strong> ৳{refundAmount} (90% of meal cost)</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Cancellation Request Submitted</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your request has been submitted and is pending approval. You'll be notified once it's processed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleCancellation}
            disabled={!selectedDate || !isValidDate || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selectedDate && isValidDate && !isSubmitting
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting Request...
              </div>
            ) : (
              'Submit Cancellation Request'
            )}
          </button>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingCancellations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Cancellation Requests</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {pendingCancellations.map((cancellation) => (
                <div key={cancellation.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(cancellation.cancelledDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {cancellation.mealType === 'both' ? 'Lunch + Dinner' : 
                       cancellation.mealType === 'lunch' ? 'Lunch Only' : 'Dinner Only'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested on {formatDate(cancellation.requestDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">৳{cancellation.refundAmount}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Policy */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-gray-600" />
          Cancellation Policy
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Meal cancellations must be requested at least 2 days before the meal date</p>
          <p>• Cancellation requests made less than 2 days in advance will be automatically denied</p>
          <p>• Approved cancellations receive a 90% refund (10% processing fee applies)</p>
          <p>• Refunds are processed within 2-3 business days after approval</p>
          <p>• You can only cancel meals within your active token period</p>
        </div>
      </div>
    </div>
  );
};

export default MealCancellation;