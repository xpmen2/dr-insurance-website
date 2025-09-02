import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAuthCookie } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Limpiar cookie de autenticación
  clearAuthCookie(res);

  return res.status(200).json({
    message: 'Sesión cerrada exitosamente',
  });
}