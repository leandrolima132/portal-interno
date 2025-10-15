'use client';

import { useState } from 'react';
import { usePortal } from '@/context/PortalContext';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  PencilIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export function MessagesPage() {
  const { state, dispatch } = usePortal();
  const { messages } = state;
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleEditMessage = (code: string, currentMessage: string) => {
    setEditingMessage(code);
    setEditText(currentMessage);
  };

  const handleSaveMessage = (code: string) => {
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: { code, message: editText }
    });
    
    // Adicionar log de auditoria
    dispatch({
      type: 'ADD_AUDIT_LOG',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'message_edit',
        user: 'admin',
        details: `Mensagem ${code} atualizada`,
        messageCode: code
      }
    });
    
    setEditingMessage(null);
    setEditText('');
  };

  const handlePreviewMessage = (message: string) => {
    setPreviewMessage(message);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ERROR': return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'WARNING': return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />;
      case 'INFO': return <InformationCircleIcon className="h-4 w-4 text-blue-600" />;
      case 'SUCCESS': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      default: return <InformationCircleIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'WEB': return 'bg-blue-100 text-blue-800';
      case 'MOBILE': return 'bg-purple-100 text-purple-800';
      case 'BOTH': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Mensagens</h1>
          <p className="mt-1 text-sm text-gray-500">
            Edição e controle das mensagens do sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Nova Mensagem
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar mensagens por código, tipo ou conteúdo..."
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {(() => {
            const filteredMessages = messages.filter(message => {
              if (!debouncedSearchTerm) return true;
              return message.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                     message.message.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                     message.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            });

            if (filteredMessages.length === 0) {
              return (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchTerm ? 'Nenhuma mensagem encontrada' : 'Nenhuma mensagem disponível'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? `Não encontramos mensagens que correspondam a "${searchTerm}"`
                      : 'Não há mensagens cadastradas no sistema'
                    }
                  </p>
                  {searchTerm && (
                    <div className="mt-4">
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
              <div key={message.code} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {message.code}
                      </span>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                        {getTypeIcon(message.type)}
                        <span className="ml-1">{message.type}</span>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(message.platform)}`}>
                        {message.platform}
                      </div>
                      {message.category && (
                        <span className="text-xs text-gray-500">
                          {message.category}
                        </span>
                      )}
                    </div>
                    
                    {editingMessage === message.code ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveMessage(message.code)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => {
                              setEditingMessage(null);
                              setEditText('');
                            }}
                            className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-900 mb-2">{message.message}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditMessage(message.code, message.message)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => handlePreviewMessage(message.message)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800"
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Preview
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  Última modificação: {new Date(message.lastModified).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Preview Modal */}
      {previewMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setPreviewMessage(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview da Mensagem</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-900">{previewMessage}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setPreviewMessage(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

