import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

// Rate limit específico para login
import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: error.details[0].message,
      timestamp: new Date().toISOString(),
    });
  }
  const { email, password } = value;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({
      success: false,
      data: {},
      message: "Usuário ou senha inválidos",
      timestamp: new Date().toISOString(),
    });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({
      success: false,
      data: {},
      message: "Usuário ou senha inválidos",
      timestamp: new Date().toISOString(),
    });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "changeme",
    { expiresIn: String(process.env.JWT_EXPIRES_IN || "8h") }
  );
  return res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    message: "Login realizado com sucesso",
    timestamp: new Date().toISOString(),
  });
});

// POST /api/auth/refresh
router.post("/refresh", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res
      .status(401)
      .json({
        success: false,
        data: {},
        message: "Token não informado",
        timestamp: new Date().toISOString(),
      });
  }
  const [, token] = auth.split(" ");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
if (typeof payload !== 'object' || payload === null) {
  return res.status(401).json({ success: false, data: {}, message: 'Token inválido', timestamp: new Date().toISOString() });
}
    // Remove iat/exp para novo token
    const { iat, exp, ...rest } = payload as jwt.JwtPayload;
    const newToken = jwt.sign(rest, process.env.JWT_SECRET || "changeme", {
      expiresIn: String(process.env.JWT_EXPIRES_IN || "8h"),
    });
    return res.json({
      success: true,
      data: { token: newToken },
      message: "Token renovado",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        data: {},
        message: "Token inválido",
        timestamp: new Date().toISOString(),
      });
  }
});

// POST /api/auth/logout (apenas resposta padrão, JWT é stateless)
router.post("/logout", (req, res) => {
  return res.json({
    success: true,
    data: {},
    message: "Logout realizado",
    timestamp: new Date().toISOString(),
  });
});

export default router;
