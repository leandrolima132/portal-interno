import { AuditLog } from '@/types';

interface RecentActivityProps {
  auditLogs: AuditLog[];
  limit?: number;
}

export  function RecentActivity({ auditLogs, limit = 5 }: RecentActivityProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {auditLogs.slice(0, limit).map((log) => (
            <div key={log.id} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-900">{log.details}</p>
                <p className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString('pt-BR')} - {log.user}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
