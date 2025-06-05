import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogParams {
  userId?: string;
  action: 'create' | 'update' | 'delete';
  resource: string;
  resourceId?: string;
  oldData?: any;
  newData?: any;
}

export async function logAudit({ userId, action, resource, resourceId, oldData, newData }: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        oldData: oldData ? oldData : undefined,
        newData: newData ? newData : undefined,
      },
    });
  } catch (error) {
    // Não lançar erro para não interromper a ação principal
    console.error('Erro ao registrar log de auditoria:', error);
  }
}
