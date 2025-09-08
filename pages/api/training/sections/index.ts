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

  try {
    switch (req.method) {
      case 'GET':
        // Get all sections with their children and resources count
        const { parentId, includeResources } = req.query;
        
        const where: any = {
          isActive: true
        };
        
        if (parentId === 'null' || parentId === undefined) {
          where.parentId = null; // Root sections only
        } else if (parentId) {
          where.parentId = parseInt(parentId as string);
        }
        
        const sections = await prisma.trainingSection.findMany({
          where,
          include: {
            children: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            },
            resources: includeResources === 'true' ? {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            } : false,
            _count: {
              select: {
                resources: true,
                children: true
              }
            }
          },
          orderBy: { order: 'asc' }
        });
        
        return res.status(200).json(sections);

      case 'POST':
        // Only admins can create sections
        if (user.tipoUsuario !== 'Administrador') {
          return res.status(403).json({ error: 'Solo administradores pueden crear secciones' });
        }

        const { parentId: newParentId, name, description, order } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'El nombre es requerido' });
        }

        // Check parent level if parentId is provided
        let level = 0;
        if (newParentId) {
          const parent = await prisma.trainingSection.findUnique({
            where: { id: newParentId }
          });
          
          if (!parent) {
            return res.status(400).json({ error: 'Sección padre no encontrada' });
          }
          
          if (parent.level >= 3) {
            return res.status(400).json({ error: 'Máximo 3 niveles de anidamiento permitidos' });
          }
          
          level = parent.level + 1;
        }

        const newSection = await prisma.trainingSection.create({
          data: {
            parentId: newParentId || null,
            name,
            description,
            level,
            order: order || 0,
            isActive: true
          }
        });
        
        return res.status(201).json(newSection);

      case 'PUT':
        // Only admins can update sections
        if (user.tipoUsuario !== 'Administrador') {
          return res.status(403).json({ error: 'Solo administradores pueden actualizar secciones' });
        }

        // Get id from query parameter OR from request body
        const sectionId = req.query.id || req.body.id;
        if (!sectionId) {
          return res.status(400).json({ error: 'ID de sección requerido' });
        }

        const updateData: any = {};
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.order !== undefined) updateData.order = req.body.order;
        if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

        const updatedSection = await prisma.trainingSection.update({
          where: { id: parseInt(sectionId as string) },
          data: updateData
        });
        
        return res.status(200).json(updatedSection);

      case 'DELETE':
        // Only admins can delete sections
        if (user.tipoUsuario !== 'Administrador') {
          return res.status(403).json({ error: 'Solo administradores pueden eliminar secciones' });
        }

        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ error: 'ID de sección requerido' });
        }

        const deleteIdNumber = parseInt(deleteId as string);

        // Check if section exists and has children
        const sectionWithCounts = await prisma.trainingSection.findUnique({
          where: { id: deleteIdNumber },
          include: {
            _count: {
              select: {
                children: { where: { isActive: true } },
                resources: { where: { isActive: true } }
              }
            }
          }
        });

        if (!sectionWithCounts) {
          return res.status(404).json({ error: 'Sección no encontrada' });
        }

        // Don't allow deleting sections with subsections (they need to be deleted first)
        if (sectionWithCounts._count.children > 0) {
          return res.status(400).json({ 
            error: 'No se puede eliminar una sección con subsecciones. Elimina primero las subsecciones.' 
          });
        }

        // If section has resources, delete them first (cascade delete)
        if (sectionWithCounts._count.resources > 0) {
          // Soft delete all resources in this section
          await prisma.trainingResource.updateMany({
            where: { 
              sectionId: deleteIdNumber,
              isActive: true
            },
            data: { isActive: false }
          });
        }

        // Soft delete the section
        await prisma.trainingSection.update({
          where: { id: deleteIdNumber },
          data: { isActive: false }
        });
        
        return res.status(200).json({ 
          message: 'Sección eliminada exitosamente',
          deletedResources: sectionWithCounts._count.resources 
        });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
  } catch (error) {
    console.error('Error en API de secciones:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}