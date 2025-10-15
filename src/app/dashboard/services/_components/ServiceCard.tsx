import { Service } from '@/types';
import { 
  PowerIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ServiceCardProps {
  service: Service;
  onToggle: (serviceId: string) => void;
}

export default function ServiceCard({ service, onToggle }: ServiceCardProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical': return <XCircleIcon className="h-4 w-4" />;
      case 'high': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'medium': return <ClockIcon className="h-4 w-4" />;
      case 'low': return <CheckCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
        <div className="flex items-start space-x-3">
          <div className={`h-3 w-3 rounded-full mt-2 flex-shrink-0 ${
            service.enabled ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900 truncate">{service.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 space-y-1 sm:space-y-0">
              <span className="text-xs text-gray-400">Categoria: {service.category}</span>
              {service.dependencies.length > 0 && (
                <span className="text-xs text-gray-400">
                  Dependências: {service.dependencies.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:ml-4">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getImpactColor(service.impact)}`}>
            {getImpactIcon(service.impact)}
            <span className="ml-1">{service.impact}</span>
          </div>
          
          <button
            onClick={() => onToggle(service.id)}
            className={`inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors w-full sm:w-auto ${
              service.enabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <PowerIcon className="h-4 w-4 mr-1" />
            {service.enabled ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-400">
        Última modificação: {new Date(service.lastModified).toLocaleString('pt-BR')}
      </div>
    </div>
  );
}
