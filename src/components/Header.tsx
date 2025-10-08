import React, { useState } from 'react';
import { User, LogOut, Settings, Bell, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface HeaderProps {
  onViewChange: (view: string) => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onViewChange, currentView }) => {
  const { state, dispatch } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = state.userRole === 'manager' 
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'cancellation-approval', label: 'Cancellations' },
        { id: 'students-database', label: 'Students' }
      ]
    : state.userRole === 'admin'
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'students-database', label: 'Students Database' },
        { id: 'manager-assignment', label: 'Assign Managers' },
        { id: 'dining-month', label: 'Dining Month' },
        { id: 'cancellation-approval', label: 'Cancellations' }
      ]
    : [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'profile', label: 'Profile' },
        { id: 'purchase', label: 'Purchase Token' },
        { id: 'cancel', label: 'Cancel Meals' },
        { id: 'payment', label: 'Add Balance' },
        { id: 'billing', label: 'Billing' }
      ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const currentUserName = state.userRole === 'admin'
    ? state.currentAdmin?.name
    : state.userRole === 'manager' 
    ? state.currentManager?.name 
    : state.currentUser?.name;
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Hall Dining System</h1>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{currentUserName}</p>
                <p className="text-xs text-gray-500 capitalize">{state.userRole}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;