import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { parse } from 'cookie';

const prisma = new PrismaClient();

interface DecodedToken {
  id: number;
  email: string;
  tipoUsuario: string;
}

async function verifyAuth(req: NextApiRequest): Promise<DecodedToken | null> {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies['auth-token'];
  
  if (!token) return null;
  
  try {
    return verifyToken(token) as DecodedToken;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyAuth(req);
  
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  if (user.tipoUsuario !== 'Administrador') {
    return res.status(403).json({ error: 'Solo administradores pueden reordenar recursos' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    const { resources } = req.body;
    
    if (!Array.isArray(resources)) {
      return res.status(400).json({ error: 'Se requiere un array de recursos' });
    }

    // Update order for each resource
    const updates = resources.map((resource: { id: number; order: number }) => 
      prisma.trainingResource.update({
        where: { id: resource.id },
        data: { order: resource.order }
      })
    );

    await prisma.$transaction(updates);
    
    return res.status(200).json({ message: 'Orden actualizado exitosamente' });
  } catch (error) {
    console.error('Error reordenando recursos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}