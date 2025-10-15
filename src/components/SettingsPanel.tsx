'use client';

import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function SettingsPanel() {
  const {
    theme,
    language,
    notifications,
    autoRefresh,
    refreshInterval,
    toggleTheme,
    setLanguage,
    setNotifications,
    setAutoRefresh,
    setRefreshInterval,
    reset
  } = useApp();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold">Configurações da Aplicação</h2>
        <p className="text-sm text-gray-600">
          Gerencie suas preferências e configurações
        </p>
      </div>

      <Separator />

      {/* Tema */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tema</label>
        <Button
          variant="outline"
          onClick={toggleTheme}
          className="w-full justify-start"
        >
          {theme === 'light' ? '☀️' : '🌙'} 
          {theme === 'light' ? 'Claro' : 'Escuro'}
        </Button>
      </div>

      {/* Idioma */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Idioma</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Español</option>
        </select>
      </div>

      {/* Notificações */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Notificações</label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="notifications" className="text-sm">
            Receber notificações
          </label>
        </div>
      </div>

      {/* Auto Refresh */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Atualização Automática</label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoRefresh"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="autoRefresh" className="text-sm">
            Atualizar automaticamente
          </label>
        </div>
      </div>

      {/* Intervalo de Atualização */}
      {autoRefresh && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Intervalo de Atualização (segundos)
          </label>
          <input
            type="number"
            value={refreshInterval / 1000}
            onChange={(e) => setRefreshInterval(Number(e.target.value) * 1000)}
            min="5"
            max="300"
            className="w-full p-2 border rounded-md"
          />
        </div>
      )}

      <Separator />

      {/* Reset */}
      <div className="space-y-2">
        <Button
          variant="destructive"
          onClick={reset}
          className="w-full"
        >
          Resetar Configurações
        </Button>
        <p className="text-xs text-gray-500">
          Isso irá restaurar todas as configurações para os valores padrão
        </p>
      </div>
    </div>
  );
}
