import React, { useState, useEffect } from 'react';
import styles from './TrainingSection.module.css';
import AddResourceModal from './AddResourceModal';
import SectionModal from './SectionModal';
import ConfirmDialog from './ConfirmDialog';

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
  level: number;
  order: number;
  parentId?: number;
  children?: Section[];
  resources?: Resource[];
  _count?: {
    children: number;
    resources: number;
  };
}

interface TreeStats {
  totalSections: number;
  totalResources: number;
  totalVideos: number;
  totalPDFs: number;
}

interface TrainingSectionProps {
  user: any;
}

export default function TrainingSection({ user }: TrainingSectionProps) {
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<Section[]>([]);
  const [stats, setStats] = useState<TreeStats | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'VIDEO' | 'PDF'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionModalMode, setSectionModalMode] = useState<'create' | 'edit'>('create');
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [resourceModalMode, setResourceModalMode] = useState<'create' | 'edit'>('create');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState<{
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      const response = await fetch('/api/training/tree', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTree(data.tree);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSectionClick = (section: Section) => {
    // Clear resource selection when selecting a section
    setSelectedResource(null);
    
    // Toggle selection - if clicking the same section, deselect it
    if (selectedSection?.id === section.id) {
      setSelectedSection(null);
    } else {
      setSelectedSection(section);
    }
    
    // Always toggle expansion regardless of selection
    toggleSection(section.id);
  };

  const handleResourceClick = (resource: Resource, section: Section) => {
    // Toggle selection - if clicking the same resource, deselect it
    if (selectedResource?.id === resource.id) {
      setSelectedResource(null);
      setSelectedSection(null);
    } else {
      setSelectedResource(resource);
      setSelectedSection(section); // Keep track of the parent section
    }
  };

  const handleResourceSubmit = async (resourceData: any) => {
    try {
      let url: string;
      let method: string;
      
      if (resourceModalMode === 'create') {
        url = '/api/training/resources';
        method = 'POST';
      } else {
        url = `/api/training/resources?id=${resourceData.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar recurso');
      }

      const savedResource = await response.json();
      
      // Reload training data to reflect changes
      await loadTrainingData();
      
      // Show success message (could be a toast notification)
      console.log(resourceModalMode === 'create' ? 'Recurso agregado exitosamente' : 'Recurso actualizado exitosamente');
      
    } catch (error: any) {
      console.error('Error saving resource:', error);
      throw error;
    }
  };

  const getSectionBreadcrumb = (section: Section): string => {
    const breadcrumb: string[] = [];
    let current: Section | undefined = section;
    
    while (current) {
      breadcrumb.unshift(current.name);
      // Find parent section in the tree
      current = current.parentId ? findSectionById(tree, current.parentId) : undefined;
    }
    
    return breadcrumb.join(' > ');
  };
  
  const findSectionById = (sections: Section[], id: number): Section | undefined => {
    for (const section of sections) {
      if (section.id === id) return section;
      if (section.children) {
        const found = findSectionById(section.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const handleAddSection = () => {
    setSectionModalMode('create');
    setEditingSection(null);
    setShowSectionModal(true);
  };

  const handleEdit = () => {
    if (selectedResource) {
      setResourceModalMode('edit');
      setEditingResource(selectedResource);
      setShowAddModal(true);
    } else if (selectedSection) {
      setSectionModalMode('edit');
      setEditingSection(selectedSection);
      setShowSectionModal(true);
    }
  };

  const handleSectionSubmit = async (sectionData: any) => {
    try {
      let url: string;
      let method: string;
      
      if (sectionModalMode === 'create') {
        url = '/api/training/sections';
        method = 'POST';
      } else {
        // For PUT, include id in query parameter
        url = `/api/training/sections?id=${sectionData.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar la sección');
      }

      const savedSection = await response.json();
      
      // Reload training data to reflect changes
      await loadTrainingData();
      
      // Show success message (could be a toast notification)
      console.log(sectionModalMode === 'create' ? 'Sección creada exitosamente' : 'Sección actualizada exitosamente');
      
    } catch (error: any) {
      console.error('Error saving section:', error);
      throw error;
    }
  };

  const handleDelete = () => {
    if (selectedResource) {
      setConfirmDialogData({
        title: 'Eliminar Recurso',
        message: `¿Estás seguro de que deseas eliminar "${selectedResource.title}"? Esta acción no se puede deshacer.`,
        onConfirm: async () => {
          await deleteResource(selectedResource.id);
          setShowConfirmDialog(false);
        }
      });
      setShowConfirmDialog(true);
    } else if (selectedSection) {
      setConfirmDialogData({
        title: 'Eliminar Sección',
        message: `¿Estás seguro de que deseas eliminar la sección "${selectedSection.name}"? Esta acción eliminará también todos los recursos dentro de esta sección y no se puede deshacer.`,
        onConfirm: async () => {
          await deleteSection(selectedSection.id);
          setShowConfirmDialog(false);
        }
      });
      setShowConfirmDialog(true);
    }
  };

  const deleteResource = async (resourceId: number) => {
    try {
      const response = await fetch(`/api/training/resources?id=${resourceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar recurso');
      }

      // Clear selection and reload data
      setSelectedResource(null);
      await loadTrainingData();
      
      console.log('Recurso eliminado exitosamente');
      
    } catch (error: any) {
      console.error('Error deleting resource:', error);
      alert('Error al eliminar el recurso: ' + error.message);
    }
  };

  const deleteSection = async (sectionId: number) => {
    try {
      const response = await fetch(`/api/training/sections?id=${sectionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar sección');
      }

      // Clear selection and reload data
      setSelectedSection(null);
      await loadTrainingData();
      
      console.log('Sección eliminada exitosamente');
      
    } catch (error: any) {
      console.error('Error deleting section:', error);
      alert('Error al eliminar la sección: ' + error.message);
    }
  };

  const renderSection = (section: Section, depth: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const hasChildren = section.children && section.children.length > 0;
    const hasResources = section.resources && section.resources.length > 0;
    const isSelected = selectedSection?.id === section.id;

    const matchesSearch = searchTerm === '' || 
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch && searchTerm !== '') {
      return null;
    }

    const levelClass = `level${depth}`;

    return (
      <div key={section.id} className={styles.section} data-level={depth}>
        <div 
          className={`${styles.sectionHeader} ${styles[levelClass]} ${isSelected ? styles.selected : ''}`}
          onClick={() => handleSectionClick(section)}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          <span className={styles.toggleWrapper}>
            {(hasChildren || hasResources) ? (
              <svg 
                className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}
                width="6" 
                height="6" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M10 17l5-5-5-5v10z"/>
              </svg>
            ) : null}
          </span>
          
          <span className={styles.sectionLabel}>
            {depth === 0 ? (
              <svg className={styles.folderIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            ) : depth === 1 ? (
              <svg className={styles.folderIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            ) : null}
            {section.name}
          </span>
          
          {(section._count?.resources || section.resources?.length) ? (
            <span className={styles.resourceCount}>
              {section._count?.resources || section.resources?.length}
            </span>
          ) : null}
        </div>

        {isExpanded && (
          <div className={styles.sectionContent}>
            {hasResources && section.resources?.map(resource => {
              const matchesFilter = filterType === 'all' || resource.resourceType === filterType;
              if (!matchesFilter) return null;

              return (
                <div
                  key={resource.id}
                  className={`${styles.resourceItem} ${selectedResource?.id === resource.id ? styles.selected : ''}`}
                  onClick={() => handleResourceClick(resource, section)}
                  style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }}
                >
                  <span className={styles.toggleWrapper}></span>
                  
                  <span className={styles.resourceLabel}>
                    {resource.resourceType === 'VIDEO' ? (
                      <svg className={`${styles.resourceIcon} ${styles.video}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    ) : (
                      <svg className={`${styles.resourceIcon} ${styles.document}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    )}
                    {resource.title}
                  </span>
                  
                  {resource.duration && (
                    <span className={styles.resourceDuration}>{resource.duration}</span>
                  )}
                </div>
              );
            })}

            {hasChildren && section.children?.map(child => 
              renderSection(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando entrenamientos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Left Column - Navigation Tree */}
      <div className={styles.navColumn}>
        <div className={styles.navHeader}>
          <div className={styles.navHeaderTop}>
            <h3>Contenido de Entrenamiento</h3>
            <div className={styles.actionButtons}>
              <button 
                className={`${styles.actionButton} ${!selectedSection && !selectedResource ? styles.primary : styles.secondary}`}
                onClick={() => handleAddSection()}
                title={selectedSection ? "Agregar subsección" : "Agregar sección principal"}
                disabled={false}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </button>
              
              <button 
                className={`${styles.actionButton} ${selectedSection ? styles.primary : styles.disabled}`}
                onClick={() => {
                  setResourceModalMode('create');
                  setEditingResource(null);
                  setShowAddModal(true);
                }}
                title={selectedSection ? `Agregar recurso en "${selectedSection.name}"` : "Selecciona una sección primero"}
                disabled={!selectedSection}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  <line x1="10" y1="9" x2="10" y2="15"></line>
                  <line x1="7" y1="12" x2="13" y2="12"></line>
                </svg>
              </button>

              <button 
                className={`${styles.actionButton} ${(selectedSection || selectedResource) ? styles.secondary : styles.disabled}`}
                onClick={() => handleEdit()}
                title={selectedResource ? "Editar recurso" : selectedSection ? "Editar sección" : "Selecciona un elemento para editar"}
                disabled={!selectedSection && !selectedResource}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>

              <button 
                className={`${styles.actionButton} ${(selectedSection || selectedResource) ? styles.danger : styles.disabled}`}
                onClick={() => handleDelete()}
                title={selectedResource ? "Eliminar recurso" : selectedSection ? "Eliminar sección" : "Selecciona un elemento para eliminar"}
                disabled={!selectedSection && !selectedResource}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
          {stats && (
            <div className={styles.stats}>
              <span>{stats.totalVideos} videos</span>
              <span>{stats.totalPDFs} PDFs</span>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterButtons}>
            <button 
              className={filterType === 'all' ? styles.active : ''}
              onClick={() => setFilterType('all')}
            >
              Todos
            </button>
            <button 
              className={filterType === 'VIDEO' ? styles.active : ''}
              onClick={() => setFilterType('VIDEO')}
            >
              Videos
            </button>
            <button 
              className={filterType === 'PDF' ? styles.active : ''}
              onClick={() => setFilterType('PDF')}
            >
              PDFs
            </button>
          </div>
        </div>

        {/* Tree Navigation */}
        <div className={styles.tree}>
          {tree.map(section => renderSection(section, 0))}
        </div>
      </div>

      {/* Right Column - Content Viewer */}
      <div className={styles.contentColumn}>
        {selectedResource ? (
          <div className={styles.resourceViewer}>
            <div className={styles.viewerHeader}>
              <div className={styles.viewerInfo}>
                <div className={styles.breadcrumbs}>
                  <span>{selectedSection?.name}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span>{selectedResource.title}</span>
                </div>
                <h2>{selectedResource.title}</h2>
                {selectedResource.description && (
                  <p>{selectedResource.description}</p>
                )}
              </div>
              <button 
                className={styles.openExternal}
                onClick={() => window.open(selectedResource.url, '_blank')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Abrir en nueva pestaña
              </button>
            </div>

            <div className={styles.embedContainer}>
              {selectedResource.embedUrl ? (
                <iframe
                  src={selectedResource.embedUrl}
                  className={styles.resourceEmbed}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className={styles.embedFallback}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  <p>Vista previa no disponible</p>
                  <button 
                    onClick={() => window.open(selectedResource.url, '_blank')}
                    className={styles.primaryBtn}
                  >
                    Abrir recurso
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.welcome}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
              <path d="M12 22V8"></path>
              <path d="M12 8L2 7"></path>
              <path d="M12 8l10-1"></path>
            </svg>
            <h2>Portal de Entrenamientos</h2>
            <p>Selecciona un recurso del menú para comenzar</p>
            
            {stats && (
              <div className={styles.welcomeStats}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{stats.totalSections}</div>
                  <div className={styles.statLabel}>Secciones</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{stats.totalResources}</div>
                  <div className={styles.statLabel}>Recursos</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleResourceSubmit}
        sections={tree}
        defaultSectionId={selectedSection?.id}
        selectedSection={selectedSection}
        getSectionBreadcrumb={getSectionBreadcrumb}
        editingResource={editingResource}
        mode={resourceModalMode}
      />

      {/* Section Modal */}
      <SectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        onSubmit={handleSectionSubmit}
        parentSection={sectionModalMode === 'create' ? selectedSection : (editingSection?.parentId ? findSectionById(tree, editingSection.parentId) : null)}
        editingSection={editingSection}
        getSectionBreadcrumb={getSectionBreadcrumb}
        mode={sectionModalMode}
      />

      {/* Confirm Dialog */}
      {confirmDialogData && (
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={confirmDialogData.onConfirm}
          title={confirmDialogData.title}
          message={confirmDialogData.message}
          confirmText="Eliminar"
          type="danger"
        />
      )}
    </div>
  );
}