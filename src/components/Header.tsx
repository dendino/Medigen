import React, { useState, useEffect } from 'react';
import { GraduationCap, User, FileText, Plus, LogOut, Crown, Sparkles } from 'lucide-react';
import { supabase } from '../api/supabase';

interface HeaderProps {
  currentView: 'generator' | 'dashboard' | 'landing' | 'auth';
  onViewChange: (view: 'generator' | 'dashboard') => void;
  user: { 
    email: string; 
    name: string; 
    lastname: string; 
    avatar?: string; 
    plan: 'premium' | 'free';
    credit_balance?: number;
  } | null;
  onLogout: () => void;
  onRefreshUser?: () => void;
}

export function Header({ currentView, onViewChange, user, onLogout }: HeaderProps) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(`${user.user_metadata.name} ${user.user_metadata.lastname}`);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CoursGen Infirmier</h1>
            </div>
            
            {user && (
              <nav className="flex space-x-6">
                <button
                  onClick={() => onViewChange('generator')}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'generator'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau cours
                </button>
                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Mes fichiers
                </button>
              </nav>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="font-semibold text-gray-900">{user.name} {user.lastname}</span>
                <div className="flex items-center mt-1 space-x-2">
                  {user.plan === 'premium' ? (
                    <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  ) : (
                    <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Gratuit
                    </div>
                  )}
                  {user.credit_balance !== undefined && (
                    <div className="text-xs text-gray-500">
                      {user.credit_balance} crédit{user.credit_balance > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
