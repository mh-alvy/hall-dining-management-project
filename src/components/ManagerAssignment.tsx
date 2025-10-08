import React, { useState } from 'react';
import { Users, UserCheck, Calendar, Save, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ManagerAssignment: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedDiningMonth, setSelectedDiningMonth] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const selectedDiningMonthData = state.diningMonths.find(dm => dm.id === selectedDiningMonth);
  const currentManagers = selectedDiningMonthData ? 
    state.managers.filter(m => m.diningMonthId === selectedDiningMonthData.id) : [];

  const availableStudents = state.students.filter(student => 
    !currentManagers.some(manager => manager.studentId === student.id)
  );

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else if (prev.length < 2) {
        return [...prev, studentId];
      }
      return prev;
    });
  };

  const handleAssignManagers = async () => {
    if (!selectedDiningMonth || selectedStudents.length !== 2) return;

    setIsAssigning(true);

    setTimeout(() => {
      dispatch({
        type: 'ASSIGN_MANAGERS',
        payload: {
          diningMonthId: selectedDiningMonth,
          managerIds: selectedStudents
        }
      });

      setIsAssigning(false);
      setAssignSuccess(true);
      setSelectedStudents([]);

      setTimeout(() => setAssignSuccess(false), 3000);
    }, 1500);
  };

  if (state.diningMonths.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Dining Months Available</h2>
          <p className="text-gray-600">Create a dining month first to assign managers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
          <UserCheck className="h-7 w-7 mr-3 text-blue-600" />
          Manager Assignment
        </h1>
        <p className="text-gray-600">
          Assign 2 students as managers for the current dining month
        </p>
      </div>

      {/* Current Managers */}
      {currentManagers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-green-600" />
              Current Managers
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentManagers.map((manager) => {
                const student = state.students.find(s => s.id === manager.studentId);
                return (
                  <div key={manager.id} className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                      {student?.profilePhoto ? (
                        <img
                          src={student.profilePhoto}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{manager.name}</h3>
                      <p className="text-sm text-gray-600">{student?.studentId}</p>
                      <p className="text-xs text-green-600">
                        Assigned on {new Date(manager.assignedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-green-600">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dining Month Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select Dining Month</h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose which dining month to assign managers for
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dining Month
              </label>
              <select
                value={selectedDiningMonth}
                onChange={(e) => {
                  setSelectedDiningMonth(e.target.value);
                  setSelectedStudents([]); // Reset selected students when changing dining month
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a dining month...</option>
                {state.diningMonths.map((month) => (
                  <option key={month.id} value={month.id}>
                    {month.name} ({formatDate(month.startDate)} - {formatDate(month.endDate)})
                    {month.isActive ? ' - Active' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedDiningMonthData && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">{selectedDiningMonthData.name}</p>
                <p className="text-xs text-blue-600">
                  {formatDate(selectedDiningMonthData.startDate)} - {formatDate(selectedDiningMonthData.endDate)}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  selectedDiningMonthData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedDiningMonthData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Selection */}
      {selectedDiningMonth && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentManagers.length > 0 ? 'Reassign Managers' : 'Select New Managers'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose exactly 2 students to serve as managers for {selectedDiningMonthData?.name}
          </p>
        </div>
        
        <div className="p-6">
          {assignSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <UserCheck className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Managers Assigned Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    The selected students have been assigned as managers for the current dining month.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableStudents.map((student) => (
              <div
                key={student.id}
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                  selectedStudents.includes(student.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStudentToggle(student.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                    {student.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.studentId}</p>
                    <p className="text-xs text-gray-500">{student.department}</p>
                  </div>
                  {selectedStudents.includes(student.id) && (
                    <div className="text-blue-600">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedStudents.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Selected Students ({selectedStudents.length}/2)
              </h3>
              <div className="space-y-2">
                {selectedStudents.map(studentId => {
                  const student = state.students.find(s => s.id === studentId);
                  return (
                    <div key={studentId} className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">{student?.name} ({student?.studentId})</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentToggle(studentId);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleAssignManagers}
            disabled={selectedStudents.length !== 2 || isAssigning || !selectedDiningMonth}
            className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selectedStudents.length === 2 && !isAssigning && selectedDiningMonth
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAssigning ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning Managers...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Save className="h-5 w-5 mr-2" />
                {currentManagers.length > 0 ? 'Reassign Managers' : 'Assign as Managers'}
              </div>
            )}
          </button>
        </div>
      </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Assignment Guidelines</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Exactly 2 students must be selected as managers for each dining month</p>
          <p>• Managers will have access to approve meal cancellations and view system statistics</p>
          <p>• Manager assignments are tied to specific dining months</p>
          <p>• Students can see current managers in their dashboard</p>
          <p>• Only Hall Admin can assign or reassign managers</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerAssignment;