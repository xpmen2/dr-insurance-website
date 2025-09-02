import type { NextApiRequest, NextApiResponse } from 'next';
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
    // Obtener cookie
    const cookies = parse(req.headers.cookie || '');
    const token = cookies['auth-token'];

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Verificar token
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}