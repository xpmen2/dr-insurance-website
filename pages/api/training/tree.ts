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

// Recursive function to build tree structure
async function buildSectionTree(parentId: number | null = null): Promise<any[]> {
  const sections = await prisma.trainingSection.findMany({
    where: {
      parentId,
      isActive: true
    },
    include: {
      resources: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          children: true,
          resources: true
        }
      }
    },
    orderBy: { order: 'asc' }
  });

  const tree = [];
  
  for (const section of sections) {
    const children = await buildSectionTree(section.id);
    
    tree.push({
      id: section.id,
      name: section.name,
      description: section.description,
      level: section.level,
      order: section.order,
      hasChildren: section._count.children > 0,
      resourceCount: section._count.resources,
      resources: section.resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        url: resource.url,
        resourceType: resource.resourceType,
        duration: resource.duration,
        order: resource.order
      })),
      children
    });
  }
  
  return tree;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyAuth(req);
  
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    const { flat } = req.query;
    
    if (flat === 'true') {
      // Return flat list with parent references
      const allSections = await prisma.trainingSection.findMany({
        where: { isActive: true },
        include: {
          resources: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          parent: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              children: true,
              resources: true
            }
          }
        },
        orderBy: [
          { level: 'asc' },
          { order: 'asc' }
        ]
      });
      
      return res.status(200).json(allSections);
    } else {
      // Return hierarchical tree structure
      const tree = await buildSectionTree(null);
      
      // Add stats
      const stats = await prisma.$transaction([
        prisma.trainingSection.count({ where: { isActive: true } }),
        prisma.trainingResource.count({ where: { isActive: true } }),
        prisma.trainingResource.count({ 
          where: { 
            isActive: true,
            resourceType: 'VIDEO' 
          } 
        }),
        prisma.trainingResource.count({ 
          where: { 
            isActive: true,
            resourceType: 'PDF' 
          } 
        })
      ]);
      
      return res.status(200).json({
        tree,
        stats: {
          totalSections: stats[0],
          totalResources: stats[1],
          totalVideos: stats[2],
          totalPDFs: stats[3]
        }
      });
    }
  } catch (error) {
    console.error('Error obteniendo árbol de entrenamiento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}