import React, { useState, useEffect } from 'react';
import styles from './SectionModal.module.css';

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

interface Section {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  level: number;
  order: number;
  children?: Section[];
  resources?: Resource[];
  _count?: {
    children: number;
    resources: number;
  };
}

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (section: SectionFormData) => Promise<void>;
  parentSection?: Section | null;
  editingSection?: Section | null;
  getSectionBreadcrumb?: (section: Section) => string;
  mode: 'create' | 'edit';
}

interface SectionFormData {
  id?: number;
  name: string;
  description?: string;
  parentId?: number;
}

export default function SectionModal({
  isOpen,
  onClose,
  onSubmit,
  parentSection,
  editingSection,
  getSectionBreadcrumb,
  mode
}: SectionModalProps) {
  const [formData, setFormData] = useState<SectionFormData>({
    name: '',
    description: '',
    parentId: parentSection?.id
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && editingSection) {
      setFormData({
        id: editingSection.id,
        name: editingSection.name,
        description: editingSection.description || '',
        parentId: editingSection.parentId
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        parentId: parentSection?.id
      });
    }
  }, [mode, editingSection, parentSection]);

  // Update parentId when parentSection changes in create mode
  useEffect(() => {
    if (mode === 'create' && parentSection) {
      setFormData(prev => ({ ...prev, parentId: parentSection.id }));
    }
  }, [parentSection, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la sección es requerido');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(formData);
      
      // Reset form only in create mode
      if (mode === 'create') {
        setFormData({
          name: '',
          description: '',
          parentId: parentSection?.id
        });
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la sección');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const title = mode === 'create' 
    ? (parentSection ? 'Agregar Subsección' : 'Agregar Sección Principal')
    : 'Editar Sección';

  const getLocationDisplay = () => {
    if (mode === 'edit' && editingSection?.parentId) {
      // In edit mode, show current location
      return getSectionBreadcrumb && parentSection 
        ? getSectionBreadcrumb(parentSection)
        : 'Sección padre';
    } else if (mode === 'create' && parentSection) {
      // In create mode, show where it will be created
      return getSectionBreadcrumb 
        ? getSectionBreadcrumb(parentSection)
        : parentSection.name;
    }
    return 'Raíz (Sección principal)';
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          {/* Location Display */}
          <div className={styles.formGroup}>
            <label>
              Ubicación
            </label>
            <div className={styles.sectionDisplay}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{getLocationDisplay()}</span>
            </div>
          </div>

          {/* Section Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Nombre de la sección <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Seguros de Vida"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción breve de esta sección (opcional)"
              rows={3}
            />
          </div>

          {/* Info Box */}
          {mode === 'create' && (
            <div className={styles.infoBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>
                {parentSection 
                  ? `Esta sección se creará dentro de "${parentSection.name}"`
                  : 'Esta será una sección principal en el nivel raíz'
                }
              </span>
            </div>
          )}

          {/* Error Display */}
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

          {/* Action Buttons */}
          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting 
                ? (mode === 'create' ? 'Creando...' : 'Guardando...') 
                : (mode === 'create' ? 'Crear Sección' : 'Guardar Cambios')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}