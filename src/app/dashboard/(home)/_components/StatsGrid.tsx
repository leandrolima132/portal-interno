import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { DashboardStats } from '@/types';
import StatCard from './StatCard';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getHealthText = (health: string) => {
    switch (health) {
      case 'healthy': return 'Saudável';
      case 'warning': return 'Atenção';
      case 'critical': return 'Crítico';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Serviços"
        value={stats.totalServices}
        icon={<ChartBarIcon className="h-6 w-6 text-blue-600" />}
      />
      
      <StatCard
        title="Serviços Ativos"
        value={stats.activeServices}
        icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
      />
      
      <StatCard
        title="Serviços Inativos"
        value={stats.inactiveServices}
        icon={<XCircleIcon className="h-6 w-6 text-red-600" />}
      />
      
      <StatCard
        title="Status do Sistema"
        value={getHealthText(stats.systemHealth)}
        icon={getHealthIcon(stats.systemHealth)}
        color={getHealthColor(stats.systemHealth)}
      />
    </div>
  );
}
