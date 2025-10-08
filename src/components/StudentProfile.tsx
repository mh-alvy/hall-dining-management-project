import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Camera, Save, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const StudentProfile: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const currentStudent = state.userRole === 'student' 
    ? state.currentUser 
    : state.userRole === 'admin' && state.students.length > 0 
    ? state.students[0] // For demo purposes when admin is viewing
    : null;

  if (!currentStudent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load student profile information.</p>
        </div>
      </div>
    );
  }

  const handlePhotoUpdate = () => {
    if (!newPhotoUrl.trim()) return;

    dispatch({
      type: 'UPDATE_STUDENT_PHOTO',
      payload: {
        studentId: currentStudent.id,
        profilePhoto: newPhotoUrl
      }
    });

    setIsEditingPhoto(false);
    setNewPhotoUrl('');
  };

  const canEditPhoto = state.userRole === 'student';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Photo */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {currentStudent.profilePhoto ? (
                <img
                  src={currentStudent.profilePhoto}
                  alt={currentStudent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {canEditPhoto && (
              <button
                onClick={() => setIsEditingPhoto(true)}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentStudent.name}</h1>
            <p className="text-lg text-blue-600 font-medium mb-4">{currentStudent.studentId}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{currentStudent.department}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Room {currentStudent.roomNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Edit Modal */}
      {isEditingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Profile Photo</h3>
              <button
                onClick={() => {
                  setIsEditingPhoto(false);
                  setNewPhotoUrl('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {newPhotoUrl && (
                <div className="text-center">
                  <img
                    src={newPhotoUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handlePhotoUpdate}
                  disabled={!newPhotoUrl.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Photo
                </button>
                <button
                  onClick={() => {
                    setIsEditingPhoto(false);
                    setNewPhotoUrl('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">{currentStudent.name}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">{currentStudent.studentId}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">{currentStudent.registrationNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">{currentStudent.email}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">{currentStudent.phoneNumber}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">Room {currentStudent.roomNumber}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900 font-medium">{currentStudent.department}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-2xl font-bold text-green-600">৳{currentStudent.balance.toLocaleString()}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hall ID</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{currentStudent.hallId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note for Students */}
      {state.userRole === 'student' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Camera className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Profile Photo Update</p>
              <p className="text-sm text-blue-700 mt-1">
                You can update your profile photo by clicking the camera icon. Other information can only be updated by the Hall Admin.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;