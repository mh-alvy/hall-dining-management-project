import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle, Clock, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDate, addDays, getDiningDayNumber } from '../utils/dateUtils';

const DiningMonthManager: React.FC = () => {
  const { state, dispatch } = useApp();
  const [monthName, setMonthName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const activeDiningMonth = state.diningMonths.find(dm => dm.isActive);
  const today = new Date().toISOString().split('T')[0];

  const handleCreateDiningMonth = async () => {
    if (!monthName || !startDate || !endDate || state.userRole !== 'admin') return;

    setIsCreating(true);

    setTimeout(() => {
      const newDiningMonth = {
        id: `dm-${Date.now()}`,
        name: monthName,
        startDate,
        endDate,
        isActive: true,
        createdBy: state.currentAdmin!.id,
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_DINING_MONTH', payload: newDiningMonth });
      
      setIsCreating(false);
      setCreateSuccess(true);
      setMonthName('');
      setStartDate('');
      setEndDate('');
      
      setTimeout(() => setCreateSuccess(false), 3000);
    }, 1500);
  };

  const getCurrentDayNumber = () => {
    if (!activeDiningMonth) return null;
    return getDiningDayNumber(today, activeDiningMonth.startDate);
  };

  const getDayNumberForDate = (date: string) => {
    if (!activeDiningMonth) return null;
    return getDiningDayNumber(date, activeDiningMonth.startDate);
  };

  // Only allow admin to create dining months
  if (state.userRole !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only Hall Admin can create and manage dining months.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Current Dining Month Status */}
      {activeDiningMonth && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
              Active Dining Month
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Day {getCurrentDayNumber()} of 30
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Start Date</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(activeDiningMonth.startDate)}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">End Date</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(activeDiningMonth.endDate)}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Days Remaining</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.max(0, 30 - (getCurrentDayNumber() || 0) + 1)} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create New Dining Month */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Plus className="h-6 w-6 mr-2 text-blue-600" />
            Create New Dining Month
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Create a new dining period for students
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month Name
            </label>
            <input
              type="text"
              value={monthName}
              onChange={(e) => setMonthName(e.target.value)}
              placeholder="e.g., January 2025, Spring Semester"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month Starting Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month Ending Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            
            {startDate && endDate && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Duration:</strong> {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </p>
              </div>
            )}
          </div>

          {createSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Dining Month Created Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    The new dining period is now active and students can purchase tokens.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleCreateDiningMonth}
            disabled={!monthName || !startDate || !endDate || isCreating}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              monthName && startDate && endDate && !isCreating
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isCreating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Dining Month...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Calendar className="h-5 w-5 mr-2" />
                Create Dining Month
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Day Number Calculator */}
      {activeDiningMonth && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Day Number Calculator
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 font-medium">Month Name</p>
                <p className="text-lg font-semibold text-gray-900">{activeDiningMonth.name}</p>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={activeDiningMonth.startDate}
                  max={activeDiningMonth.endDate}
                  onChange={(e) => {
                    const dayNum = getDayNumberForDate(e.target.value);
                    const resultDiv = document.getElementById('day-result');
                    if (resultDiv && dayNum) {
                      resultDiv.textContent = `Day ${dayNum} of 30`;
                      resultDiv.className = 'text-2xl font-bold text-blue-600';
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Day Number</p>
                  <div id="day-result" className="text-2xl font-bold text-gray-400">
                    Select a date
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Dining Month History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dining Month History</h3>
        </div>
        
        <div className="p-6">
          {state.diningMonths.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No dining months created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.diningMonths.map((month) => (
                <div key={month.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        month.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {month.isActive ? 'Active' : 'Completed'}
                      </span>
                      <p className="font-medium text-gray-900">{month.name}</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="font-medium text-gray-900">
                        {formatDate(month.startDate)} - {formatDate(month.endDate)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Created on {formatDate(month.createdAt)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {Math.ceil((new Date(month.endDate).getTime() - new Date(month.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} Days
                    </p>
                    {month.isActive && (
                      <p className="text-xs text-green-600 font-medium">
                        Day {getCurrentDayNumber()}
                      </p>
                    )}
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

export default DiningMonthManager;