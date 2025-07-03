import React from 'react';
import { GraduationCap, User, FileText, Plus, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'generator' | 'dashboard' | 'landing' | 'auth';
  onViewChange: (view: 'generator' | 'dashboard') => void;
  user: { email: string; name: string; avatar?: string } | null;
  onLogout: () => void;
}

export function Header({ currentView, onViewChange, user, onLogout }: HeaderProps) {
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
              <div className="flex items-center text-sm text-gray-700">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : (
                  <User className="w-4 h-4 mr-2" />
                )}
                <span>{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}