import React from 'react';
import { Receipt, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDate } from '../utils/dateUtils';

const Billing: React.FC = () => {
  const { state } = useApp();
  
  const userTokens = state.tokens.filter(token => token.studentId === state.currentUser?.id);
  const userCancellations = state.cancelledDays.filter(day => day.studentId === state.currentUser?.id);
  
  const totalSpent = userTokens.reduce((sum, token) => sum + token.totalCost, 0);
  const totalRefunds = userCancellations
    .filter(day => day.status === 'approved')
    .reduce((sum, day) => sum + day.refundAmount, 0);
  const pendingRefunds = userCancellations
    .filter(day => day.status === 'pending')
    .reduce((sum, day) => sum + day.refundAmount, 0);
  
  const netSpent = totalSpent - totalRefunds;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">৳{totalSpent.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Refunds</p>
              <p className="text-2xl font-bold text-green-600">৳{totalRefunds.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Refunds</p>
              <p className="text-2xl font-bold text-yellow-600">৳{pendingRefunds.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Spent</p>
              <p className="text-2xl font-bold text-gray-900">৳{netSpent.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Purchase History
          </h2>
        </div>
        
        <div className="p-6">
          {userTokens.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No purchases yet</p>
              <p className="text-sm text-gray-500 mt-1">Your token purchases will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userTokens.map((token) => (
                <div key={token.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {token.duration}-Day {token.mealType === 'lunch' ? 'Lunch Only' : 'Lunch + Dinner'} Token
                      </h3>
                      <span className="text-lg font-bold text-gray-900">৳{token.totalCost}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Purchase Date</p>
                        <p>{formatDate(token.purchaseDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Start Date</p>
                        <p>{formatDate(token.startDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium">End Date</p>
                        <p>{formatDate(token.endDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Status</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          token.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {token.isActive ? 'Active' : 'Expired'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Refund History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Refund History</h2>
        </div>
        
        <div className="p-6">
          {userCancellations.length === 0 ? (
            <div className="text-center py-8">
              <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No refund requests yet</p>
              <p className="text-sm text-gray-500 mt-1">Your meal cancellations and refunds will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userCancellations.map((cancellation) => (
                <div key={cancellation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        Meal Cancellation - {formatDate(cancellation.cancelledDate)}
                      </h3>
                      <span className="text-lg font-bold text-gray-900">৳{cancellation.refundAmount}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Request Date</p>
                        <p>{formatDate(cancellation.requestDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Meal Type</p>
                        <p className="capitalize">
                          {cancellation.mealType === 'both' ? 'Lunch + Dinner' : cancellation.mealType}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Refund Amount</p>
                        <p>৳{cancellation.refundAmount}</p>
                      </div>
                      <div>
                        <p className="font-medium">Status</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          cancellation.status === 'approved' ? 'bg-green-100 text-green-800' :
                          cancellation.status === 'denied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cancellation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Billing Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Tokens Purchased</p>
            <p className="text-xl font-bold text-blue-600">{userTokens.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Meals Cancelled</p>
            <p className="text-xl font-bold text-orange-600">{userCancellations.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Average Token Cost</p>
            <p className="text-xl font-bold text-green-600">
              ৳{userTokens.length > 0 ? Math.round(totalSpent / userTokens.length) : 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Refund Rate</p>
            <p className="text-xl font-bold text-purple-600">
              {totalSpent > 0 ? Math.round((totalRefunds / totalSpent) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;