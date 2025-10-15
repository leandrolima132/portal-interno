import { useAppStore } from '@/stores/appStore';

/**
 * Hook personalizado para acessar o store da aplicação
 * Fornece uma interface limpa para gerenciar estado da UI e preferências do usuário
 */
export function useApp() {
  const store = useAppStore();
  
  return {
    // UI State
    sidebarOpen: store.sidebarOpen,
    theme: store.theme,
    loading: store.loading,
    error: store.error,
    
    // User preferences
    language: store.language,
    notifications: store.notifications,
    autoRefresh: store.autoRefresh,
    refreshInterval: store.refreshInterval,
    
    // App data
    lastSync: store.lastSync,
    version: store.version,
    
    // Actions
    setSidebarOpen: store.setSidebarOpen,
    toggleSidebar: store.toggleSidebar,
    setTheme: store.setTheme,
    toggleTheme: store.toggleTheme,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    setLanguage: store.setLanguage,
    setNotifications: store.setNotifications,
    setAutoRefresh: store.setAutoRefresh,
    setRefreshInterval: store.setRefreshInterval,
    setLastSync: store.setLastSync,
    setVersion: store.setVersion,
    reset: store.reset
  };
}
