import React, { useState } from 'react';
import { FileText, Download, Calendar, Clock, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import { GeneratedFile } from '../types';

interface DashboardProps {
  files: GeneratedFile[];
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onRefresh: () => void;
}

export function Dashboard({ files, onDownload, onDelete, onRefresh }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'generating' | 'error'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || file.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const getStatusBadge = (status: GeneratedFile['status']) => {
    switch (status) {
      case 'ready':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Prêt</span>;
      case 'generating':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En cours</span>;
      case 'error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Erreur</span>;
    }
  };

  const getFileIcon = (type: GeneratedFile['type']) => {
    return type === 'powerpoint' ? '📊' : '📄';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes fichiers générés</h1>
              <p className="text-gray-600 mt-1">Gérez et téléchargez vos supports de cours</p>
            </div>
            <button
              onClick={onRefresh}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un fichier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="ready">Prêts</option>
                <option value="generating">En cours</option>
                <option value="error">Erreurs</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Trier par date</option>
              <option value="title">Trier par titre</option>
            </select>
          </div>
        </div>

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {files.length === 0 ? 'Aucun fichier généré' : 'Aucun fichier trouvé'}
            </h3>
            <p className="text-gray-600">
              {files.length === 0 
                ? 'Commencez par créer votre premier support de cours'
                : 'Essayez de modifier vos critères de recherche'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <div key={file.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  {/* File Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getFileIcon(file.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{file.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {file.type === 'powerpoint' ? 'Présentation PowerPoint' : 'Résumé Word'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(file.status)}
                  </div>

                  {/* File Info */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(file.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onDownload(file.id)}
                      disabled={file.status !== 'ready'}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </button>
                    
                    <button
                      onClick={() => onDelete(file.id)}
                      className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>

                {/* Progress bar for generating files */}
                {file.status === 'generating' && (
                  <div className="px-6 pb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Génération en cours...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{files.length}</div>
            <div className="text-sm text-gray-600">Total fichiers</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {files.filter(f => f.status === 'ready').length}
            </div>
            <div className="text-sm text-gray-600">Prêts</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {files.filter(f => f.status === 'generating').length}
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {files.filter(f => f.status === 'error').length}
            </div>
            <div className="text-sm text-gray-600">Erreurs</div>
          </div>
        </div>
      </main>
    </div>
  );
}