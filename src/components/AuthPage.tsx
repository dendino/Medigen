import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuthFormData, AuthErrors } from '../types';
import { resetPassword, signUpWithEmail } from '../api/supabase';
import { supabase } from '../api/supabase';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onGoogleAuth: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}




export function AuthPage({ onLogin, onRegister, onGoogleAuth, onBack, isLoading, error }: AuthPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [validationErrors, setValidationErrors] = useState<AuthErrors>({});
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errors: AuthErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Adresse email invalide";
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Le mot de passe est requis';
    } else if (!isLoginMode && formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    // Registration-specific validations
    if (!isLoginMode) {
      if (!formData.name?.trim()) {
        errors.name = 'Le nom est requis';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        if (isLoginMode) {
            const user = await onLogin(formData.email, formData.password);
            // Vérifier les crédits après connexion
            const { data, error } = await supabase.from('profiles').select('credit_balance, plan').eq('user_id', user.id).single();
            if (error) throw new Error(error.message);
            if (data.credit_balance < 1) {
                setAuthError("Crédits insuffisants pour générer des supports.");
                return;
            }
        } else {
            await handleRegister(formData.name!, formData.email, formData.password);
        }
    } catch (err: any) {
        // Gérer les erreurs ici
        setAuthError(err.message);
    }
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setValidationErrors({});
    setFormData({
      email: formData.email, // Keep email when switching modes
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const handleResetPassword = async (email: string) => {
    setAuthLoading(true);
    setAuthError(null);
    setResetMessage(null);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setResetMessage(error.message);
      } else {
        setResetMessage("Un email de réinitialisation a été envoyé. Vérifie ta boîte mail.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    setRegisterSuccess(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setAuthError("Email invalide. Veuillez vérifier le format.");
        return;
      }
      // Correction: signUpWithEmail now expects 4 arguments (email, password, name, options)
      const result = await signUpWithEmail(cleanEmail, password, name, "");
      // signUpWithEmail returns void, so we can't destructure data/error
      // Instead, check for errors via try/catch or handle error in signUpWithEmail
      // Here, we assume signUpWithEmail throws on error
      setRegisterSuccess("Compte créé ! Un email de confirmation vient d'être envoyé. Veuillez vérifier votre boîte mail avant de vous connecter.");
        // Optionnel : reset le formulaire
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        });
    } catch (error: any) {
      setAuthError(error?.message || "Erreur lors de la création du compte.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-teal-600">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold text-white">
                {isLoginMode ? 'Connexion' : 'Créer un compte'}
              </h2>
              <p className="text-blue-100 mt-1">
                {isLoginMode ? 'Accédez à vos supports de cours' : 'Rejoignez CoursGen Infirmier'}
              </p>
            </div>
            <div className="w-5" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Google Auth Button */}
          <button
            onClick={onGoogleAuth}
            disabled={authLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message (Registration only) */}
          {registerSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{registerSuccess}</span>
              </div>
            </div>
          )}

          {/* Error Message (Registration only) */}
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{authError}</span>
              </div>
            </div>
          )}

          {/* Password Reset Form */}
          {showReset ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleResetPassword(resetEmail);
              }}
              className="space-y-4 mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email pour réinitialiser le mot de passe
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="votre.email@institution.fr"
                disabled={authLoading}
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={authLoading}
              >
                {authLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setResetMessage(null);
                }}
                className="w-full mt-2 text-blue-600 hover:text-blue-700 font-medium"
                disabled={authLoading}
              >
                Retour à la connexion
              </button>
              {resetMessage && (
                <div className={`mt-2 flex items-center text-sm ${resetMessage.includes("envoyé") ? "text-green-600" : "text-red-600"}`}>
                  {resetMessage.includes("envoyé") ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                  {resetMessage}
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name (Registration only) */}
              {!isLoginMode && (
                <div>
                  <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Dr. Marie Dubois"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={authLoading}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.name}
                    </p>
                  )}
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
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value.trim() })}
                  placeholder="votre.email@institution.fr"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={authLoading}
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={isLoginMode ? 'Votre mot de passe' : 'Minimum 8 caractères'}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={authLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password (Registration only) */}
              {!isLoginMode && (
                <div>
                  <label htmlFor="confirmPassword" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 mr-2 text-blue-600" />
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword || ''}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirmez votre mot de passe"
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={authLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isLoginMode ? 'Connexion...' : 'Création du compte...'}
                  </span>
                ) : (
                  isLoginMode ? 'Se connecter' : 'Créer mon compte'
                )}
              </button>

              {/* Password Reset (Login mode only) */}
              {isLoginMode && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {/* Terms (Registration only) */}
              {!isLoginMode && (
                <div className="text-xs text-gray-500 text-center">
                  En créant un compte, vous acceptez nos{' '}
                  <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>
                  {' '}et notre{' '}
                  <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a>
                </div>
              )}

              {/* Mode Toggle */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={authLoading}
                >
                  {isLoginMode ? 
                    "Pas encore de compte ? Créer un compte" : 
                    "Déjà un compte ? Se connecter"
                  }
                </button>
              </div>
            </form>
          )}

          {/* Demo credentials for login mode */}
          {isLoginMode && (
            <div className="bg-gray-50 rounded-lg p-4 text-center mt-6">
              <p className="text-sm text-gray-600 mb-2">Compte de démonstration :</p>
              <p className="text-xs text-gray-500">
                Email: demo@coursgen.fr<br />
                Mot de passe: demo123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}