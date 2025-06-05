import { Router } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();
import { logAudit } from '../utils/audit';

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\-=[\]{};:\\"\\|,.<>\/?]).+$'))
    .required()
    .messages({
      'string.min': 'A senha deve ter pelo menos 8 caracteres.',
      'string.pattern.base': 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.'
    }),
  role: Joi.string().valid('admin', 'secretario', 'visitante').required(),
});

// POST /api/users - Apenas admin pode cadastrar usuários
router.post('/', authMiddleware(['admin']), async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: error.details[0].message,
      timestamp: new Date().toISOString(),
    });
  }
  const { name, email, password, role } = value;
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({
        success: false,
        data: {},
        message: 'E-mail já cadastrado',
        timestamp: new Date().toISOString(),
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    // Log de auditoria
    await logAudit({
      userId: req.user?.id,
      action: 'create',
      resource: 'user',
      resourceId: user.id,
      newData: user
    });
    return res.status(201).json({
      success: true,
      data: user,
      message: 'Usuário cadastrado com sucesso',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: 'Erro ao cadastrar usuário',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/users - listar usuários (admin)
router.get('/', authMiddleware(['admin']), async (req, res) => {
  const { name, email } = req.query;
  const where: any = {};
  if (name) where.name = { contains: String(name), mode: 'insensitive' };
  if (email) where.email = { contains: String(email), mode: 'insensitive' };
  try {
    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({
      success: true,
      data: users,
      message: 'Usuários listados com sucesso',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: 'Erro ao listar usuários',
      timestamp: new Date().toISOString(),
    });
  }
});

// PUT /api/users/:id - atualizar usuário (admin)
router.put('/:id', authMiddleware(['admin']), async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    // Validação de senha forte só se password for informado
    if (password !== undefined) {
      const passwordSchema = Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\-=[\]{};:\\"\\|,.<>\/?]).+$'))
        .messages({
          'string.min': 'A senha deve ter pelo menos 8 caracteres.',
          'string.pattern.base': 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.'
        });
      const { error } = passwordSchema.validate(password);
      if (error) {
        return res.status(400).json({
          success: false,
          data: {},
          message: error.details[0].message,
          timestamp: new Date().toISOString(),
        });
      }
      data.password = await bcrypt.hash(password, 10);
    }
    if (role) data.role = role;
    // Buscar dados antigos para log
    const oldUser = await prisma.user.findUnique({ where: { id } });
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    // Log de auditoria
    await logAudit({
      userId: req.user?.id,
      action: 'update',
      resource: 'user',
      resourceId: user.id,
      oldData: oldUser,
      newData: user
    });
    return res.json({
      success: true,
      data: user,
      message: 'Usuário atualizado com sucesso',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: 'Erro ao atualizar usuário',
      timestamp: new Date().toISOString(),
    });
  }
});

// DELETE /api/users/:id - remover usuário (admin)
router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar dados antigos para log
    const oldUser = await prisma.user.findUnique({ where: { id } });
    await prisma.user.delete({ where: { id } });
    // Log de auditoria
    await logAudit({
      userId: req.user?.id,
      action: 'delete',
      resource: 'user',
      resourceId: id,
      oldData: oldUser
    });
    return res.json({
      success: true,
      data: {},
      message: 'Usuário removido com sucesso',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: 'Erro ao remover usuário',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
