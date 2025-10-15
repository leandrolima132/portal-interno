# Store App com LocalForage

Este diretório contém a implementação do gerenciamento de estado da aplicação usando Zustand com persistência LocalForage.

## Estrutura

- `appStore.ts` - Store principal da aplicação com persistência
- `useApp.ts` - Hook personalizado para acessar o store
- `useLocalForage.ts` - Hook genérico para persistência com LocalForage

## Uso Básico

### 1. Usando o Store App

```tsx
import { useApp } from '@/hooks/useApp';

function MyComponent() {
  const { 
    theme, 
    toggleTheme, 
    sidebarOpen, 
    toggleSidebar 
  } = useApp();

  return (
    <div>
      <button onClick={toggleTheme}>
        Tema: {theme}
      </button>
      <button onClick={toggleSidebar}>
        Sidebar: {sidebarOpen ? 'Aberta' : 'Fechada'}
      </button>
    </div>
  );
}
```

### 2. Usando LocalForage Diretamente

```tsx
import { useLocalForage } from '@/hooks/useLocalForage';

function MyComponent() {
  const { value, setValue, loading, error } = useLocalForage({
    key: 'my-data',
    defaultValue: { count: 0 }
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <p>Contador: {value.count}</p>
      <button onClick={() => setValue({ count: value.count + 1 })}>
        Incrementar
      </button>
    </div>
  );
}
```

## Funcionalidades

### Store App
- ✅ Persistência automática com LocalForage
- ✅ Gerenciamento de tema (claro/escuro)
- ✅ Estado da sidebar
- ✅ Preferências do usuário
- ✅ Configurações de notificação
- ✅ Auto-refresh configurável
- ✅ Tratamento de erros
- ✅ Reset de configurações

### Hook LocalForage
- ✅ Carregamento assíncrono
- ✅ Salvamento automático
- ✅ Serialização/deserialização customizável
- ✅ Tratamento de erros
- ✅ Estados de loading e error
- ✅ Funções manuais (save, load, clear)

## Configuração

O LocalForage é configurado automaticamente com:
- Nome: `portal-dmconta`
- Store: `app-store`
- Serialização JSON automática

## Exemplo Completo

Veja `src/components/SettingsPanel.tsx` para um exemplo completo de uso do store app.
