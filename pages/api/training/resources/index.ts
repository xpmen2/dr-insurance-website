import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, ResourceType } from '@prisma/client';
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

// Function to detect resource type from URL
function detectResourceType(url: string): ResourceType {
  const videoPatterns = [
    /youtube\.com\/watch/,
    /youtu\.be\//,
    /vimeo\.com\//,
    /drive\.google\.com\/.*\/d\/.*\.(mp4|avi|mov|wmv|flv|webm)/i
  ];
  
  const isVideo = videoPatterns.some(pattern => pattern.test(url));
  return isVideo ? 'VIDEO' : 'PDF';
}

// Function to extract video ID and platform
function parseVideoUrl(url: string): { platform: string; videoId: string; embedUrl: string } | null {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return {
      platform: 'youtube',
      videoId: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
    };
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      platform: 'vimeo',
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }
  
  // Google Drive
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
  if (driveMatch) {
    return {
      platform: 'drive',
      videoId: driveMatch[1],
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    };
  }
  
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyAuth(req);
  
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const { sectionId, resourceType } = req.query;
        
        const where: any = {
          isActive: true
        };
        
        if (sectionId) {
          where.sectionId = parseInt(sectionId as string);
        }
        
        if (resourceType) {
          where.resourceType = resourceType as ResourceType;
        }
        
        const resources = await prisma.trainingResource.findMany({
          where,
          include: {
            section: {
              select: {
                id: true,
                name: true,
                parentId: true
              }
            }
          },
          orderBy: { order: 'asc' }
        });
        
        // Add embed URLs for videos
        const enrichedResources = resources.map(resource => {
          if (resource.resourceType === 'VIDEO') {
            const videoInfo = parseVideoUrl(resource.url);
            return {
              ...resource,
              embedUrl: videoInfo?.embedUrl || resource.url,
              platform: videoInfo?.platform || 'unknown'
            };
          }
          // For PDFs from Google Drive
          if (resource.resourceType === 'PDF' && resource.url.includes('drive.google.com')) {
            const driveMatch = resource.url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
            if (driveMatch) {
              return {
                ...resource,
                embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
              };
            }
          }
          return resource;
        });
        
        return res.status(200).json(enrichedResources);

      case 'POST':
        // Only admins can create resources
        if (user.tipoUsuario !== 'Administrador') {
          return res.status(403).json({ error: 'Solo administradores pueden crear recursos' });
        }

        const { 
          sectionId: newSectionId, 
          title, 
          description, 
          url, 
          duration, 
          thumbnailUrl,
          order,
          embedUrl: providedEmbedUrl,
          platform: providedPlatform
        } = req.body;
        
        if (!newSectionId || !title || !url) {
          return res.status(400).json({ 
            error: 'Sección, título y URL son requeridos' 
          });
        }

        // Auto-detect resource type from URL
        const detectedResourceType = req.body.resourceType || detectResourceType(url);
        
        // Validate section exists
        const section = await prisma.trainingSection.findUnique({
          where: { id: newSectionId }
        });
        
        if (!section) {
          return res.status(400).json({ error: 'Sección no encontrada' });
        }

        // Use provided embedUrl and platform if available, otherwise generate them
        let embedUrl: string | undefined = providedEmbedUrl;
        let platform: string | undefined = providedPlatform;
        
        // If not provided, generate embed URL and platform
        if (!embedUrl) {
          if (detectedResourceType === 'VIDEO') {
            const videoInfo = parseVideoUrl(url);
            if (videoInfo) {
              embedUrl = videoInfo.embedUrl;
              platform = videoInfo.platform;
            }
          } else if (detectedResourceType === 'PDF' && url.includes('drive.google.com')) {
            const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
            if (driveMatch) {
              embedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
              platform = 'googledrive';
            }
          }
        }

        // Get the next order number if not provided
        let finalOrder = order;
        if (finalOrder === undefined || finalOrder === null) {
          const maxOrder = await prisma.trainingResource.aggregate({
            where: { sectionId: newSectionId },
            _max: { order: true }
          });
          finalOrder = (maxOrder._max.order || 0) + 1;
        }

        const newResource = await prisma.trainingResource.create({
          data: {
            sectionId: newSectionId,
            title,
            description,
            url,
            embedUrl,
            platform,
            resourceType: detectedResourceType,
            duration,
            thumbnailUrl,
            order: finalOrder,
            isActive: true
          }
        });
        
        return res.status(201).json(newResource);

      case 'PUT':
        // Only admins can update resources
        if (user.tipoUsuario !== 'Administrador') {
          return res.status(403).json({ error: 'Solo administradores pueden actualizar recursos' });
        }

        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'ID de recurso requerido' });
        }

        const updateData: any = {};
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.url !== undefined) {
          updateData.url = req.body.url;
          updateData.resourceType = detectResourceType(req.body.url);
        }
        if (req.body.duration !== undefined) updateData.duration = req.body.duration;
        if (req.body.thumbnailUrl !== undefined) updateData.thumbnailUrl = req.body.thumbnailUrl;
        if (req.body.order !== undefined) updateData.order = req.body.order;
        if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

        const updatedResource = await prisma.trainingResource.update({
          where: { id: parseInt(id as string) },
          data: updateData
        });
        
        return res.status(200).json(updatedResource);

      case 'DELETE':
        // Only admins can delete resources
        if (user.tipoUsuario !== 'Administrador') {
          return res.status(403).json({ error: 'Solo administradores pueden eliminar recursos' });
        }

        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ error: 'ID de recurso requerido' });
        }

        // Soft delete
        await prisma.trainingResource.update({
          where: { id: parseInt(deleteId as string) },
          data: { isActive: false }
        });
        
        return res.status(200).json({ message: 'Recurso eliminado exitosamente' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
  } catch (error) {
    console.error('Error en API de recursos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}