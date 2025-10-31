'use client';

import { Service, Message, AuditLog, DashboardStats } from '@/types';
import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { toggleStore } from '@/lib/toggleStore';

interface PortalState {
  services: Service[];
  messages: Message[];
  auditLogs: AuditLog[];
  stats: DashboardStats;
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

/**
 * Calcula o status de saúde do sistema baseado nos serviços
 * - Critical: Se algum serviço crítico estiver desativado
 * - Warning: Se mais de 50% dos serviços estiverem desativados ou serviço de alto impacto desativado
 * - Healthy: Caso contrário
 */
function calculateSystemHealth(services: Service[]): 'healthy' | 'warning' | 'critical' {
  if (services.length === 0) {
    return 'healthy';
  }

  const totalServices = services.length;
  const inactiveServices = services.filter(s => !s.enabled).length;
  const inactivePercentage = (inactiveServices / totalServices) * 100;

  // Verificar se algum serviço crítico está desativado
  const criticalServicesInactive = services.some(
    service => service.impact === 'critical' && !service.enabled
  );

  // Verificar se algum serviço de alto impacto está desativado
  const highImpactServicesInactive = services.some(
    service => service.impact === 'high' && !service.enabled
  );

  // Critical: Serviço crítico desativado
  if (criticalServicesInactive) {
    return 'critical';
  }

  // Warning: Mais de 50% dos serviços inativos OU serviço de alto impacto desativado
  if (inactivePercentage > 50 || highImpactServicesInactive) {
    return 'warning';
  }

  // Healthy: Tudo funcionando normalmente
  return 'healthy';
}

const PortalContext = createContext<{
  state: PortalState;
  dispatch: React.Dispatch<PortalAction>;
} | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(portalReducer, initialState);

  // Carregar dados iniciais do JSON ou do storage
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Tentar carregar do storage primeiro
        let services = await toggleStore.loadServices();
        let messages = await toggleStore.loadMessages();
        let auditLogs = await toggleStore.loadAuditLogs();

        // Se não houver dados no storage, carregar dos arquivos JSON separados
        if (services.length === 0) {
          try {
            // Carregar arquivos JSON separados
            const [servicesResponse, messagesResponse, auditLogsResponse] = await Promise.all([
              fetch('/data/services.json').catch(() => null),
              fetch('/data/messages.json').catch(() => null),
              fetch('/data/audit-logs.json').catch(() => null)
            ]);

            // Carregar serviços
            if (servicesResponse?.ok) {
              const servicesData = await servicesResponse.json();
              if (servicesData && servicesData.length > 0) {
                await toggleStore.loadServicesFromJSON(servicesData);
                services = servicesData;
              }
            }

            // Carregar mensagens
            if (messagesResponse?.ok) {
              const messagesData = await messagesResponse.json();
              if (messagesData && messagesData.length > 0) {
                await toggleStore.saveMessages(messagesData);
                messages = messagesData;
              }
            }

            // Carregar logs de auditoria
            if (auditLogsResponse?.ok) {
              const auditLogsData = await auditLogsResponse.json();
              if (auditLogsData && auditLogsData.length > 0) {
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                
                // Filtrar apenas logs dos últimos 30 dias
                const validLogs = auditLogsData.filter((log: AuditLog) => {
                  const logDate = new Date(log.timestamp);
                  return logDate >= thirtyDaysAgo;
                });
                
                // Se foram filtrados logs antigos, salvar o JSON limpo no servidor
                if (validLogs.length !== auditLogsData.length) {
                  try {
                    await fetch('/api/toggles', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        auditLogs: validLogs
                      }),
                    });
                  } catch (error) {
                    console.warn('Erro ao limpar logs antigos do JSON:', error);
                  }
                }
                
                // Adicionar logs válidos
                for (const log of validLogs) {
                  await toggleStore.addAuditLog(log);
                }
                
                auditLogs = validLogs;
              }
            }
          } catch (jsonError) {
            console.warn('Erro ao carregar JSONs, usando dados padrão:', jsonError);
          }
        }

        dispatch({ type: 'SET_SERVICES', payload: services });
        dispatch({ type: 'SET_MESSAGES', payload: messages });
        dispatch({ type: 'SET_AUDIT_LOGS', payload: auditLogs });
        
        // Calcular estatísticas
        const stats: DashboardStats = {
          totalServices: services.length,
          activeServices: services.filter(s => s.enabled).length,
          inactiveServices: services.filter(s => !s.enabled).length,
          totalMessages: messages.length,
          recentChanges: auditLogs.length,
          systemHealth: calculateSystemHealth(services)
        };
        
        dispatch({ type: 'SET_STATS', payload: stats });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  // Atualizar estatísticas quando os serviços mudarem
  useEffect(() => {
    if (state.loading) return;

    const stats: DashboardStats = {
      totalServices: state.services.length,
      activeServices: state.services.filter(s => s.enabled).length,
      inactiveServices: state.services.filter(s => !s.enabled).length,
      totalMessages: state.messages.length,
      recentChanges: state.auditLogs.length,
      systemHealth: calculateSystemHealth(state.services)
    };
    
    dispatch({ type: 'SET_STATS', payload: stats });
  }, [state.services, state.messages, state.loading]);

  // Interceptar ações para persistir no toggleStore
  const enhancedDispatch = useCallback((action: PortalAction) => {
    dispatch(action);
    
    // Persistir mudanças assíncronamente após a ação
    (async () => {
      switch (action.type) {
        case 'TOGGLE_SERVICE':
          try {
            await toggleStore.toggleService(action.payload);
          } catch (error) {
            console.error('Erro ao persistir toggle:', error);
          }
          break;
        case 'ADD_SERVICE':
          try {
            await toggleStore.addService(action.payload);
          } catch (error) {
            console.error('Erro ao persistir novo serviço:', error);
          }
          break;
        case 'DELETE_SERVICE':
          try {
            await toggleStore.deleteService(action.payload);
          } catch (error) {
            console.error('Erro ao persistir exclusão:', error);
          }
          break;
        case 'ADD_AUDIT_LOG':
          try {
            await toggleStore.addAuditLog(action.payload);
          } catch (error) {
            console.error('Erro ao persistir log de auditoria:', error);
          }
          break;
      }
    })();
  }, []);

  return (
    <PortalContext.Provider value={{ state, dispatch: enhancedDispatch }}>
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

