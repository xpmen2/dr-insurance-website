import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { parse } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
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

    // Obtener filtro
    const { filter = 'todos' } = req.query;

    let where = {};
    if (filter === 'pendientes') {
      where = { autorizado: false };
    } else if (filter === 'autorizados') {
      where = { autorizado: true };
    }

    // Obtener usuarios
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        tipoUsuario: true,
        autorizado: true,
        fechaCreacion: true,
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}