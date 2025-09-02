import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import type { NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface UserPayload {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  tipoUsuario: string;
  autorizado: boolean;
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verificar contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generar JWT
export function generateToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Verificar JWT
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

// Establecer cookie de autenticación
export function setAuthCookie(res: NextApiResponse, token: string, remember: boolean = false) {
  const cookie = serialize('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 días si remember, 7 días si no
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

// Limpiar cookie de autenticación
export function clearAuthCookie(res: NextApiResponse) {
  const cookie = serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}