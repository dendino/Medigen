import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { CourseGenerator } from './components/CourseGenerator';
import { Dashboard } from './components/Dashboard';
import { FormData, GeneratedFile, User, AppView } from './types';

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
    setCurrentView('auth');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setAuthError(null);
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo credentials check
      if (email === 'demo@coursgen.fr' && password === 'demo123') {
        const newUser: User = {
          id: '1',
          email: email,
          name: 'Professeur Démonstration',
          provider: 'email'
        };
        
        setUser(newUser);
        localStorage.setItem('coursgen_user', JSON.stringify(newUser));
        setCurrentView('dashboard');
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful registration
      const newUser: User = {
        id: Date.now().toString(),
        email: email,
        name: name,
        provider: 'email'
      };
      
      setUser(newUser);
      localStorage.setItem('coursgen_user', JSON.stringify(newUser));
      setCurrentView('dashboard');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erreur lors de la création du compte');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful Google authentication
      const newUser: User = {
        id: 'google_' + Date.now(),
        email: 'professeur@gmail.com',
        name: 'Professeur Google',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        provider: 'google'
      };
      
      setUser(newUser);
      localStorage.setItem('coursgen_user', JSON.stringify(newUser));
      setCurrentView('dashboard');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erreur lors de la connexion avec Google');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('coursgen_user');
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
        <CourseGenerator onGenerate={handleGenerate} />
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