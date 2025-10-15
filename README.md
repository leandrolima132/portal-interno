# Portal de Gestão DM Card

Portal web centralizado para gestão de serviços e mensagens em tempo real, desenvolvido para substituir o sistema de arquivos JSON e proporcionar agilidade operacional.

## 🎯 Funcionalidades

### Dashboard
- Visão geral do sistema com métricas em tempo real
- Status dos serviços (ativo/inativo)
- Indicadores de saúde do sistema
- Atividade recente

### Gestão de Serviços
- Toggle visual para ativar/desativar serviços
- Controle de dependências entre serviços
- Classificação por impacto (crítico, alto, médio, baixo)
- Ações em lote (ativar/desativar todos)
- Modo de manutenção

### Editor de Mensagens
- Edição em tempo real das mensagens do sistema
- Preview antes de publicar
- Categorização por tipo (ERROR, WARNING, INFO, SUCCESS)
- Controle por plataforma (WEB, MOBILE, BOTH)
- Versionamento automático

### Sistema de Auditoria
- Log completo de todas as mudanças
- Filtros por tipo de ação e data
- Rastreamento de usuário e timestamp
- Exportação de relatórios (CSV/JSON)

## 🏗️ Arquitetura

### Stack Tecnológica
- **Frontend**: Next.js 15 + React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons
- **State Management**: React Context + useReducer
- **TypeScript**: Tipagem completa

### Estrutura de Dados
```typescript
interface Service {
  id: string;
  name: string;
  enabled: boolean;
  dependencies: string[];
  impact: 'low' | 'medium' | 'high' | 'critical';
  lastModified: string;
  description?: string;
  category: string;
}

interface Message {
  code: string;
  message: string;
  type: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  platform: 'WEB' | 'MOBILE' | 'BOTH';
  enabled: boolean;
  lastModified: string;
  category?: string;
}
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

### Acesso
O portal estará disponível em `http://localhost:3000`

## 📋 Casos de Uso

### 1. Manutenção Preventiva
1. Acessar módulo "Serviços"
2. Desativar serviços que serão mantidos
3. Ativar modo de manutenção global
4. Configurar mensagens personalizadas
5. Monitorar impacto em tempo real

### 2. Rollback de Emergência
1. Identificar serviços com problemas
2. Desativar funcionalidades problemáticas
3. Corrigir problemas no backend
4. Reativar serviços após correção
5. Verificar logs de auditoria

### 3. Gestão de Mensagens
1. Acessar módulo "Mensagens"
2. Editar mensagens em tempo real
3. Usar preview antes de publicar
4. Deploy automático para produção
5. Monitorar feedback dos usuários

## 🔧 Configuração

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=https://api.dmcard.com
NEXT_PUBLIC_WS_URL=wss://ws.dmcard.com
```

### Integração com API
O portal está preparado para integração com APIs REST para:
- Sincronização de dados em tempo real
- Deploy automático de mudanças
- Monitoramento de saúde dos serviços
- Notificações push

## 📊 Monitoramento

### Métricas Disponíveis
- Total de serviços
- Serviços ativos/inativos
- Mensagens por tipo
- Mudanças recentes
- Saúde do sistema

### Alertas
- Serviços críticos inativos
- Falhas de dependência
- Sobrecarga do sistema
- Tempo de resposta

## 🔒 Segurança

### Controle de Acesso
- Autenticação de usuários
- Controle de permissões por módulo
- Logs de auditoria completos
- Sessões seguras

### Auditoria
- Rastreamento de todas as ações
- Timestamp de mudanças
- Identificação de usuário
- Backup automático

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Integração com APIs reais
- [ ] Notificações em tempo real
- [ ] Gráficos de performance
- [ ] Backup automático
- [ ] Modo offline
- [ ] Mobile app

### Melhorias Planejadas
- [ ] Cache inteligente
- [ ] Analytics de uso
- [ ] Versionamento granular
- [ ] Rollback automático
- [ ] Testes automatizados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Email: suporte@dmcard.com
- Slack: #portal-dmcard
- Issues: GitHub Issues