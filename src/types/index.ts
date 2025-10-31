export interface Service {
  id: string;
  name: string;
  enabled: boolean;
  dependencies: string[];
  impact: 'low' | 'medium' | 'high' | 'critical';
  lastModified: string;
  description?: string;
  category: string;
}

export interface Message {
  code: string;
  message: string;
  type: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  platform: 'WEB' | 'MOBILE' | 'BOTH';
  enabled: boolean;
  lastModified: string;
  category: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  serviceId?: string;
  messageCode?: string;
}

export interface DashboardStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  totalMessages: number;
  recentChanges: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

