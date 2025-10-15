'use client';

import { useState } from 'react';
import { usePortal } from '@/context/PortalContext';
import { 
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function AuditLogPage() {
  const { state } = usePortal();
  const { auditLogs } = state;
  const [filter, setFilter] = useState<'all' | 'service' | 'message'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesType = filter === 'all' || 
      (filter === 'service' && log.action.includes('service')) ||
      (filter === 'message' && log.action.includes('message'));
    
    const matchesDate = !dateFilter || 
      new Date(log.timestamp).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesType && matchesDate;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'service_toggle':
      case 'service_create':
      case 'service_delete':
        return <CogIcon className="h-4 w-4 text-blue-600" />;
      case 'message_edit':
      case 'message_create':
      case 'message_delete':
        return <DocumentTextIcon className="h-4 w-4 text-green-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'service_toggle':
        return 'bg-blue-100 text-blue-800';
      case 'service_create':
        return 'bg-green-100 text-green-800';
      case 'service_delete':
        return 'bg-red-100 text-red-800';
      case 'message_edit':
        return 'bg-yellow-100 text-yellow-800';
      case 'message_create':
        return 'bg-green-100 text-green-800';
      case 'message_delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'service_toggle': return 'Serviço Alterado';
      case 'service_create': return 'Serviço Criado';
      case 'service_delete': return 'Serviço Removido';
      case 'message_edit': return 'Mensagem Editada';
      case 'message_create': return 'Mensagem Criada';
      case 'message_delete': return 'Mensagem Removida';
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log de Auditoria</h1>
        <p className="mt-1 text-sm text-gray-500">
          Histórico completo de mudanças no sistema
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('service')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'service'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Serviços
            </button>
            <button
              onClick={() => setFilter('message')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'message'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mensagens
            </button>
          </div>
          
          <div className="flex-1">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filtrar por data"
            />
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum log encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há registros de auditoria para os filtros selecionados.
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-gray-200 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                            {getActionText(log.action)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{log.details}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-xs text-gray-500">
                            <UserIcon className="h-3 w-3 mr-1" />
                            {log.user}
                          </div>
                          {log.serviceId && (
                            <span className="text-xs text-blue-600">
                              Serviço: {log.serviceId}
                            </span>
                          )}
                          {log.messageCode && (
                            <span className="text-xs text-green-600">
                              Mensagem: {log.messageCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Exportar Logs</h3>
            <p className="text-sm text-gray-500">
              Total de {filteredLogs.length} registros encontrados
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Exportar CSV
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Exportar JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

