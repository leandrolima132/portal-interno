import { Service } from '@/types';

interface ServicesStatusProps {
  services: Service[];
}

export  function ServicesStatus({ services }: ServicesStatusProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status dos Serviços</h3>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-3 ${
                  service.enabled ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(service.impact)}`}>
                  {service.impact}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.enabled)}`}>
                  {service.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
