/**
 * Dashboard Functionality
 * Handles sidebar navigation and interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const dashboardContent = document.getElementById('dashboardContent');
    
    // Mobile Sidebar Toggle
    if (menuToggle) {
        // Create overlay for mobile
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        // Close sidebar when clicking overlay
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Navigation Click Handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for logout
            if (this.closest('.logout-btn')) {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            const navItem = this.closest('.nav-item');
            if (navItem) {
                navItem.classList.add('active');
            }
            
            // Get the section to show
            const target = this.getAttribute('href').substring(1);
            
            // Load content based on section
            loadContent(target);
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                document.querySelector('.sidebar-overlay').classList.remove('active');
            }
        });
    });
    
    // Content Loading Function
    function loadContent(section) {
        // Add loading state
        dashboardContent.classList.add('loading');
        
        // Simulate content loading
        setTimeout(() => {
            let content = '';
            
            switch(section) {
                case 'agentes':
                    content = getAgentesContent();
                    break;
                case 'citas':
                    content = getCitasContent();
                    break;
                case 'comisiones':
                    content = getComisionesContent();
                    break;
                case 'entrenamientos':
                    content = getEntrenamientosContent();
                    break;
                case 'configuracion':
                    content = getConfiguracionContent();
                    break;
                case 'ayuda':
                    content = getAyudaContent();
                    break;
                default:
                    content = getInicioContent();
            }
            
            dashboardContent.innerHTML = content;
            dashboardContent.classList.remove('loading');
            
            // Initialize any new components
            initializeComponents();
        }, 300);
    }
    
    // Content Templates
    function getAgentesContent() {
        return `
            <div class="welcome-section">
                <h1 class="page-title">Gestión de Agentes</h1>
                <p class="page-subtitle">Administra tu equipo de agentes de seguros</p>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header">
                    <h2 class="card-title">Lista de Agentes</h2>
                    <button class="card-action">+ Agregar Agente</button>
                </div>
                <div class="card-body">
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 2px solid #E5E7EB;">
                                    <th style="text-align: left; padding: 12px; font-weight: 600; color: #6B7280; font-size: 12px; text-transform: uppercase;">Nombre</th>
                                    <th style="text-align: left; padding: 12px; font-weight: 600; color: #6B7280; font-size: 12px; text-transform: uppercase;">Email</th>
                                    <th style="text-align: left; padding: 12px; font-weight: 600; color: #6B7280; font-size: 12px; text-transform: uppercase;">Teléfono</th>
                                    <th style="text-align: left; padding: 12px; font-weight: 600; color: #6B7280; font-size: 12px; text-transform: uppercase;">Estado</th>
                                    <th style="text-align: left; padding: 12px; font-weight: 600; color: #6B7280; font-size: 12px; text-transform: uppercase;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid #F3F4F6;">
                                    <td style="padding: 16px 12px; font-size: 14px; color: #111827; font-weight: 500;">María González</td>
                                    <td style="padding: 16px 12px; font-size: 14px; color: #6B7280;">maria@example.com</td>
                                    <td style="padding: 16px 12px; font-size: 14px; color: #6B7280;">(305) 555-0101</td>
                                    <td style="padding: 16px 12px;"><span style="background: #10B981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Activo</span></td>
                                    <td style="padding: 16px 12px;">
                                        <button style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 13px; font-weight: 500;">Ver detalles</button>
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid #F3F4F6;">
                                    <td style="padding: 16px 12px; font-size: 14px; color: #111827; font-weight: 500;">Carlos Rodríguez</td>
                                    <td style="padding: 16px 12px; font-size: 14px; color: #6B7280;">carlos@example.com</td>
                                    <td style="padding: 16px 12px; font-size: 14px; color: #6B7280;">(305) 555-0102</td>
                                    <td style="padding: 16px 12px;"><span style="background: #10B981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Activo</span></td>
                                    <td style="padding: 16px 12px;">
                                        <button style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 13px; font-weight: 500;">Ver detalles</button>
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid #F3F4F6;">
                                    <td style="padding: 16px 12px; font-size: 14px; color: #111827; font-weight: 500;">Ana Martínez</td>
                                    <td style="padding: 16px 12px; font-size: 14px; color: #6B7280;">ana@example.com</td>
                                    <td style="padding: 16px 12px; font-size: 14px; color: #6B7280;">(305) 555-0103</td>
                                    <td style="padding: 16px 12px;"><span style="background: #F59E0B; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Pendiente</span></td>
                                    <td style="padding: 16px 12px;">
                                        <button style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 13px; font-weight: 500;">Ver detalles</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getCitasContent() {
        return `
            <div class="welcome-section">
                <h1 class="page-title">Citas Médicas</h1>
                <p class="page-subtitle">Gestiona las citas médicas de tus clientes</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon appointments">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Citas Hoy</h3>
                        <p class="stat-value">8</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon appointments">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Esta Semana</h3>
                        <p class="stat-value">45</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon appointments">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Pendientes</h3>
                        <p class="stat-value">12</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header">
                    <h2 class="card-title">Calendario de Citas</h2>
                    <button class="card-action">+ Nueva Cita</button>
                </div>
                <div class="card-body" style="text-align: center; padding: 60px;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" stroke-width="1.5" style="margin: 0 auto 16px;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p style="color: #6B7280; font-size: 14px;">El calendario de citas estará disponible pronto</p>
                </div>
            </div>
        `;
    }
    
    function getComisionesContent() {
        return `
            <div class="welcome-section">
                <h1 class="page-title">Comisiones</h1>
                <p class="page-subtitle">Revisa tus comisiones y pagos</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon commissions">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Este Mes</h3>
                        <p class="stat-value">$24,580</p>
                        <p class="stat-change positive">+18% vs mes anterior</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon commissions">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Pendiente de Pago</h3>
                        <p class="stat-value">$8,450</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon commissions">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Total Anual</h3>
                        <p class="stat-value">$185,320</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header">
                    <h2 class="card-title">Historial de Comisiones</h2>
                    <button class="card-action">Exportar</button>
                </div>
                <div class="card-body" style="text-align: center; padding: 60px;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" stroke-width="1.5" style="margin: 0 auto 16px;">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <p style="color: #6B7280; font-size: 14px;">El detalle de comisiones estará disponible pronto</p>
                </div>
            </div>
        `;
    }
    
    function getEntrenamientosContent() {
        return `
            <div class="welcome-section">
                <h1 class="page-title">Centro de Entrenamientos</h1>
                <p class="page-subtitle">Accede a videos de capacitación sobre nuestras líneas de seguros</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #8B5CF6, #A78BFA); color: white;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Videos Disponibles</h3>
                        <p class="stat-value">24</p>
                        <p class="stat-change positive">Próximamente</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #10B981, #34D399); color: white;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Líneas de Seguro</h3>
                        <p class="stat-value">8</p>
                        <p class="stat-change positive">Categorías</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #F59E0B, #F97316); color: white;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-title">Duración Total</h3>
                        <p class="stat-value">12h</p>
                        <p class="stat-change positive">De contenido</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <!-- Training Categories -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2 class="card-title">Categorías de Entrenamiento</h2>
                        <button class="card-action">Ver todo</button>
                    </div>
                    <div class="card-body">
                        <div class="training-categories">
                            <div class="training-category">
                                <div class="category-icon" style="background: rgba(59, 130, 246, 0.1); color: #3B82F6;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                </div>
                                <div class="category-content">
                                    <h3 class="category-title">Seguros de Vida IUL</h3>
                                    <p class="category-description">Fundamentos y estrategias de venta</p>
                                    <span class="category-count">8 videos</span>
                                </div>
                            </div>
                            
                            <div class="training-category">
                                <div class="category-icon" style="background: rgba(16, 185, 129, 0.1); color: #10B981;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path>
                                    </svg>
                                </div>
                                <div class="category-content">
                                    <h3 class="category-title">Seguros de Salud</h3>
                                    <p class="category-description">Planes y coberturas disponibles</p>
                                    <span class="category-count">6 videos</span>
                                </div>
                            </div>
                            
                            <div class="training-category">
                                <div class="category-icon" style="background: rgba(245, 158, 11, 0.1); color: #F59E0B;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                    </svg>
                                </div>
                                <div class="category-content">
                                    <h3 class="category-title">Técnicas de Venta</h3>
                                    <p class="category-description">Métodos efectivos de cierre</p>
                                    <span class="category-count">5 videos</span>
                                </div>
                            </div>
                            
                            <div class="training-category">
                                <div class="category-icon" style="background: rgba(139, 92, 246, 0.1); color: #8B5CF6;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="m23 21-3.5-3.5"></path>
                                    </svg>
                                </div>
                                <div class="category-content">
                                    <h3 class="category-title">Atención al Cliente</h3>
                                    <p class="category-description">Servicio y retención de clientes</p>
                                    <span class="category-count">5 videos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Access -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2 class="card-title">Acceso Rápido</h2>
                    </div>
                    <div class="card-body">
                        <div class="quick-training-access">
                            <div class="training-item featured">
                                <div class="training-thumbnail">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" stroke-width="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div class="training-info">
                                    <h4 class="training-title">Introducción a IUL</h4>
                                    <p class="training-duration">45 min</p>
                                    <span class="training-status new">Nuevo</span>
                                </div>
                            </div>
                            
                            <div class="training-item">
                                <div class="training-thumbnail">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div class="training-info">
                                    <h4 class="training-title">Objeciones Comunes</h4>
                                    <p class="training-duration">30 min</p>
                                </div>
                            </div>
                            
                            <div class="training-item">
                                <div class="training-thumbnail">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div class="training-info">
                                    <h4 class="training-title">Proceso de Solicitud</h4>
                                    <p class="training-duration">25 min</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                            <p style="color: var(--primary-gold); font-size: 14px; font-weight: 500; margin: 0 0 8px 0;">📹 Videos próximamente disponibles</p>
                            <p style="color: #6B7280; font-size: 12px; margin: 0;">Los entrenamientos se vincularán a Google Drive para fácil acceso</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .training-categories {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .training-category {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: #F9FAFB;
                    border-radius: 12px;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                
                .training-category:hover {
                    background: #F3F4F6;
                    transform: translateY(-2px);
                }
                
                .category-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .category-content {
                    flex: 1;
                }
                
                .category-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 4px 0;
                }
                
                .category-description {
                    font-size: 14px;
                    color: #6B7280;
                    margin: 0 0 8px 0;
                }
                
                .category-count {
                    font-size: 12px;
                    color: var(--primary-blue);
                    font-weight: 500;
                    background: rgba(0, 63, 127, 0.1);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                
                .quick-training-access {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .training-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 8px;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                
                .training-item:hover {
                    background: #F9FAFB;
                }
                
                .training-item.featured {
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
                    border: 1px solid rgba(212, 175, 55, 0.2);
                }
                
                .training-thumbnail {
                    width: 40px;
                    height: 40px;
                    background: #F3F4F6;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .training-info {
                    flex: 1;
                }
                
                .training-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 2px 0;
                }
                
                .training-duration {
                    font-size: 12px;
                    color: #6B7280;
                    margin: 0;
                }
                
                .training-status {
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .training-status.new {
                    background: var(--primary-gold);
                    color: white;
                }
            </style>
        `;
    }
    
    function getConfiguracionContent() {
        return `
            <div class="welcome-section">
                <h1 class="page-title">Configuración</h1>
                <p class="page-subtitle">Personaliza tu experiencia en el dashboard</p>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header">
                    <h2 class="card-title">Preferencias</h2>
                </div>
                <div class="card-body" style="text-align: center; padding: 60px;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" stroke-width="1.5" style="margin: 0 auto 16px;">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24M1.54 12h6m6 0h6"></path>
                    </svg>
                    <p style="color: #6B7280; font-size: 14px;">Las opciones de configuración estarán disponibles pronto</p>
                </div>
            </div>
        `;
    }
    
    function getAyudaContent() {
        return `
            <div class="welcome-section">
                <h1 class="page-title">Centro de Ayuda</h1>
                <p class="page-subtitle">Encuentra respuestas a tus preguntas</p>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header">
                    <h2 class="card-title">¿Cómo podemos ayudarte?</h2>
                </div>
                <div class="card-body" style="text-align: center; padding: 60px;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" stroke-width="1.5" style="margin: 0 auto 16px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p style="color: #6B7280; font-size: 14px; margin-bottom: 16px;">El centro de ayuda estará disponible pronto</p>
                    <p style="color: #6B7280; font-size: 14px;">Mientras tanto, contáctanos al <strong>(305) 555-1234</strong></p>
                </div>
            </div>
        `;
    }
    
    function getInicioContent() {
        // Return to default dashboard content
        location.reload();
    }
    
    // Initialize Components
    function initializeComponents() {
        // Re-initialize any event listeners for dynamically loaded content
        const buttons = dashboardContent.querySelectorAll('button');
        buttons.forEach(btn => {
            if (!btn.hasAttribute('data-initialized')) {
                btn.setAttribute('data-initialized', 'true');
                btn.addEventListener('click', function() {
                    if (!this.closest('.logout-btn')) {
                        showNotification('Esta función estará disponible pronto', 'info');
                    }
                });
            }
        });
    }
    
    // Quick Action Buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showNotification(`La acción "${action}" estará disponible pronto`, 'info');
        });
    });
    
    // Notification Button
    const notificationBtn = document.querySelector('.notifications-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('No tienes nuevas notificaciones', 'success');
        });
    }
    
    // User Menu Button
    const userMenuBtn = document.querySelector('.user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            showNotification('El menú de usuario estará disponible pronto', 'info');
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.dashboard-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `dashboard-notification dashboard-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${type === 'success' ? 
                        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' :
                        '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
                    }
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('style[data-dashboard-notification]')) {
            const style = document.createElement('style');
            style.setAttribute('data-dashboard-notification', '');
            style.textContent = `
                .dashboard-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 16px 20px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    z-index: 2000;
                    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    max-width: 320px;
                    border-left: 4px solid;
                }
                
                .dashboard-notification-info {
                    border-left-color: var(--primary-blue);
                }
                
                .dashboard-notification-info svg {
                    color: var(--primary-blue);
                }
                
                .dashboard-notification-success {
                    border-left-color: #10B981;
                }
                
                .dashboard-notification-success svg {
                    color: #10B981;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Initialize components on load
    initializeComponents();
    
})();