'use client';

import { useEffect } from 'react';
import { useApp } from '@/hooks/useApp';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Provider para inicializar o estado da aplicação
 * Carrega configurações salvas e define valores padrão
 */
export function AppProvider({ children }: AppProviderProps) {
  const { 
    setLastSync, 
    setVersion, 
    setLoading,
    clearError 
  } = useApp();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Definir versão da aplicação
        setVersion('1.0.0');
        
        // Definir última sincronização
        setLastSync(new Date().toISOString());
        
        // Limpar erros anteriores
        clearError();
        
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [setLastSync, setVersion, setLoading, clearError]);

  return <>{children}</>;
}
