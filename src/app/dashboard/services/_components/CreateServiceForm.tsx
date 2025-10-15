'use client';

import { useState } from 'react';
import { usePortal } from '@/context/PortalContext';
import { Service } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateServiceForm({ isOpen, onClose }: CreateServiceFormProps) {
  const { dispatch } = usePortal();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    impact: 'medium' as Service['impact'],
    dependencies: [] as string[],
    enabled: true
  });
  const [dependencyInput, setDependencyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      alert('Nome e categoria são obrigatórios');
      return;
    }

    const newService: Service = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      impact: formData.impact,
      dependencies: formData.dependencies,
      enabled: formData.enabled,
      lastModified: new Date().toISOString()
    };

    dispatch({ type: 'ADD_SERVICE', payload: newService });
    
    // Adicionar log de auditoria
    dispatch({
      type: 'ADD_AUDIT_LOG',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'service_create',
        user: 'admin',
        details: `Serviço "${newService.name}" criado`,
        serviceId: newService.id
      }
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      impact: 'medium',
      dependencies: [],
      enabled: true
    });
    setDependencyInput('');
    onClose();
  };

  const addDependency = () => {
    if (dependencyInput.trim() && !formData.dependencies.includes(dependencyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, dependencyInput.trim()]
      }));
      setDependencyInput('');
    }
  };

  const removeDependency = (dep: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(d => d !== dep)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Criar Novo Serviço</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome do Serviço */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Serviço *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Sistema de Pagamentos"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva o que este serviço faz..."
              rows={3}
            />
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Payments">Payments</option>
              <option value="Security">Security</option>
              <option value="Account">Account</option>
              <option value="Communication">Communication</option>
              <option value="Integration">Integration</option>
              <option value="Analytics">Analytics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Impacto */}
          <div>
            <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Impacto
            </label>
            <select
              id="impact"
              value={formData.impact}
              onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as Service['impact'] }))}
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Baixo</option>
              <option value="medium">Médio</option>
              <option value="high">Alto</option>
              <option value="critical">Crítico</option>
            </select>
          </div>

          {/* Dependências */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dependências
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={dependencyInput}
                onChange={(e) => setDependencyInput(e.target.value)}
                className="flex-1 px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome da dependência"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDependency())}
              />
              <button
                type="button"
                onClick={addDependency}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
            {formData.dependencies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.dependencies.map((dep, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {dep}
                    <button
                      type="button"
                      onClick={() => removeDependency(dep)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status Inicial */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
              Ativar serviço imediatamente
            </label>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Criar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
