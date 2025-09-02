import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { parse } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Verificar autenticación
    const cookies = parse(req.headers.cookie || '');
    const token = cookies['auth-token'];

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const user = verifyToken(token);
    if (!user || user.tipoUsuario !== 'Administrador') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Obtener ID del usuario y acción
    const { id } = req.query;
    const { authorize } = req.body;

    if (!id || typeof authorize !== 'boolean') {
      return res.status(400).json({ error: 'Parámetros inválidos' });
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id as string) },
      data: { autorizado: authorize },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        autorizado: true,
      },
    });

    return res.status(200).json({
      message: authorize ? 'Usuario autorizado' : 'Autorización revocada',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error al autorizar usuario:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}