import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDate } from '../utils/dateUtils';

const CancellationApproval: React.FC = () => {
  const { state, dispatch } = useApp();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingCancellations = state.cancelledDays.filter(day => day.status === 'pending');
  const processedCancellations = state.cancelledDays.filter(day => day.status !== 'pending');

  const handleApproval = async (cancellationId: string, status: 'approved' | 'denied') => {
    if (!state.currentManager) return;

    setProcessingId(cancellationId);

    setTimeout(() => {
      const cancellation = state.cancelledDays.find(day => day.id === cancellationId);
      
      if (cancellation && status === 'approved') {
        // Add refund to student's balance
        dispatch({
          type: 'UPDATE_STUDENT_BALANCE',
          payload: {
            studentId: cancellation.studentId,
            amount: cancellation.refundAmount
          }
        });
      }

      // Update cancellation status
      dispatch({
        type: 'UPDATE_CANCELLED_DAY_STATUS',
        payload: {
          id: cancellationId,
          status,
          approvedBy: state.currentManager!.id
        }
      });

      setProcessingId(null);
    }, 1000);
  };

  const getStudentName = (studentId: string) => {
    const student = state.students.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStudentRegNumber = (studentId: string) => {
    const student = state.students.find(s => s.id === studentId);
    return student?.registrationNumber || 'N/A';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Pending Approvals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-yellow-600" />
            Pending Cancellation Requests
            {pendingCancellations.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {pendingCancellations.length}
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve student meal cancellation requests
          </p>
        </div>

        <div className="p-6">
          {pendingCancellations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending cancellation requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCancellations.map((cancellation) => (
                <div key={cancellation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{getStudentName(cancellation.studentId)}</h3>
                          <p className="text-sm text-gray-600">{getStudentRegNumber(cancellation.studentId)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Cancellation Date</p>
                          <p className="text-gray-900 font-semibold">{formatDate(cancellation.cancelledDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Meal Type</p>
                          <p className="text-gray-900 font-semibold capitalize">
                            {cancellation.mealType === 'both' ? 'Lunch + Dinner' : cancellation.mealType}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Refund Amount</p>
                          <p className="text-gray-900 font-semibold">৳{cancellation.refundAmount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Request Date</p>
                          <p className="text-gray-900">{formatDate(cancellation.requestDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 ml-6">
                      <button
                        onClick={() => handleApproval(cancellation.id, 'approved')}
                        disabled={processingId === cancellation.id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === cancellation.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </button>
                      
                      <button
                        onClick={() => handleApproval(cancellation.id, 'denied')}
                        disabled={processingId === cancellation.id}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === cancellation.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Processed Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Processed Requests
          </h3>
        </div>

        <div className="p-6">
          {processedCancellations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No processed requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedCancellations.slice(-10).reverse().map((cancellation) => (
                <div key={cancellation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{getStudentName(cancellation.studentId)}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        cancellation.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cancellation.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p>Date: {formatDate(cancellation.cancelledDate)}</p>
                      </div>
                      <div>
                        <p>Meal: {cancellation.mealType === 'both' ? 'Lunch + Dinner' : cancellation.mealType}</p>
                      </div>
                      <div>
                        <p>Refund: ৳{cancellation.refundAmount}</p>
                      </div>
                      <div>
                        <p>Processed: {cancellation.approvedAt ? formatDate(cancellation.approvedAt) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCancellations.length}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-3xl font-bold text-green-600">
                {processedCancellations.filter(c => 
                  c.status === 'approved' && 
                  c.approvedAt && 
                  new Date(c.approvedAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Refunds</p>
              <p className="text-3xl font-bold text-blue-600">
                ৳{processedCancellations
                  .filter(c => c.status === 'approved')
                  .reduce((sum, c) => sum + c.refundAmount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationApproval;