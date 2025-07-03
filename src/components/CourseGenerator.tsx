import React, { useState } from 'react';
import { Book, Users, Clock, Mail, FileText, Download, CheckCircle, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import { FormData, FormErrors, AppState } from '../types';

interface CourseGeneratorProps {
  onGenerate: (formData: FormData) => Promise<void>;
}

export function CourseGenerator({ onGenerate }: CourseGeneratorProps) {
  const [state, setState] = useState<AppState>('form');
  const [formData, setFormData] = useState<FormData>({
    moduleTitle: '',
    studentLevel: '',
    chapters: '',
    duration: '',
    courseFormat: '',
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const studentLevels = [
    { value: 'premiere-annee', label: 'Première année' },
    { value: 'deuxieme-annee', label: 'Deuxième année' },
    { value: 'troisieme-annee', label: 'Troisième année' },
    { value: 'specialisation', label: 'Spécialisation' }
  ];

  const courseFormats = [
    { value: 'court', label: 'Court', description: 'Synthèse concise' },
    { value: 'intermediaire', label: 'Intermédiaire', description: 'Équilibré et détaillé' },
    { value: 'long', label: 'Long', description: 'Exhaustif et approfondi' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.moduleTitle.trim()) {
      newErrors.moduleTitle = 'Le titre du module est requis';
    }

    if (!formData.studentLevel) {
      newErrors.studentLevel = 'Veuillez sélectionner un niveau';
    }

    if (!formData.chapters.trim()) {
      newErrors.chapters = 'Veuillez renseigner au moins un chapitre';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'La durée du module est requise';
    } else if (!/^\d+\s*(h|heures?|hours?)?$/i.test(formData.duration.trim())) {
      newErrors.duration = 'Format invalide (ex: "20 heures" ou "20h")';
    }

    if (!formData.courseFormat) {
      newErrors.courseFormat = 'Veuillez sélectionner un format';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setState('loading');

    try {
      await onGenerate(formData);
      setState('success');
    } catch (error) {
      setState('error');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setState('form');
    setFormData({
      moduleTitle: '',
      studentLevel: '',
      chapters: '',
      duration: '',
      courseFormat: '',
      email: ''
    });
    setErrors({});
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Génération en cours...</h2>
          <p className="text-gray-600 mb-6">
            Nous créons vos supports de cours personnalisés. Cette opération prend généralement 2-3 minutes.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-blue-700 text-sm">
              <FileText className="w-4 h-4 mr-2" />
              <span>Génération du fichier PowerPoint...</span>
            </div>
            <div className="flex items-center text-blue-700 text-sm mt-2">
              <Download className="w-4 h-4 mr-2" />
              <span>Création du résumé Word...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Supports générés avec succès !</h2>
          <p className="text-gray-600 mb-6">
            Vos fichiers PowerPoint et Word ont été créés et sont disponibles dans votre dashboard.
          </p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center text-green-700 text-sm mb-2">
              <FileText className="w-4 h-4 mr-2" />
              <span>Support PowerPoint (.pptx)</span>
            </div>
            <div className="flex items-center text-green-700 text-sm">
              <Download className="w-4 h-4 mr-2" />
              <span>Résumé Word (.docx)</span>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Créer un nouveau cours
          </button>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur de génération</h2>
          <p className="text-gray-600 mb-6">
            Une erreur s'est produite lors de la génération de vos supports. Veuillez réessayer dans quelques instants.
          </p>
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Générez vos supports de cours
            <span className="text-blue-600 block">infirmiers en un instant</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez automatiquement des présentations PowerPoint complètes et des résumés Word 
            personnalisés pour vos modules d'enseignement infirmier.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-teal-600">
            <h2 className="text-2xl font-bold text-white">Créer un nouveau module</h2>
            <p className="text-blue-100 mt-1">Remplissez les informations ci-dessous pour générer vos supports</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Module Title */}
            <div>
              <label htmlFor="moduleTitle" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Book className="w-4 h-4 mr-2 text-blue-600" />
                Titre du module
              </label>
              <input
                type="text"
                id="moduleTitle"
                value={formData.moduleTitle}
                onChange={(e) => handleInputChange('moduleTitle', e.target.value)}
                placeholder="Ex: Anatomie et physiologie, Soins infirmiers en gériatrie..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.moduleTitle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.moduleTitle && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.moduleTitle}
                </p>
              )}
            </div>

            {/* Student Level */}
            <div>
              <label htmlFor="studentLevel" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Niveau des étudiants
              </label>
              <select
                id="studentLevel"
                value={formData.studentLevel}
                onChange={(e) => handleInputChange('studentLevel', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.studentLevel ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un niveau</option>
                {studentLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.studentLevel && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.studentLevel}
                </p>
              )}
            </div>

            {/* Chapters */}
            <div>
              <label htmlFor="chapters" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Principaux chapitres du module
              </label>
              <textarea
                id="chapters"
                rows={6}
                value={formData.chapters}
                onChange={(e) => handleInputChange('chapters', e.target.value)}
                placeholder="Listez les chapitres principaux, un par ligne:
- Introduction à l'anatomie
- Le système cardiovasculaire  
- Le système respiratoire
- Pathologies courantes"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  errors.chapters ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.chapters && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.chapters}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Séparez chaque chapitre par une nouvelle ligne ou utilisez des puces (-)
              </p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                Durée du module
              </label>
              <input
                type="text"
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Ex: 20 heures, 10h, 40 heures..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.duration}
                </p>
              )}
            </div>

            {/* Course Format */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                <Download className="w-4 h-4 mr-2 text-blue-600" />
                Format du cours
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courseFormats.map((format) => (
                  <label
                    key={format.value}
                    className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                      formData.courseFormat === format.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="courseFormat"
                      value={format.value}
                      checked={formData.courseFormat === format.value}
                      onChange={(e) => handleInputChange('courseFormat', e.target.value)}
                      className="sr-only"
                    />
                    <span className="font-medium text-gray-900">{format.label}</span>
                    <span className="text-sm text-gray-600 mt-1">{format.description}</span>
                    {formData.courseFormat === format.value && (
                      <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
              {errors.courseFormat && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.courseFormat}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                Email du professeur
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre.email@institution.fr"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Vos fichiers seront disponibles dans votre dashboard
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-[1.02] focus:scale-[1.02]"
              >
                <span className="flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Générer mes supports de cours
                </span>
              </button>
              <p className="text-center text-sm text-gray-600 mt-3">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                Vos fichiers seront disponibles dans votre dashboard
              </p>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Présentation PowerPoint</h3>
            <p className="text-gray-600">Slides structurées avec contenu pédagogique adapté au niveau</p>
          </div>
          <div className="text-center">
            <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Résumé Word</h3>
            <p className="text-gray-600">Document de synthèse pour accompagner vos cours</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard intégré</h3>
            <p className="text-gray-600">Gérez et téléchargez tous vos fichiers depuis un seul endroit</p>
          </div>
        </div>
      </main>
    </div>
  );
}