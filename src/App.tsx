import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { CourseGenerator } from './components/CourseGenerator';
import { Dashboard } from './components/Dashboard';
import { FormData, GeneratedFile, User, AppView } from './types';
import { sendCourseToN8N } from './api/n8n';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, incrementGenerationCount, checkUserCredits } from './api/supabase';
import { supabase } from './api/supabase';

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
        // Récupère le profil à jour depuis la table profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('plan, credit_balance, first_name, last_name')
          .eq('id', data.user.id)
          .single();

        // Fallback sur user_metadata si besoin
        const name = profile?.first_name || data.user.user_metadata?.name || '';
        const lastname = profile?.last_name || data.user.user_metadata?.lastname || '';

        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name,
          lastname,
          avatar: data.user.user_metadata?.avatar_url,
          provider: (data.user.app_metadata?.provider as "email" | "google" | undefined) || 'email',
          plan: profile?.plan || 'free',
          credit_balance: profile?.credit_balance ?? 0,
          generation_count: data.user.user_metadata?.generation_count ?? 0
        };

        setUser(userData);
        localStorage.setItem('coursgen_user', JSON.stringify(userData));
        setCurrentView('dashboard');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setAuthLoading(false);
    }
  };

  // Inscription email
  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await signUpWithEmail(email, password, name, '');
      // Affiche un message de confirmation
      alert("Un email de confirmation vient d'être envoyé. Veuillez vérifier votre boîte mail.");
      setCurrentView('auth');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
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
    localStorage.removeItem('coursgen_user');
    setCurrentView('landing');
  };

  // Fonction pour actualiser les données utilisateur depuis la DB
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      const { data: creditsData, error: creditsError } = await checkUserCredits(user.id);
      if (creditsError) {
        console.error('Erreur lors de la vérification des crédits:', creditsError);
        return;
      }

      const updatedUser = {
        ...user,
        plan: creditsData?.plan || 'free',
        credit_balance: creditsData?.credit_balance || 0
      };

      setUser(updatedUser);
      localStorage.setItem('coursgen_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error);
    }
  };

  // Actualisation automatique toutes les 30 secondes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshUserData();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [user]);

  // Actualisation immédiate lors du changement de vue
  useEffect(() => {
    if (user && (currentView === 'generator' || currentView === 'dashboard')) {
      refreshUserData();
    }
  }, [currentView, user]);

  const handleGenerate = async (formData: FormData) => {
    if (!user) throw new Error("Utilisateur non connecté");
    
    try {
      // Actualiser les données utilisateur AVANT la génération
      await refreshUserData();
      
      // Récupérer les données fraîches
      const { data: creditsData, error: creditsError } = await checkUserCredits(user.id);
      if (creditsError) throw new Error("Erreur lors de la vérification des crédits");
      
      if (!creditsData) throw new Error("Profil utilisateur non trouvé");
      
      // Vérifier si l'utilisateur a assez de crédits avec les données fraîches
      const creditCost = formData.courseFormat === 'court' ? 1 : 
                        formData.courseFormat === 'intermédiaire' ? 2 : 3;
      
      if (creditsData.plan === 'free') {
        if (formData.courseFormat !== 'court') {
          throw new Error("Format réservé aux abonnés premium");
        }
        if (creditsData.credit_balance < 1) {
          throw new Error("Limite de génération gratuite atteinte");
        }
      } else if (creditsData.plan === 'premium') {
        if (creditsData.credit_balance < creditCost) {
          throw new Error(`Crédits insuffisants. Coût: ${creditCost}, Disponible: ${creditsData.credit_balance}`);
        }
      }

      // Récupérer le JWT
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Token JWT manquant");

      // Préparer les données pour n8n
      const payload = {
        title: formData.moduleTitle,
        level: formData.studentLevel,
        chapters: formData.chapters,
        duration: formData.duration,
        format: formData.courseFormat,
        email: formData.email,
        user_id: user.id,
        token
      };

      // Appel au backend n8n
      const result = await sendCourseToN8N(payload);

      // Créer les fichiers générés
      const newFiles: GeneratedFile[] = [
        {
          id: `ppt-${Date.now()}`,
          title: `${formData.moduleTitle} - Présentation`,
          createdAt: new Date(),
          type: 'powerpoint',
          fileUrl: result.pptx_url || '#',
          status: 'ready'
        },
        {
          id: `doc-${Date.now()}`,
          title: `${formData.moduleTitle} - Résumé`,
          createdAt: new Date(),
          type: 'word',
          fileUrl: result.docx_url || '#',
          status: 'ready'
        }
      ];

      setFiles(prev => [...newFiles, ...prev]);

      // Incrémenter le compteur de générations
      if (user) {
        const { data, error } = await incrementGenerationCount(user.id);
        if (!error && data) {
          const updatedUser = { ...user, generation_count: data.generation_count };
          setUser(updatedUser);
          localStorage.setItem('coursgen_user', JSON.stringify(updatedUser));
        }
      }

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      throw error;
    }
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
      
      
      {currentView === 'generator' && user && (
        <CourseGenerator
          onGenerate={handleGenerate}
          user={user}
        />
      )}

      {currentView === 'dashboard' && user && (
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