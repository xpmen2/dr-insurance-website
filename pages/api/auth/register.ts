import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { nombre, apellido, telefono, email, password } = req.body;

    // Validaciones
    if (!nombre || !apellido || !telefono || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario (por defecto será tipo 'Agente' y no autorizado)
    const user = await prisma.user.create({
      data: {
        nombre,
        apellido,
        telefono,
        email,
        passwordHash,
        tipoUsuario: 'Agente',
        autorizado: false,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        tipoUsuario: true,
      },
    });

    return res.status(201).json({
      message: 'Usuario creado exitosamente. Un administrador debe autorizar tu cuenta antes de poder iniciar sesión.',
      user,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
}