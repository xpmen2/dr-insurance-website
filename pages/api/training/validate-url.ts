import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { parse } from 'cookie';
import { detectResourceType, parseVideoUrl, parsePdfUrl } from '../../../lib/training-utils';

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

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL es requerida' });
    }

    // Detect resource type
    const resourceType = detectResourceType(url);
    
    let embedUrl = url;
    let platform = 'unknown';
    let thumbnailUrl = null;
    let isValid = false;
    let errorMessage = null;

    if (resourceType === 'VIDEO') {
      const videoInfo = parseVideoUrl(url);
      if (videoInfo) {
        embedUrl = videoInfo.embedUrl;
        platform = videoInfo.platform;
        thumbnailUrl = videoInfo.thumbnailUrl || null;
        isValid = true;
      } else {
        errorMessage = 'URL de video no reconocida. Formatos soportados: YouTube, Vimeo, Google Drive';
      }
    } else {
      // It's a PDF
      embedUrl = parsePdfUrl(url);
      
      // Check if it's a Google Drive PDF
      if (url.includes('drive.google.com')) {
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
        if (driveMatch) {
          platform = 'drive';
          isValid = true;
        } else {
          errorMessage = 'URL de Google Drive inválida';
        }
      } else if (url.endsWith('.pdf')) {
        platform = 'direct';
        isValid = true;
      } else {
        errorMessage = 'URL de PDF no reconocida. Use Google Drive o un enlace directo .pdf';
      }
    }

    // For Google Drive files, remind about permissions
    let permissionNote = null;
    if (platform === 'drive') {
      permissionNote = 'Asegúrese de que el archivo tenga permisos "Cualquiera con el enlace puede ver"';
    }

    return res.status(200).json({
      isValid,
      resourceType,
      platform,
      originalUrl: url,
      embedUrl,
      thumbnailUrl,
      errorMessage,
      permissionNote
    });
    
  } catch (error) {
    console.error('Error validando URL:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}