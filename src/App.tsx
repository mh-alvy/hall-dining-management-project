import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { useApp } from './contexts/AppContext';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';
import StudentsDatabase from './components/StudentsDatabase';
import ManagerAssignment from './components/ManagerAssignment';
import TokenPurchase from './components/TokenPurchase';
import MealCancellation from './components/MealCancellation';
import PaymentGateway from './components/PaymentGateway';
import Billing from './components/Billing';
import DiningMonthManager from './components/DiningMonthManager';
import CancellationApproval from './components/CancellationApproval';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!state.isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <StudentProfile />;
      case 'students-database':
        return <StudentsDatabase />;
      case 'manager-assignment':
        return <ManagerAssignment />;
      case 'purchase':
        return <TokenPurchase />;
      case 'cancel':
        return <MealCancellation />;
      case 'payment':
        return <PaymentGateway />;
      case 'billing':
        return <Billing />;
      case 'dining-month':
        return <DiningMonthManager />;
      case 'cancellation-approval':
        return <CancellationApproval />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onViewChange={setCurrentView} currentView={currentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;