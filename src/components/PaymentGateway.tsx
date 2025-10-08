import React, { useState } from 'react';
import { CreditCard, Smartphone, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const PaymentGateway: React.FC = () => {
  const { state, dispatch } = useApp();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { id: 'bkash' as const, name: 'bKash', icon: '📱', color: 'bg-pink-500' },
    { id: 'nagad' as const, name: 'Nagad', icon: '💳', color: 'bg-orange-500' },
    { id: 'rocket' as const, name: 'Rocket', icon: '🚀', color: 'bg-purple-500' },
    { id: 'card' as const, name: 'Credit/Debit Card', icon: '💳', color: 'bg-blue-500' }
  ];

  const handlePayment = async () => {
    if (!amount || !transactionId || !state.currentUser) return;

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate payment processing
    setTimeout(() => {
      const newTransaction = {
        id: `txn-${Date.now()}`,
        studentId: state.currentUser!.id,
        amount: paymentAmount,
        method: paymentMethod,
        transactionId,
        status: 'completed' as const,
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_PAYMENT_TRANSACTION', payload: newTransaction });
      dispatch({
        type: 'UPDATE_STUDENT_BALANCE',
        payload: {
          studentId: state.currentUser!.id,
          amount: paymentAmount
        }
      });

      setIsProcessing(false);
      setPaymentSuccess(true);
      setAmount('');
      setTransactionId('');

      setTimeout(() => setPaymentSuccess(false), 3000);
    }, 2000);
  };

  const recentTransactions = state.paymentTransactions
    .filter(txn => txn.studentId === state.currentUser?.id)
    .slice(-5)
    .reverse();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add Balance Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Plus className="h-6 w-6 mr-2 text-green-600" />
            Add Balance
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Top up your account using mobile banking or card payment
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Current Balance</p>
                <p className="text-2xl font-bold text-blue-900">৳{state.currentUser?.balance.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Add (৳)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{method.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID / Reference Number
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID from your payment"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Complete the payment using your selected method and enter the transaction ID here
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {paymentSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Payment Successful!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your balance has been updated. You can now purchase meal tokens.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handlePayment}
            disabled={!amount || !transactionId || isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              amount && transactionId && !isProcessing
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Plus className="h-5 w-5 mr-2" />
                Add ৳{amount || '0'} to Balance
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2" />
          Payment Instructions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Mobile Banking (bKash/Nagad/Rocket)</h4>
            <ol className="space-y-1 text-gray-700">
              <li>1. Open your mobile banking app</li>
              <li>2. Send money to: <strong>01XXXXXXXXX</strong></li>
              <li>3. Enter the amount you want to add</li>
              <li>4. Complete the transaction</li>
              <li>5. Copy the transaction ID and paste it above</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Card Payment</h4>
            <ol className="space-y-1 text-gray-700">
              <li>1. Use our secure payment gateway</li>
              <li>2. Enter your card details</li>
              <li>3. Complete the payment</li>
              <li>4. Copy the reference number</li>
              <li>5. Paste it in the transaction ID field</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        
        <div className="p-6">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
              <p className="text-sm text-gray-500 mt-1">Your payment history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                      <Plus className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Balance Added</p>
                      <p className="text-sm text-gray-600">
                        {paymentMethods.find(m => m.id === transaction.method)?.name} • {transaction.transactionId}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">+৳{transaction.amount}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;