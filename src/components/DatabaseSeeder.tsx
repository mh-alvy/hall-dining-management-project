import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import { seedDatabase } from '../lib/seedData';
import { supabase } from '../lib/supabase';

const DatabaseSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [needsSeeding, setNeedsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkIfSeeded();
  }, []);

  async function checkIfSeeded() {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      if (count === 0) {
        setNeedsSeeding(true);
      } else {
        setIsSeeded(true);
      }
    } catch (err) {
      console.error('Error checking if seeded:', err);
    }
  }

  async function handleSeed() {
    setIsSeeding(true);
    setError(null);

    const result = await seedDatabase();

    if (result.success) {
      setIsSeeded(true);
      setNeedsSeeding(false);
    } else {
      setError(result.error?.toString() || 'Unknown error occurred');
    }

    setIsSeeding(false);
  }

  if (isSeeded) {
    return null;
  }

  if (!needsSeeding) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <Database className="h-8 w-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Database Setup Required
          </h2>

          <p className="text-gray-600 mb-6">
            The database needs to be initialized with demo data. This will create sample users and set up the system.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSeeding ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Initializing Database...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Initialize Database
              </div>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            This will create demo users with the credentials shown on the login page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSeeder;
