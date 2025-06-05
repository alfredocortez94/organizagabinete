import { Router } from "express";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();
import { logAudit } from '../utils/audit';

const visitSchema = Joi.object({
  visitDate: Joi.string().isoDate().required(), // data no formato ISO
  visitTime: Joi.string().required(), // horário (ex: "14:00")
  userId: Joi.string().required(), // id do usuário visitante
  status: Joi.string().valid("pending", "approved", "completed", "rejected", "cancelled").required(),
  notes: Joi.string().allow("").optional(),
  purpose: Joi.string().required(),
});

// POST /api/visits - criar visita (admin/secretario)
router.post("/", authMiddleware(["admin", "secretario"]), async (req, res) => {
  const { error, value } = visitSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: error.details[0].message,
      timestamp: new Date().toISOString(),
    });
  }
  try {
    // Checar se o visitante existe
    const visitor = await prisma.user.findUnique({ where: { id: value.userId } });
    if (!visitor || visitor.role !== "visitante") {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Visitante não encontrado ou não é do tipo 'visitante'",
        timestamp: new Date().toISOString(),
      });
    }
    // Gerar código de ticket único
    const ticketCode = `VISIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`.toUpperCase();
    
    const visit = await prisma.visit.create({
      data: {
        ...value,
        visitorName: visitor.name,
        visitorCPF: '',
        visitorEmail: visitor.email,
        visitorPhone: '',
        purpose: value.purpose,
        ticketCode: ticketCode,
      },
      select: { id: true, visitDate: true, visitTime: true, userId: true, status: true, notes: true, purpose: true, ticketCode: true, createdAt: true },
    });
    // Log de auditoria
    await logAudit({
      userId: req.user?.id,
      action: 'create',
      resource: 'visit',
      resourceId: visit.id,
      newData: visit
    });
    return res.status(201).json({
      success: true,
      data: visit,
      message: "Visita criada com sucesso",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: `Erro ao criar visita: ${err instanceof Error ? err.message : ''}`,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/visits - listar visitas (admin/secretario/visitante)
router.get("/", authMiddleware(["admin", "secretario", "visitante"]), async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      data: {},
      message: "Usuário não autenticado",
      timestamp: new Date().toISOString(),
    });
  }
  let where: any = {};
  if (user.role === "visitante") {
    where.userId = user.id;
  }
  try {
    const visits = await prisma.visit.findMany({
      where,
      select: { id: true, visitDate: true, visitTime: true, userId: true, status: true, notes: true, purpose: true, ticketCode: true, createdAt: true },
      orderBy: { visitDate: "desc" },
    });
    return res.json({
      success: true,
      data: visits,
      message: "Visitas listadas com sucesso",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: `Erro ao listar visitas: ${err instanceof Error ? err.message : ''}`,
      timestamp: new Date().toISOString(),
    });
  }
});

// PUT /api/visits/:id - atualizar visita (admin/secretario)
router.put("/:id", authMiddleware(["admin", "secretario"]), async (req, res) => {
  const { id } = req.params;
  const { error, value } = visitSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: error.details[0].message,
      timestamp: new Date().toISOString(),
    });
  }
  try {
    // Checar se a visita existe
    const visitExists = await prisma.visit.findUnique({ where: { id } });
    if (!visitExists) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Visita não encontrada",
        timestamp: new Date().toISOString(),
      });
    }
    // Checar se o visitante existe
    const visitor = await prisma.user.findUnique({ where: { id: value.userId } });
    if (!visitor || visitor.role !== "visitante") {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Visitante não encontrado ou não é do tipo 'visitante'",
        timestamp: new Date().toISOString(),
      });
    }
    // Manter o ticketCode original e atualizar dados do visitante
    // Buscar dados antigos para log
    const oldVisit = await prisma.visit.findUnique({ where: { id } });
    const visit = await prisma.visit.update({
      where: { id },
      data: {
        ...value,
        visitorName: visitor.name,
        visitorCPF: '',
        visitorEmail: visitor.email,
        visitorPhone: '',
        // Não incluir ticketCode para manter o original
      },
      select: { id: true, visitDate: true, visitTime: true, userId: true, status: true, notes: true, purpose: true, ticketCode: true, createdAt: true },
    });
    // Log de auditoria
    await logAudit({
      userId: req.user?.id,
      action: 'update',
      resource: 'visit',
      resourceId: visit.id,
      oldData: oldVisit,
      newData: visit
    });
    return res.json({
      success: true,
      data: visit,
      message: "Visita atualizada com sucesso",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: `Erro ao atualizar visita: ${err instanceof Error ? err.message : ''}`,
      timestamp: new Date().toISOString(),
    });
  }
});

// DELETE /api/visits/:id - remover visita (admin/secretario)
router.delete("/:id", authMiddleware(["admin", "secretario"]), async (req, res) => {
  const { id } = req.params;
  try {
    // Checar se a visita existe
    const visitExists = await prisma.visit.findUnique({ where: { id } });
    if (!visitExists) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Visita não encontrada",
        timestamp: new Date().toISOString(),
      });
    }
    // Buscar dados antigos para log
    const oldVisit = await prisma.visit.findUnique({ where: { id } });
    await prisma.visit.delete({ where: { id } });
    // Log de auditoria
    await logAudit({
      userId: req.user?.id,
      action: 'delete',
      resource: 'visit',
      resourceId: id,
      oldData: oldVisit
    });
    return res.json({
      success: true,
      data: {},
      message: "Visita removida com sucesso",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: `Erro ao remover visita: ${err instanceof Error ? err.message : ''}`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
