import localforage from 'localforage';
import { Service, Message, AuditLog } from '@/types';

const STORAGE_KEYS = {
  SERVICES: 'portal-services',
  MESSAGES: 'portal-messages',
  AUDIT_LOGS: 'portal-audit-logs',
  CONFIG: 'portal-config'
} as const;

/**
 * Utilitário para gerenciar toggles usando JSON
 * Suporta carregamento de arquivo JSON inicial e persistência em LocalForage
 */
export class ToggleStore {
  private storage: typeof localforage;

  constructor() {
    this.storage = localforage.createInstance({
      name: 'portal-dmconta',
      storeName: 'toggle-store'
    });
  }

  /**
   * Carrega serviços de um arquivo JSON
   */
  async loadServicesFromJSON(jsonData: Service[]): Promise<Service[]> {
    try {
      // Salva os dados do JSON no storage
      await this.storage.setItem(STORAGE_KEYS.SERVICES, jsonData);
      return jsonData;
    } catch (error) {
      console.error('Erro ao carregar serviços do JSON:', error);
      throw error;
    }
  }

  /**
   * Carrega serviços do storage
   */
  async loadServices(): Promise<Service[]> {
    try {
      const services = await this.storage.getItem<Service[]>(STORAGE_KEYS.SERVICES);
      return services || [];
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      return [];
    }
  }

  /**
   * Salva serviços no storage
   */
  async saveServices(services: Service[]): Promise<void> {
    try {
      await this.storage.setItem(STORAGE_KEYS.SERVICES, services);
    } catch (error) {
      console.error('Erro ao salvar serviços:', error);
      throw error;
    }
  }

  /**
   * Atualiza o estado de um serviço (toggle)
   */
  async toggleService(serviceId: string): Promise<Service | null> {
    try {
      const services = await this.loadServices();
      const updatedServices = services.map(service =>
        service.id === serviceId
          ? { ...service, enabled: !service.enabled, lastModified: new Date().toISOString() }
          : service
      );
      
      await this.saveServices(updatedServices);
      
      // Salvar também no JSON do servidor
      await this.saveToServerJSON(updatedServices);
      
      return updatedServices.find(s => s.id === serviceId) || null;
    } catch (error) {
      console.error('Erro ao fazer toggle do serviço:', error);
      throw error;
    }
  }

  /**
   * Salva os dados no JSON do servidor via API
   * Remove automaticamente logs com mais de 30 dias antes de salvar
   * Agora salva em arquivos JSON separados (services.json, messages.json, audit-logs.json)
   */
  private async saveToServerJSON(services: Service[]): Promise<void> {
    try {
      const messages = await this.loadMessages();
      const auditLogs = await this.loadAuditLogs(); // Já filtra logs de 30 dias
      
      // Salvar apenas os dados que mudaram (não enviar undefined)
      const data: { services?: Service[]; messages?: Message[]; auditLogs?: AuditLog[] } = {
        services,
        messages,
        auditLogs
      };

      const response = await fetch('/api/toggles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar no servidor: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao salvar no JSON do servidor:', error);
      // Não lança erro para não quebrar a funcionalidade principal
      // A persistência no LocalForage já funcionou
    }
  }

  /**
   * Adiciona um novo serviço
   */
  async addService(service: Service): Promise<void> {
    try {
      const services = await this.loadServices();
      const updatedServices = [...services, service];
      await this.saveServices(updatedServices);
      
      // Salvar também no JSON do servidor
      await this.saveToServerJSON(updatedServices);
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      throw error;
    }
  }

  /**
   * Remove um serviço
   */
  async deleteService(serviceId: string): Promise<void> {
    try {
      const services = await this.loadServices();
      const updatedServices = services.filter(s => s.id !== serviceId);
      await this.saveServices(updatedServices);
      
      // Salvar também no JSON do servidor
      await this.saveToServerJSON(updatedServices);
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      throw error;
    }
  }

  /**
   * Carrega mensagens do storage
   */
  async loadMessages(): Promise<Message[]> {
    try {
      const messages = await this.storage.getItem<Message[]>(STORAGE_KEYS.MESSAGES);
      return messages || [];
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      return [];
    }
  }

  /**
   * Salva mensagens no storage
   */
  async saveMessages(messages: Message[]): Promise<void> {
    try {
      await this.storage.setItem(STORAGE_KEYS.MESSAGES, messages);
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
      throw error;
    }
  }

  /**
   * Filtra logs mantendo apenas os dos últimos 30 dias
   */
  private filterLogsByDate(logs: AuditLog[]): AuditLog[] {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= thirtyDaysAgo;
    });
  }

  /**
   * Carrega logs de auditoria do storage
   * Remove automaticamente logs com mais de 30 dias
   */
  async loadAuditLogs(): Promise<AuditLog[]> {
    try {
      const logs = await this.storage.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS);
      const filteredLogs = logs ? this.filterLogsByDate(logs) : [];
      
      // Se foram filtrados logs, salvar a lista atualizada
      if (logs && filteredLogs.length !== logs.length) {
        await this.storage.setItem(STORAGE_KEYS.AUDIT_LOGS, filteredLogs);
      }
      
      return filteredLogs;
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error);
      return [];
    }
  }

  /**
   * Adiciona um log de auditoria
   * Remove automaticamente logs com mais de 30 dias
   */
  async addAuditLog(log: AuditLog): Promise<void> {
    try {
      const logs = await this.loadAuditLogs();
      const filteredLogs = this.filterLogsByDate([log, ...logs]);
      await this.storage.setItem(STORAGE_KEYS.AUDIT_LOGS, filteredLogs);
    } catch (error) {
      console.error('Erro ao adicionar log de auditoria:', error);
      throw error;
    }
  }

  /**
   * Exporta todos os dados para JSON
   * Remove automaticamente logs com mais de 30 dias antes de exportar
   */
  async exportToJSON(): Promise<string> {
    try {
      const [services, messages, auditLogs] = await Promise.all([
        this.loadServices(),
        this.loadMessages(),
        this.loadAuditLogs() // Já filtra logs de 30 dias
      ]);

      const data = {
        services,
        messages,
        auditLogs,
        exportedAt: new Date().toISOString()
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  /**
   * Importa dados de JSON
   * Remove automaticamente logs com mais de 30 dias ao importar
   */
  async importFromJSON(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.services) {
        await this.saveServices(data.services);
      }
      if (data.messages) {
        await this.saveMessages(data.messages);
      }
      if (data.auditLogs) {
        // Filtrar logs de 30 dias ao importar
        const filteredLogs = this.filterLogsByDate(data.auditLogs);
        await this.storage.setItem(STORAGE_KEYS.AUDIT_LOGS, filteredLogs);
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  }

  /**
   * Limpa todos os dados
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.storage.removeItem(STORAGE_KEYS.SERVICES),
        this.storage.removeItem(STORAGE_KEYS.MESSAGES),
        this.storage.removeItem(STORAGE_KEYS.AUDIT_LOGS),
        this.storage.removeItem(STORAGE_KEYS.CONFIG)
      ]);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }
}

// Instância singleton
export const toggleStore = new ToggleStore();
