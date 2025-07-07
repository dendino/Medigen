import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { CourseGenerator } from './components/CourseGenerator';
import { Dashboard } from './components/Dashboard';
import { FormData, GeneratedFile, User, AppView } from './types';
import { sendCourseToN8N } from './api/n8n';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from './api/supabase';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('coursgen_user');
    const savedFiles = localStorage.getItem('coursgen_files');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
    
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      // Convert createdAt strings back to Date objects
      const filesWithDates = parsedFiles.map((file: any) => ({
        ...file,
        createdAt: new Date(file.createdAt)
      }));
      setFiles(filesWithDates);
    }
  }, []);

  // Save files to localStorage whenever files change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('coursgen_files', JSON.stringify(files));
    }
  }, [files]);

  const handleGetStarted = () => {
    setCurrentView('auth'); // ou 'register' selon ton flow
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setAuthError(null);
  };

  // Connexion email
  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        setAuthError(error.message);
      } else if (!data.user.email_confirmed_at) {
        // Email non vérifié
        alert("Veuillez vérifier votre email avant de continuer.");
        await signOut();
        setCurrentView('auth');
      } else {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email || '',
          avatar: data.user.user_metadata?.avatar_url,
          provider: (data.user.app_metadata?.provider as "email" | "google" | undefined) || 'email'
        });
        setCurrentView('dashboard');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setAuthLoading(false);
    }
  };

  // Inscription email
  const handleRegister = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await signUpWithEmail(email, password);
      if (error) {
        setAuthError(error.message);
      } else {
        // Affiche un message de confirmation
        alert("Un email de confirmation vient d'être envoyé. Veuillez vérifier votre boîte mail.");
        // Redirige vers la page de connexion ou une page d'attente
        setCurrentView('auth'); // ou une vue spéciale "Vérification email"
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Connexion Google
  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { error } = await signInWithGoogle();
      if (error) setAuthError(error.message);
      // Redirection automatique par Supabase après succès
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erreur lors de la connexion avec Google');
    } finally {
      setAuthLoading(false);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setCurrentView('landing');
  };

  const handleGenerate = async (formData: FormData) => {
    // Simulate file generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newFiles: GeneratedFile[] = [
      {
        id: `ppt-${Date.now()}`,
        title: `${formData.moduleTitle} - Présentation`,
        createdAt: new Date(),
        type: 'powerpoint',
        fileUrl: '#',
        status: 'ready'
      },
      {
        id: `doc-${Date.now()}`,
        title: `${formData.moduleTitle} - Résumé`,
        createdAt: new Date(),
        type: 'word',
        fileUrl: '#',
        status: 'ready'
      }
    ];

    setFiles(prev => [...newFiles, ...prev]);
  };

  const handleDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      // Simulate file download
      const link = document.createElement('a');
      link.href = file.fileUrl;
      link.download = `${file.title}.${file.type === 'powerpoint' ? 'pptx' : 'docx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert(`Téléchargement de "${file.title}" commencé !`);
    }
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const handleRefresh = () => {
    // Simulate refresh - in real app, this would fetch from API
    console.log('Refreshing files...');
  };

  const handleViewChange = (view: 'generator' | 'dashboard') => {
    setCurrentView(view);
  };

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (currentView === 'auth') {
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGoogleAuth={handleGoogleAuth}
        onBack={handleBackToLanding}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView}
        onViewChange={handleViewChange}
        user={user}
        onLogout={handleLogout}
      />
      
      {currentView === 'generator' && (
        <CourseGenerator onGenerate={sendCourseToN8N} />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          files={files}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}

export default App;