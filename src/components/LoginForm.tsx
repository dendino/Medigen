import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, BookOpen } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'L\'adresse email est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Adresse email invalide';
    }
    
    if (!password.trim()) {
      errors.password = 'Le mot de passe est requis';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onLogin(email, password);
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-teal-600 text-center">
          <div className="mb-4">
            <BookOpen className="w-12 h-12 text-white mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white">Connexion</h2>
          <p className="text-blue-100 mt-1">Accédez à vos supports de cours</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="votre.email@institution.fr"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 mr-2 text-blue-600" />
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors(prev => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="Votre mot de passe"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>

          {/* Demo credentials */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Compte de démonstration :</p>
            <p className="text-xs text-gray-500">
              Email: demo@coursgen.fr<br />
              Mot de passe: demo123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}