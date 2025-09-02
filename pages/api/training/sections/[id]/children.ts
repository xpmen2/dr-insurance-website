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

  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID de sección requerido' });
  }

  try {
    if (req.method === 'GET') {
      const sectionId = parseInt(id as string);
      
      // Get the section with its children and resources
      const section = await prisma.trainingSection.findUnique({
        where: { 
          id: sectionId,
          isActive: true 
        },
        include: {
          children: {
            where: { isActive: true },
            include: {
              _count: {
                select: {
                  children: true,
                  resources: true
                }
              }
            },
            orderBy: { order: 'asc' }
          },
          resources: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          }
        }
      });
      
      if (!section) {
        return res.status(404).json({ error: 'Sección no encontrada' });
      }
      
      return res.status(200).json(section);
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
  } catch (error) {
    console.error('Error obteniendo hijos de sección:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}