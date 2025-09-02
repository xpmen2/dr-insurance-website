import React, { useState, useEffect } from 'react';

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
    setSelectedSection(section);
    setSelectedResource(null);
    toggleSection(section.id);
  };

  const handleResourceClick = (resource: Resource, section: Section) => {
    setSelectedResource(resource);
    setSelectedSection(section);
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

    return (
      <div key={section.id} className="training-section" data-level={depth}>
        <div 
          className={`section-header level-${depth} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleSectionClick(section)}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          <span className="toggle-wrapper">
            {(hasChildren || hasResources) ? (
              <svg 
                className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}
                width="6" 
                height="6" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M10 17l5-5-5-5v10z"/>
              </svg>
            ) : null}
          </span>
          
          <span className="section-label">
            {depth === 0 ? (
              <svg className="folder-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            ) : depth === 1 ? (
              <svg className="folder-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            ) : null}
            {section.name}
          </span>
          
          {(section._count?.resources || section.resources?.length) ? (
            <span className="resource-count">
              {section._count?.resources || section.resources?.length}
            </span>
          ) : null}
        </div>

        {isExpanded && (
          <div className="section-content">
            {hasResources && section.resources?.map(resource => {
              const matchesFilter = filterType === 'all' || resource.resourceType === filterType;
              if (!matchesFilter) return null;

              return (
                <div
                  key={resource.id}
                  className={`resource-item level-${depth + 1} ${selectedResource?.id === resource.id ? 'selected' : ''}`}
                  onClick={() => handleResourceClick(resource, section)}
                  style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }}
                >
                  <span className="toggle-wrapper"></span>
                  
                  <span className="resource-label">
                    {resource.resourceType === 'VIDEO' ? (
                      <svg className="resource-icon video" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    ) : (
                      <svg className="resource-icon document" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    )}
                    {resource.title}
                  </span>
                  
                  {resource.duration && (
                    <span className="resource-duration">{resource.duration}</span>
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
      <div className="training-loading">
        <div className="loading-spinner"></div>
        <p>Cargando entrenamientos...</p>
      </div>
    );
  }

  return (
    <div className="training-container">
      {/* Left Column - Navigation Tree */}
      <div className="training-nav-column">
        <div className="training-nav-header">
          <h3>Contenido de Entrenamiento</h3>
          {stats && (
            <div className="training-stats">
              <span>{stats.totalVideos} videos</span>
              <span>{stats.totalPDFs} PDFs</span>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="training-controls">
          <div className="search-box">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          <div className="filter-buttons">
            <button 
              className={filterType === 'all' ? 'active' : ''}
              onClick={() => setFilterType('all')}
            >
              Todos
            </button>
            <button 
              className={filterType === 'VIDEO' ? 'active' : ''}
              onClick={() => setFilterType('VIDEO')}
            >
              Videos
            </button>
            <button 
              className={filterType === 'PDF' ? 'active' : ''}
              onClick={() => setFilterType('PDF')}
            >
              PDFs
            </button>
          </div>
        </div>

        {/* Tree Navigation */}
        <div className="training-tree">
          {tree.map(section => renderSection(section, 0))}
        </div>
      </div>

      {/* Right Column - Content Viewer */}
      <div className="training-content-column">
        {selectedResource ? (
          <div className="resource-viewer">
            <div className="viewer-header">
              <div className="viewer-info">
                <div className="breadcrumbs">
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
                className="open-external"
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

            <div className="embed-container">
              {selectedResource.embedUrl ? (
                <iframe
                  src={selectedResource.embedUrl}
                  className="resource-embed"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="embed-fallback">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  <p>Vista previa no disponible</p>
                  <button 
                    onClick={() => window.open(selectedResource.url, '_blank')}
                    className="primary-btn"
                  >
                    Abrir recurso
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="training-welcome">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
              <path d="M12 22V8"></path>
              <path d="M12 8L2 7"></path>
              <path d="M12 8l10-1"></path>
            </svg>
            <h2>Portal de Entrenamientos</h2>
            <p>Selecciona un recurso del menú para comenzar</p>
            
            {stats && (
              <div className="welcome-stats">
                <div className="stat-item">
                  <div className="stat-value">{stats.totalSections}</div>
                  <div className="stat-label">Secciones</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.totalResources}</div>
                  <div className="stat-label">Recursos</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .training-container {
          display: flex;
          height: calc(100vh - 200px);
          gap: 20px;
        }

        /* Left Column - Navigation */
        .training-nav-column {
          width: 320px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .training-nav-header {
          padding: 16px;
          border-bottom: 1px solid #e8e8e8;
        }

        .training-nav-header h3 {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .training-stats {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: #999;
        }

        /* Search and Filters */
        .training-controls {
          padding: 12px;
          border-bottom: 1px solid #e8e8e8;
        }

        .search-box {
          position: relative;
          margin-bottom: 10px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #b3b3b3;
        }

        .search-box input {
          width: 100%;
          padding: 6px 10px 6px 30px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 12px;
          outline: none;
          transition: all 0.2s;
          background: #fafafa;
        }

        .search-box input:focus {
          border-color: #0066CC;
          background: white;
          box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
        }

        .filter-buttons {
          display: flex;
          gap: 6px;
        }

        .filter-buttons button {
          flex: 1;
          padding: 5px 10px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background: white;
          color: #666;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .filter-buttons button:hover {
          background: #f8f8f8;
        }

        .filter-buttons button.active {
          background: #003F7F;
          color: white;
          border-color: #003F7F;
        }

        /* Tree Navigation */
        .training-tree {
          flex: 1;
          overflow-y: auto;
          padding: 4px 0;
        }

        .training-tree::-webkit-scrollbar {
          width: 6px;
        }

        .training-tree::-webkit-scrollbar-track {
          background: transparent;
        }

        .training-tree::-webkit-scrollbar-thumb {
          background: #d0d0d0;
          border-radius: 3px;
        }

        .training-tree::-webkit-scrollbar-thumb:hover {
          background: #b0b0b0;
        }

        .training-section {
          user-select: none;
        }

        /* Tree Item Base Styles */
        .section-header {
          display: flex;
          align-items: center;
          height: 32px;
          cursor: pointer;
          transition: background-color 0.1s ease;
          border-radius: 3px;
          margin: 0 8px;
        }

        .section-header:hover {
          background: #f6f8fa;
        }

        .section-header.selected {
          background: #e1f5fe;
        }

        /* Level-specific styling */
        .section-header.level-0 {
          font-weight: 600;
        }

        .section-header.level-1 {
          font-weight: 500;
        }

        .section-header.level-2,
        .section-header.level-3 {
          font-weight: 400;
        }

        /* Toggle Arrow */
        .toggle-wrapper {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 6px;
        }

        .toggle-icon {
          color: #6e7781;
          transition: transform 0.15s ease;
        }

        .toggle-icon.expanded {
          transform: rotate(90deg);
        }

        /* Section Label Container */
        .section-label {
          display: flex;
          align-items: center;
          flex: 1;
          font-size: 13px;
          color: #24292f;
          line-height: 20px;
        }

        .folder-icon {
          color: #54aeff;
          margin-right: 8px;
        }

        /* Resource Count Badge */
        .resource-count {
          background: #f6f8fa;
          color: #656d76;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          margin-left: 8px;
        }

        .section-content {
          animation: slideDown 0.15s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Resource Items */
        .resource-item {
          display: flex;
          align-items: center;
          height: 28px;
          cursor: pointer;
          transition: background-color 0.1s ease;
          border-radius: 3px;
          margin: 0 8px;
        }

        .resource-item:hover {
          background: #f6f8fa;
        }

        .resource-item.selected {
          background: #fff8e1;
        }

        /* Resource Label Container */
        .resource-label {
          display: flex;
          align-items: center;
          flex: 1;
          font-size: 12px;
          color: #656d76;
          line-height: 18px;
        }

        .resource-icon {
          margin-right: 8px;
          flex-shrink: 0;
        }

        .resource-icon.video {
          color: #ff6b6b;
        }

        .resource-icon.document {
          color: #4dabf7;
        }

        .resource-duration {
          font-size: 10px;
          color: #8c959f;
          margin-left: 8px;
        }

        /* Right Column - Content */
        .training-content-column {
          flex: 1;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Resource Viewer */
        .resource-viewer {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .viewer-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        .viewer-info {
          flex: 1;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }

        .breadcrumbs svg {
          color: #999;
        }

        .viewer-info h2 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #003F7F;
        }

        .viewer-info p {
          margin: 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .open-external {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          color: #666;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .open-external:hover {
          background: #f5f5f5;
          color: #003F7F;
        }

        .embed-container {
          flex: 1;
          padding: 20px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .resource-embed {
          width: 100%;
          height: 100%;
          max-width: 1000px;
          border: none;
          border-radius: 8px;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .embed-fallback {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .embed-fallback svg {
          color: #D4AF37;
          margin-bottom: 16px;
        }

        .embed-fallback p {
          margin: 0 0 20px 0;
          color: #666;
        }

        .primary-btn {
          padding: 10px 24px;
          background: #0066CC;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .primary-btn:hover {
          background: #0052A3;
        }

        /* Welcome Screen */
        .training-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .training-welcome svg {
          color: #D4AF37;
          margin-bottom: 20px;
        }

        .training-welcome h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #003F7F;
        }

        .training-welcome p {
          margin: 0;
          font-size: 16px;
          color: #666;
        }

        .welcome-stats {
          display: flex;
          gap: 40px;
          margin-top: 40px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #003F7F;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        /* Loading State */
        .training-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #003F7F;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .training-loading p {
          margin-top: 16px;
          color: #666;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .training-container {
            flex-direction: column;
            height: auto;
          }

          .training-nav-column {
            width: 100%;
            max-height: 400px;
          }

          .training-content-column {
            min-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}