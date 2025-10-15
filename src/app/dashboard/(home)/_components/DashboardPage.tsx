'use client';

import { usePortal } from '@/context/PortalContext';
import { StatsGrid } from './StatsGrid';
import { ServicesStatus } from './ServicesStatus';
import { RecentActivity } from './RecentActivity';

export function DashboardPage() {
  const { state } = usePortal();
  const { stats, services, auditLogs } = state;

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard DM Conta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral do sistema e status dos serviços
          </p>
        </div>
      
      <StatsGrid stats={stats} />
      
      <ServicesStatus services={services} />
      
      <RecentActivity auditLogs={auditLogs} />
    </div>
  );
}

