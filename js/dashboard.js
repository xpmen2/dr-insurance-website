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