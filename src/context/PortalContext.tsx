'use client';

import { Service, Message, AuditLog, DashboardStats, SystemConfig } from '@/types';
import { createContext, useContext, useEffect, useReducer } from 'react';

interface PortalState {
  services: Service[];
  messages: Message[];
  auditLogs: AuditLog[];
  stats: DashboardStats;
  config: SystemConfig;
  loading: boolean;
  error: string | null;
}

type PortalAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_AUDIT_LOGS'; payload: AuditLog[] }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_CONFIG'; payload: SystemConfig }
  | { type: 'TOGGLE_SERVICE'; payload: string }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'UPDATE_MESSAGE'; payload: { code: string; message: string } }
  | { type: 'ADD_AUDIT_LOG'; payload: AuditLog };

const initialState: PortalState = {
  services: [],
  messages: [],
  auditLogs: [],
  stats: {
    totalServices: 0,
    activeServices: 0,
    inactiveServices: 0,
    totalMessages: 0,
    recentChanges: 0,
    systemHealth: 'healthy'
  },
  config: {
    maintenanceMode: false,
    maintenanceMessage: 'Sistema em manutenção. Tente novamente em alguns minutos.',
    globalTimeout: 30000,
    cacheEnabled: true,
    notificationsEnabled: true
  },
  loading: false,
  error: null
};

function portalReducer(state: PortalState, action: PortalAction): PortalState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_AUDIT_LOGS':
      return { ...state, auditLogs: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'TOGGLE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload
            ? { ...service, enabled: !service.enabled, lastModified: new Date().toISOString() }
            : service
        )
      };
    case 'ADD_SERVICE':
      return {
        ...state,
        services: [...state.services, action.payload]
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload)
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.code === action.payload.code
            ? { ...message, message: action.payload.message, lastModified: new Date().toISOString() }
            : message
        )
      };
    case 'ADD_AUDIT_LOG':
      return {
        ...state,
        auditLogs: [action.payload, ...state.auditLogs]
      };
    default:
      return state;
  }
}

const PortalContext = createContext<{
  state: PortalState;
  dispatch: React.Dispatch<PortalAction>;
} | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(portalReducer, initialState);

  // Simular carregamento de dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Simular dados mockados
        const mockServices: Service[] = [
          {
            id: 'pix',
            name: 'Sistema PIX',
            enabled: true,
            dependencies: ['auth', 'balance'],
            impact: 'high',
            lastModified: '2024-01-15T10:30:00Z',
            description: 'Sistema de pagamentos instantâneos',
            category: 'Payments'
          },
          {
            id: 'auth',
            name: 'Autenticação',
            enabled: true,
            dependencies: [],
            impact: 'critical',
            lastModified: '2024-01-15T09:15:00Z',
            description: 'Sistema de autenticação de usuários',
            category: 'Security'
          },
          {
            id: 'balance',
            name: 'Consulta de Saldo',
            enabled: true,
            dependencies: ['auth'],
            impact: 'medium',
            lastModified: '2024-01-15T08:45:00Z',
            description: 'Consulta de saldo em tempo real',
            category: 'Account'
          },
          {
            id: 'notifications',
            name: 'Notificações',
            enabled: false,
            dependencies: ['auth'],
            impact: 'low',
            lastModified: '2024-01-14T16:20:00Z',
            description: 'Sistema de notificações push',
            category: 'Communication'
          }
        ];

        const mockMessages: Message[] = [
          {
            code: 'E001',
            message: 'Erro interno do sistema',
            type: 'ERROR',
            platform: 'BOTH',
            enabled: true,
            lastModified: '2024-01-15T10:30:00Z',
            category: 'System'
          },
          {
            code: 'W001',
            message: 'Serviço temporariamente indisponível',
            type: 'WARNING',
            platform: 'BOTH',
            enabled: true,
            lastModified: '2024-01-15T09:45:00Z',
            category: 'Service'
          },
          {
            code: 'I001',
            message: 'Operação realizada com sucesso',
            type: 'INFO',
            platform: 'BOTH',
            enabled: true,
            lastModified: '2024-01-15T08:30:00Z',
            category: 'Success'
          }
        ];

        const mockAuditLogs: AuditLog[] = [
          {
            id: '1',
            timestamp: '2024-01-15T10:30:00Z',
            action: 'service_toggle',
            user: 'admin',
            details: 'PIX reativado',
            serviceId: 'pix'
          },
          {
            id: '2',
            timestamp: '2024-01-15T09:45:00Z',
            action: 'message_edit',
            user: 'admin',
            details: 'Mensagem E001 atualizada',
            messageCode: 'E001'
          }
        ];

        dispatch({ type: 'SET_SERVICES', payload: mockServices });
        dispatch({ type: 'SET_MESSAGES', payload: mockMessages });
        dispatch({ type: 'SET_AUDIT_LOGS', payload: mockAuditLogs });
        
        // Calcular estatísticas
        const stats: DashboardStats = {
          totalServices: mockServices.length,
          activeServices: mockServices.filter(s => s.enabled).length,
          inactiveServices: mockServices.filter(s => !s.enabled).length,
          totalMessages: mockMessages.length,
          recentChanges: mockAuditLogs.length,
          systemHealth: 'healthy'
        };
        
        dispatch({ type: 'SET_STATS', payload: stats });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  return (
    <PortalContext.Provider value={{ state, dispatch }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}

