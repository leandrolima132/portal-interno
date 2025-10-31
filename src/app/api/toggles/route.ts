import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Service, Message, AuditLog } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const AUDIT_LOGS_FILE = path.join(DATA_DIR, 'audit-logs.json');

interface TogglesData {
  services?: Service[];
  messages?: Message[];
  auditLogs?: AuditLog[];
}

// GET - Retorna os dados dos JSONs separados
export async function GET() {
  try {
    const [servicesData, messagesData, auditLogsData] = await Promise.all([
      fs.readFile(SERVICES_FILE, 'utf8').catch(() => '[]'),
      fs.readFile(MESSAGES_FILE, 'utf8').catch(() => '[]'),
      fs.readFile(AUDIT_LOGS_FILE, 'utf8').catch(() => '[]')
    ]);

    const data: TogglesData = {
      services: JSON.parse(servicesData),
      messages: JSON.parse(messagesData),
      auditLogs: JSON.parse(auditLogsData)
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao ler arquivos JSON:', error);
    return NextResponse.json(
      { error: 'Erro ao ler arquivos JSON' },
      { status: 500 }
    );
  }
}

// POST/PUT - Salva os dados nos JSONs separados
export async function POST(request: NextRequest) {
  try {
    const data: TogglesData = await request.json();
    
    // Criar diretório se não existir
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Filtrar logs de auditoria com mais de 30 dias
    let filteredAuditLogs: AuditLog[] = [];
    if (data.auditLogs && Array.isArray(data.auditLogs)) {
    const DAYS_TO_FILTER_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias em milissegundos
    const now = new Date(); 
    const thirtyDaysAgo = new Date(now.getTime() - DAYS_TO_FILTER_MS);
      
    filteredAuditLogs = data.auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= thirtyDaysAgo;
    });
    }

    // Salvar cada arquivo separadamente
    const savePromises: Promise<void>[] = [];

    if (data.services !== undefined) {
      savePromises.push(
        fs.writeFile(
          SERVICES_FILE,
          JSON.stringify(data.services, null, 2),
          'utf8'
        )
      );
    }

    if (data.messages !== undefined) {
      savePromises.push(
        fs.writeFile(
          MESSAGES_FILE,
          JSON.stringify(data.messages, null, 2),
          'utf8'
        )
      );
    }

    if (data.auditLogs !== undefined) {
      savePromises.push(
        fs.writeFile(
          AUDIT_LOGS_FILE,
          JSON.stringify(filteredAuditLogs, null, 2),
          'utf8'
        )
      );
    }

    await Promise.all(savePromises);

    return NextResponse.json({ 
      success: true, 
      message: 'Dados salvos com sucesso',
      savedAt: new Date().toISOString(),
      saved: {
        services: data.services !== undefined,
        messages: data.messages !== undefined,
        auditLogs: data.auditLogs !== undefined
      }
    });
  } catch (error) {
    console.error('Erro ao salvar arquivos JSON:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar arquivos JSON' },
      { status: 500 }
    );
  }
}

// PUT - Mesma funcionalidade do POST
export async function PUT(request: NextRequest) {
  return POST(request);
}