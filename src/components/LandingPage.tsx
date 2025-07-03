import React from 'react';
import { 
  GraduationCap, 
  FileText, 
  Download, 
  Clock, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  BookOpen,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Génération instantanée",
      description: "Créez vos supports de cours en quelques minutes seulement"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Formats professionnels",
      description: "PowerPoint et Word optimisés pour l'enseignement médical"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Adapté au niveau",
      description: "Contenu personnalisé selon le niveau de vos étudiants"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sécurisé et fiable",
      description: "Vos données sont protégées et vos fichiers toujours disponibles"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Marie Dubois",
      role: "Professeure en soins infirmiers",
      institution: "IFSI Paris",
      content: "CoursGen m'a fait gagner des heures de préparation. Les supports générés sont de qualité professionnelle.",
      rating: 5
    },
    {
      name: "Prof. Jean Martin",
      role: "Coordinateur pédagogique",
      institution: "Institut de Formation",
      content: "Un outil révolutionnaire pour l'enseignement infirmier. Mes collègues l'adoptent un par un.",
      rating: 5
    },
    {
      name: "Dr. Sophie Laurent",
      role: "Directrice IFSI",
      institution: "CHU Lyon",
      content: "La qualité du contenu généré est remarquable. Cela nous permet de nous concentrer sur l'essentiel.",
      rating: 5
    }
  ];

  const stats = [
    { number: "500+", label: "Professeurs actifs" },
    { number: "10,000+", label: "Supports générés" },
    { number: "50+", label: "Établissements partenaires" },
    { number: "98%", label: "Satisfaction client" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CoursGen Infirmier</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Témoignages</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Tarifs</a>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Générez vos supports de cours
                <span className="text-blue-600 block">infirmiers en un instant</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Créez automatiquement des présentations PowerPoint complètes et des résumés Word 
                personnalisés pour vos modules d'enseignement infirmier. Gagnez du temps, 
                améliorez la qualité de vos cours.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 transition-colors">
                  Voir la démo
                </button>
              </div>
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Essai gratuit • Aucune carte bancaire requise
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-blue-600 rounded-lg p-4 mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Anatomie et Physiologie</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Présentation PowerPoint (45 slides)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Download className="w-4 h-4 mr-2 text-green-600" />
                    <span>Résumé Word (12 pages)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    <span>Généré en 2 minutes</span>
                  </div>
                </div>
                <div className="mt-6 bg-green-50 rounded-lg p-3 text-center">
                  <span className="text-green-700 font-medium">✓ Prêt à télécharger</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CoursGen ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme révolutionne la création de supports pédagogiques pour l'enseignement infirmier
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Trois étapes simples pour créer vos supports de cours
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Renseignez votre module</h3>
              <p className="text-gray-600">
                Titre, niveau des étudiants, chapitres principaux et durée du cours
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Génération automatique</h3>
              <p className="text-gray-600">
                Notre IA crée vos supports PowerPoint et Word personnalisés
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Téléchargez et utilisez</h3>
              <p className="text-gray-600">
                Vos fichiers sont prêts à être utilisés en cours ou modifiés selon vos besoins
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600">
              Rejoignez des centaines de professeurs qui nous font confiance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.institution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez l'offre qui correspond à vos besoins
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gratuit</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                0€<span className="text-lg font-normal text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  3 supports par mois
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Formats PowerPoint et Word
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Support par email
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-blue-600 rounded-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Populaire
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professionnel</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                29€<span className="text-lg font-normal text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Supports illimités
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Tous les formats
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Support prioritaire
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Personnalisation avancée
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Choisir Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Établissement</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                Sur mesure
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Licences multiples
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Intégration SSO
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Support dédié
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Formation incluse
                </li>
              </ul>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors">
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à révolutionner vos cours ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des centaines de professeurs qui utilisent déjà CoursGen pour créer 
            des supports de cours exceptionnels.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors transform hover:scale-105"
          >
            Commencer maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 rounded-lg p-2 mr-3">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">CoursGen Infirmier</span>
              </div>
              <p className="text-gray-400">
                La plateforme de référence pour la création de supports de cours infirmiers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CoursGen Infirmier. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}