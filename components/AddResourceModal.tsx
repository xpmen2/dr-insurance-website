import React, { useState, useEffect } from 'react';
import styles from './AddResourceModal.module.css';

interface Section {
  id: number;
  name: string;
  level: number;
  children?: Section[];
}

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resource: ResourceFormData) => Promise<void>;
  sections: Section[];
  defaultSectionId?: number;
  selectedSection?: Section | null;
  getSectionBreadcrumb?: (section: Section) => string;
  editingResource?: Resource | null;
  mode?: 'create' | 'edit';
}

interface Resource {
  id: number;
  title: string;
  description?: string;
  url: string;
  resourceType: 'VIDEO' | 'PDF';
  duration?: string;
  order: number;
  embedUrl?: string;
  platform?: string;
}

interface ResourceFormData {
  id?: number;
  url: string;
  title: string;
  description?: string;
  sectionId: number;
  resourceType?: 'VIDEO' | 'PDF';
  duration?: string;
  embedUrl?: string;
  platform?: string;
}

interface UrlInfo {
  type: 'VIDEO' | 'PDF' | 'UNKNOWN';
  platform?: 'youtube' | 'vimeo' | 'googledrive' | 'other';
  suggestedTitle?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
}

export default function AddResourceModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  sections,
  defaultSectionId,
  selectedSection,
  getSectionBreadcrumb,
  editingResource,
  mode = 'create'
}: AddResourceModalProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    url: '',
    title: '',
    description: '',
    sectionId: selectedSection?.id || defaultSectionId || 0
  });
  
  const [urlInfo, setUrlInfo] = useState<UrlInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [manualResourceType, setManualResourceType] = useState<'VIDEO' | 'PDF' | null>(null);

  useEffect(() => {
    if (formData.url) {
      const timer = setTimeout(() => {
        analyzeUrl(formData.url);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUrlInfo(null);
    }
  }, [formData.url]);
  
  // Update sectionId when selectedSection changes
  useEffect(() => {
    if (selectedSection && mode === 'create') {
      setFormData(prev => ({ ...prev, sectionId: selectedSection.id }));
    }
  }, [selectedSection, mode]);

  // Initialize form for editing
  useEffect(() => {
    if (mode === 'edit' && editingResource) {
      setFormData({
        id: editingResource.id,
        url: editingResource.url,
        title: editingResource.title,
        description: editingResource.description || '',
        sectionId: selectedSection?.id || 0, // Will need to be set properly
        resourceType: editingResource.resourceType,
        duration: editingResource.duration || ''
      });
      
      // Set the detected URL info for editing
      if (editingResource.url) {
        analyzeUrl(editingResource.url);
      }
    } else if (mode === 'create') {
      setFormData({
        url: '',
        title: '',
        description: '',
        sectionId: selectedSection?.id || defaultSectionId || 0
      });
      setUrlInfo(null);
    }
  }, [mode, editingResource, selectedSection, defaultSectionId]);

  const analyzeUrl = (url: string) => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      let info: UrlInfo = { type: 'UNKNOWN' };

      // YouTube detection
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          info = {
            type: 'VIDEO',
            platform: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          };
        }
      }
      // Vimeo detection
      else if (hostname.includes('vimeo.com')) {
        const vimeoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
        if (vimeoId) {
          info = {
            type: 'VIDEO',
            platform: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoId}`
          };
        }
      }
      // Google Drive detection
      else if (hostname.includes('drive.google.com')) {
        const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        if (fileId) {
          // For Google Drive, we can't detect the type from URL
          // Mark as UNKNOWN to let user select manually
          info = {
            type: 'UNKNOWN',
            platform: 'googledrive',
            embedUrl: `https://drive.google.com/file/d/${fileId}/preview`
          };
        }
      }
      // Direct PDF links
      else if (url.endsWith('.pdf')) {
        info = {
          type: 'PDF',
          platform: 'other'
        };
      }

      setUrlInfo(info);
      
      // Auto-update resource type if detected
      if (info.type !== 'UNKNOWN') {
        setFormData(prev => ({ ...prev, resourceType: info.type as 'VIDEO' | 'PDF' }));
        setManualResourceType(null); // Clear manual selection
      } else if (info.platform === 'googledrive') {
        // For Google Drive, we need manual selection
        setManualResourceType(null); // Reset to force user selection
      }
    } catch (e) {
      setError('URL inválida');
      setUrlInfo(null);
      setManualResourceType(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const renderSectionOptions = (sections: Section[], level: number = 0): JSX.Element[] => {
    return sections.reduce<JSX.Element[]>((acc, section) => {
      acc.push(
        <option key={section.id} value={section.id}>
          {'  '.repeat(level)}{level > 0 ? '└ ' : ''}{section.name}
        </option>
      );
      if (section.children) {
        acc.push(...renderSectionOptions(section.children, level + 1));
      }
      return acc;
    }, []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url || !formData.title || !formData.sectionId) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    // Check if we have a valid resource type
    let finalResourceType: 'VIDEO' | 'PDF';
    
    if (urlInfo?.type !== 'UNKNOWN') {
      finalResourceType = urlInfo.type as 'VIDEO' | 'PDF';
    } else if (urlInfo?.platform === 'googledrive' && manualResourceType) {
      finalResourceType = manualResourceType;
    } else {
      setError('Por favor selecciona el tipo de recurso (Video o PDF)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        ...formData,
        resourceType: finalResourceType,
        embedUrl: urlInfo?.embedUrl,
        platform: urlInfo?.platform
      });
      
      // Reset form
      setFormData({
        url: '',
        title: '',
        description: '',
        sectionId: selectedSection?.id || defaultSectionId || 0
      });
      setUrlInfo(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al agregar el recurso');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{mode === 'edit' ? 'Editar Recurso' : 'Agregar Nuevo Recurso'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="url">
              URL del Recurso <span className={styles.required}>*</span>
            </label>
            <div className={styles.urlInputWrapper}>
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... o drive.google.com/..."
                required
              />
              {isAnalyzing && (
                <div className={styles.analyzingSpinner}>
                  <div className={styles.spinner}></div>
                </div>
              )}
            </div>
            {urlInfo && (
              <>
                {urlInfo.type !== 'UNKNOWN' ? (
                  <div className={styles.urlDetected}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Detectado: {urlInfo.type === 'VIDEO' ? 'Video' : 'Documento'} 
                    {urlInfo.platform && ` de ${urlInfo.platform}`}
                  </div>
                ) : urlInfo.platform === 'googledrive' ? (
                  <div className={styles.typeSelector}>
                    <p className={styles.typeSelectorLabel}>
                      Google Drive detectado. Por favor selecciona el tipo de archivo:
                    </p>
                    <div className={styles.typeOptions}>
                      <label className={styles.typeOption}>
                        <input
                          type="radio"
                          name="resourceType"
                          value="VIDEO"
                          checked={manualResourceType === 'VIDEO'}
                          onChange={() => setManualResourceType('VIDEO')}
                        />
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                        </svg>
                        <span>Video</span>
                      </label>
                      <label className={styles.typeOption}>
                        <input
                          type="radio"
                          name="resourceType"
                          value="PDF"
                          checked={manualResourceType === 'PDF'}
                          onChange={() => setManualResourceType('PDF')}
                        />
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span>PDF</span>
                      </label>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">
              Título <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Introducción a los seguros de vida"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción breve del contenido (opcional)"
              rows={3}
            />
          </div>

          {selectedSection ? (
            <div className={styles.formGroup}>
              <label>
                Ubicación
              </label>
              <div className={styles.sectionDisplay}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{getSectionBreadcrumb ? getSectionBreadcrumb(selectedSection) : selectedSection.name}</span>
              </div>
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="section">
                Sección <span className={styles.required}>*</span>
              </label>
              <select
                id="section"
                value={formData.sectionId}
                onChange={(e) => setFormData({ ...formData, sectionId: parseInt(e.target.value) })}
                required
              >
                <option value="">Selecciona una sección</option>
                {renderSectionOptions(sections)}
              </select>
            </div>
          )}

          {formData.resourceType === 'VIDEO' && (
            <div className={styles.formGroup}>
              <label htmlFor="duration">
                Duración (opcional)
              </label>
              <input
                type="text"
                id="duration"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ej: 15:30"
              />
            </div>
          )}

          {/* Preview Section */}
          {urlInfo && (urlInfo.type !== 'UNKNOWN' || (urlInfo.platform === 'googledrive' && manualResourceType)) && (
            <div className={styles.preview}>
              <h3>Vista Previa</h3>
              <div className={styles.previewContent}>
                {(urlInfo.type === 'VIDEO' || manualResourceType === 'VIDEO') ? (
                  <div className={styles.videoPreview}>
                    {urlInfo.thumbnailUrl ? (
                      <img src={urlInfo.thumbnailUrl} alt="Preview" />
                    ) : (
                      <div className={styles.videoPlaceholder}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.documentPreview}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>Documento PDF</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting || !urlInfo || (urlInfo.type === 'UNKNOWN' && (!urlInfo.platform || urlInfo.platform !== 'googledrive' || !manualResourceType))}
            >
              {isSubmitting 
                ? (mode === 'edit' ? 'Guardando...' : 'Agregando...')
                : (mode === 'edit' ? 'Guardar Cambios' : 'Agregar Recurso')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}