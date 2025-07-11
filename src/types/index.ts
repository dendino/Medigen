export interface FormData {
  moduleTitle: string;
  studentLevel: string;
  chapters: string;
  duration: string;
  courseFormat: string;
  email: string;
}

export interface FormErrors {
  moduleTitle?: string;
  studentLevel?: string;
  chapters?: string;
  duration?: string;
  courseFormat?: string;
  email?: string;
}

export interface GeneratedFile {
  id: string;
  title: string;
  createdAt: Date;
  type: 'powerpoint' | 'word';
  fileUrl: string;
  status: 'generating' | 'ready' | 'error';
}

export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  avatar?: string;
  provider?: 'google' | 'email';
  plan: 'free' | 'premium';
  credit_balance?: number; // Ajouter cette ligne
  generation_count: number;
}

export type AppState = 'form' | 'loading' | 'success' | 'error';
export type AppView = 'landing' | 'auth' | 'generator' | 'dashboard';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

export interface AuthErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}