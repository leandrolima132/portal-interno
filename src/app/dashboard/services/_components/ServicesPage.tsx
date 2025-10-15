'use client';

import { useState } from 'react';
import { usePortal } from '@/context/PortalContext';

import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ServiceHeader } from './ServiceHeader';
import { ServiceFilters } from './ServiceFilters';
import { ServiceSearchFilter } from './ServiceSearchFilter';
import { CreateServiceForm } from './CreateServiceForm';
import { ServiceList } from './ServiceList';
import ConfirmationModal from '@/components/ConfirmationModal';

export function ServicesPage() {
  const { state, dispatch } = usePortal();
  const { services } = state;
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    serviceId: string | null;
    serviceName: string;
  }>({
    isOpen: false,
    serviceId: null,
    serviceName: ''
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    serviceId: string | null;
    serviceName: string;
  }>({
    isOpen: false,
    serviceId: null,
    serviceName: ''
  });

  const filteredServices = services.filter(service => {
    // Filtro por status
    const statusMatch = filter === 'all' || 
      (filter === 'active' && service.enabled) || 
      (filter === 'inactive' && !service.enabled);
    
    // Filtro por busca
    const searchMatch = !searchTerm || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const handleToggleService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    // Se o serviço está ativo (enabled), mostrar modal de confirmação
    if (service.enabled) {
      setConfirmationModal({
        isOpen: true,
        serviceId: serviceId,
        serviceName: service.name
      });
      return;
    }

    // Se está inativo, ativar diretamente
    dispatch({ type: 'TOGGLE_SERVICE', payload: serviceId });
    
    // Adicionar log de auditoria
    dispatch({
      type: 'ADD_AUDIT_LOG',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'service_toggle',
        user: 'admin',
        details: `${service.name} ativado`,
        serviceId: serviceId
      }
    });
  };

  const handleConfirmDisable = () => {
    if (!confirmationModal.serviceId) return;

    const service = services.find(s => s.id === confirmationModal.serviceId);
    if (!service) return;

    dispatch({ type: 'TOGGLE_SERVICE', payload: confirmationModal.serviceId });
    
    // Adicionar log de auditoria
    dispatch({
      type: 'ADD_AUDIT_LOG',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'service_toggle',
        user: 'admin',
        details: `${service.name} desativado`,
        serviceId: confirmationModal.serviceId
      }
    });

    // Fechar modal
    setConfirmationModal({
      isOpen: false,
      serviceId: null,
      serviceName: ''
    });
  };

  const handleCancelDisable = () => {
    setConfirmationModal({
      isOpen: false,
      serviceId: null,
      serviceName: ''
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteModal.serviceId) return;

    const service = services.find(s => s.id === deleteModal.serviceId);
    if (!service) return;

    dispatch({ type: 'DELETE_SERVICE', payload: deleteModal.serviceId });
    
    // Adicionar log de auditoria
    dispatch({
      type: 'ADD_AUDIT_LOG',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'service_delete',
        user: 'admin',
        details: `Serviço ${service.name} excluído permanentemente`,
        serviceId: deleteModal.serviceId
      }
    });

    // Fechar modal
    setDeleteModal({
      isOpen: false,
      serviceId: null,
      serviceName: ''
    });
  };

  const handleCancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      serviceId: null,
      serviceName: ''
    });
  };

  return (
    <div className="space-y-6">
      <ServiceHeader
        title="Gestão de Serviços"
        description="Controle e monitoramento dos serviços do sistema"
        onAddService={() => setIsCreateModalOpen(true)}
      />

      <ServiceSearchFilter
        onSearchChange={setSearchTerm}
        placeholder="Buscar por nome, descrição ou categoria..."
      />

      <ServiceFilters
        filter={filter}
        onFilterChange={setFilter}
        totalCount={services.length}
        activeCount={services.filter(s => s.enabled).length}
        inactiveCount={services.filter(s => !s.enabled).length}
      />

      {filteredServices.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.708A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço disponível'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? `Não encontramos serviços que correspondam a "${searchTerm}"`
                  : 'Não há serviços cadastrados no sistema'
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
          </div>
        </div>
      ) : (
        <ServiceList
          services={filteredServices}
          onToggleService={handleToggleService}
        />
      )}

      <CreateServiceForm 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title="Confirmar Desativação"
        message={`Tem certeza que deseja desativar o serviço ${confirmationModal.serviceName}?`}
        warningMessage="Esta ação pode afetar outros serviços que dependem deste."
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />}
        confirmText="Desativar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDisable}
        onCancel={handleCancelDisable}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir permanentemente o serviço ${deleteModal.serviceName}?`}
        warningMessage="⚠️ Esta ação não pode ser desfeita! Todos os dados relacionados a este serviço serão perdidos."
        icon={<TrashIcon className="h-6 w-6 text-red-600" />}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

