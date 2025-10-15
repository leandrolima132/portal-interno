import { Service } from '@/types';
import ServiceCard from './ServiceCard';

interface ServiceListProps {
  services: Service[];
  onToggleService: (serviceId: string) => void;
}

export  function ServiceList({ services, onToggleService }: ServiceListProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onToggle={onToggleService}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
