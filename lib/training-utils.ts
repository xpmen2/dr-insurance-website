export interface VideoInfo {
  platform: 'youtube' | 'vimeo' | 'drive' | 'unknown';
  videoId: string;
  embedUrl: string;
  thumbnailUrl?: string;
}

export type ResourceType = 'VIDEO' | 'PDF';

/**
 * Detects if a URL is a video or PDF based on patterns
 */
export function detectResourceType(url: string): ResourceType {
  const videoPatterns = [
    /youtube\.com\/watch/,
    /youtu\.be\//,
    /vimeo\.com\//,
    /drive\.google\.com\/.*\/d\/.*\.(mp4|avi|mov|wmv|flv|webm)/i
  ];
  
  const isVideo = videoPatterns.some(pattern => pattern.test(url));
  return isVideo ? 'VIDEO' : 'PDF';
}

/**
 * Parses video URLs and returns embed information
 */
export function parseVideoUrl(url: string): VideoInfo | null {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      platform: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      platform: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      // Vimeo thumbnails require API access
      thumbnailUrl: undefined
    };
  }
  
  // Google Drive video
  const driveVideoMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
  if (driveVideoMatch && detectResourceType(url) === 'VIDEO') {
    const videoId = driveVideoMatch[1];
    return {
      platform: 'drive',
      videoId,
      embedUrl: `https://drive.google.com/file/d/${videoId}/preview`,
      thumbnailUrl: undefined
    };
  }
  
  return null;
}

/**
 * Parses PDF URLs and returns embed information
 */
export function parsePdfUrl(url: string): string {
  // Google Drive PDF
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  // Direct PDF link
  if (url.endsWith('.pdf')) {
    // For direct PDF links, Google Docs viewer can be used
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }
  
  return url;
}

/**
 * Validates if a URL is accessible (for public Google Drive files)
 */
export async function validatePublicUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Formats duration from seconds to readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Builds breadcrumb path for a section
 */
export async function buildBreadcrumbs(
  sectionId: number, 
  prisma: any
): Promise<Array<{ id: number; name: string }>> {
  const breadcrumbs = [];
  let currentId: number | null = sectionId;
  
  while (currentId) {
    const section = await prisma.trainingSection.findUnique({
      where: { id: currentId },
      select: { id: true, name: true, parentId: true }
    });
    
    if (!section) break;
    
    breadcrumbs.unshift({ id: section.id, name: section.name });
    currentId = section.parentId;
  }
  
  return breadcrumbs;
}