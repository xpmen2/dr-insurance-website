import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import dinámico para evitar SSR issues
const TrainingSection = dynamic(() => import('../components/TrainingSection'), {
  ssr: false,
  loading: () => <div>Cargando entrenamientos...</div>
});

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  tipoUsuario: string;
  autorizado?: boolean;
  fechaCreacion?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Para gestión de usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [userFilter, setUserFilter] = useState('todos');
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeSection === 'usuarios' && user?.tipoUsuario === 'Administrador') {
      fetchUsers();
    }
  }, [activeSection, userFilter, user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`/api/users?filter=${userFilter}`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAuthorize = async (userId: number, authorize: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorize })
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error al autorizar usuario:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - DR Insurance</title>
        <meta name="description" content="Panel de control de DR Insurance - Gestiona agentes, citas y comisiones." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/variables.css" />
        <link rel="stylesheet" href="/css/base.css" />
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>

      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`} id="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
              <a href="/index.html" className="sidebar-logo">
                <img src="/images/logo-dr-insurance.png" alt="DR Insurance" className="sidebar-logo-img" />
              </a>
            </div>

            {/* User Profile */}
            <div className="sidebar-profile">
              <div className="profile-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.nombre} {user?.apellido}</h3>
                <p className="profile-role">{user?.tipoUsuario}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
              <ul className="nav-list">
                <li className={`nav-item ${activeSection === 'inicio' ? 'active' : ''}`}>
                  <a 
                    href="#inicio" 
                    className="nav-link"
                    onClick={(e) => { e.preventDefault(); setActiveSection('inicio'); }}
                  >
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Inicio</span>
                  </a>
                </li>

                {/* Gestión de Usuarios - Solo para Administradores */}
                {user?.tipoUsuario === 'Administrador' && (
                  <li className={`nav-item ${activeSection === 'usuarios' ? 'active' : ''}`}>
                    <a 
                      href="#usuarios" 
                      className="nav-link"
                      onClick={(e) => { e.preventDefault(); setActiveSection('usuarios'); }}
                    >
                      <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M21 6h-6"></path>
                        <path d="M18 3v6"></path>
                      </svg>
                      <span>Gestión Usuarios</span>
                      {users.filter(u => !u.autorizado).length > 0 && (
                        <span className="nav-badge new">{users.filter(u => !u.autorizado).length}</span>
                      )}
                    </a>
                  </li>
                )}

                <li className={`nav-item ${activeSection === 'agentes' ? 'active' : ''}`}>
                  <a 
                    href="#agentes" 
                    className="nav-link"
                    onClick={(e) => { e.preventDefault(); setActiveSection('agentes'); }}
                  >
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Agentes</span>
                    <span className="nav-badge">12</span>
                  </a>
                </li>

                <li className={`nav-item ${activeSection === 'citas' ? 'active' : ''}`}>
                  <a 
                    href="#citas" 
                    className="nav-link"
                    onClick={(e) => { e.preventDefault(); setActiveSection('citas'); }}
                  >
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <path d="m9 16 2 2 4-4"></path>
                    </svg>
                    <span>Citas Médicas</span>
                    <span className="nav-badge new">5</span>
                  </a>
                </li>

                <li className={`nav-item ${activeSection === 'comisiones' ? 'active' : ''}`}>
                  <a 
                    href="#comisiones" 
                    className="nav-link"
                    onClick={(e) => { e.preventDefault(); setActiveSection('comisiones'); }}
                  >
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span>Comisiones</span>
                  </a>
                </li>

                <li className={`nav-item ${activeSection === 'entrenamientos' ? 'active' : ''}`}>
                  <a 
                    href="#entrenamientos" 
                    className="nav-link"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setActiveSection('entrenamientos');
                    }}
                  >
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <span>Entrenamientos</span>
                    <span className="nav-badge new">Nuevo</span>
                  </a>
                </li>
              </ul>

              {/* Secondary Menu */}
              <div className="nav-divider"></div>
              <ul className="nav-list">
                <li className={`nav-item ${activeSection === 'configuracion' ? 'active' : ''}`}>
                  <a 
                    href="#configuracion" 
                    className="nav-link"
                    onClick={(e) => { e.preventDefault(); setActiveSection('configuracion'); }}
                  >
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24M1.54 12h6m6 0h6"></path>
                    </svg>
                    <span>Configuración</span>
                  </a>
                </li>
                <li className={`nav-item ${activeSection === 'ayuda' ? 'active' : ''}`}>
                  <a 
                    href="#ayuda" 
                    className="nav-link"
                    onClick={(e) => { e.preventDefault(); setActiveSection('ayuda'); }}
                  >
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>Ayuda</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Logout Button */}
            <div className="sidebar-footer">
              <button onClick={handleLogout} className="logout-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            {/* Top Header */}
            <header className="top-header">
              <button className="menu-toggle" id="menuToggle" onClick={toggleSidebar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              <div className="header-search">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input type="search" placeholder="Buscar..." className="search-input" />
              </div>

              <div className="header-actions">
                {/* Notifications */}
                <button className="header-btn notifications-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="notification-dot"></span>
                </button>

                {/* User Menu */}
                <div className="user-menu">
                  <button className="user-menu-btn">
                    <div className="user-avatar">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="dashboard-content" id="dashboardContent">
              {/* Sección Inicio */}
              {activeSection === 'inicio' && (
                <>
                  {/* Welcome Section */}
                  <div className="welcome-section">
                    <h1 className="page-title">Bienvenido al Dashboard</h1>
                    <p className="page-subtitle">Aquí puedes gestionar todos los aspectos de tu cuenta</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon agents">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h3 className="stat-title">Total Agentes</h3>
                        <p className="stat-value">124</p>
                        <p className="stat-change positive">+12% este mes</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon appointments">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h3 className="stat-title">Citas Programadas</h3>
                        <p className="stat-value">45</p>
                        <p className="stat-change positive">+8% esta semana</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon commissions">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h3 className="stat-title">Comisiones del Mes</h3>
                        <p className="stat-value">$24,580</p>
                        <p className="stat-change positive">+18% vs mes anterior</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon policies">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h3 className="stat-title">Pólizas Activas</h3>
                        <p className="stat-value">892</p>
                        <p className="stat-change positive">+5% este año</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity & Quick Actions */}
                  <div className="dashboard-grid">
                    {/* Recent Activity */}
                    <div className="dashboard-card">
                      <div className="card-header">
                        <h2 className="card-title">Actividad Reciente</h2>
                        <button className="card-action">Ver todo</button>
                      </div>
                      <div className="card-body">
                        <div className="activity-list">
                          <div className="activity-item">
                            <div className="activity-icon new-agent">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                              </svg>
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">Nuevo agente registrado: <strong>María González</strong></p>
                              <span className="activity-time">Hace 2 horas</span>
                            </div>
                          </div>
                          <div className="activity-item">
                            <div className="activity-icon appointment">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">Cita médica confirmada para <strong>Juan Pérez</strong></p>
                              <span className="activity-time">Hace 4 horas</span>
                            </div>
                          </div>
                          <div className="activity-item">
                            <div className="activity-icon commission">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                              </svg>
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">Comisión procesada: <strong>$1,250</strong></p>
                              <span className="activity-time">Hace 6 horas</span>
                            </div>
                          </div>
                          <div className="activity-item">
                            <div className="activity-icon policy">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">Nueva póliza IUL vendida por <strong>Carlos Rodríguez</strong></p>
                              <span className="activity-time">Hace 1 día</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card">
                      <div className="card-header">
                        <h2 className="card-title">Acciones Rápidas</h2>
                      </div>
                      <div className="card-body">
                        <div className="quick-actions">
                          <button className="quick-action-btn">
                            <svg className="action-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="8.5" cy="7" r="4"></circle>
                              <line x1="20" y1="8" x2="20" y2="14"></line>
                              <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            <span>Agregar Agente</span>
                          </button>
                          <button className="quick-action-btn">
                            <svg className="action-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                              <line x1="12" y1="14" x2="12" y2="18"></line>
                              <line x1="10" y1="16" x2="14" y2="16"></line>
                            </svg>
                            <span>Nueva Cita</span>
                          </button>
                          <button className="quick-action-btn">
                            <svg className="action-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="12" y1="18" x2="12" y2="12"></line>
                              <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                            <span>Crear Póliza</span>
                          </button>
                          <button className="quick-action-btn">
                            <svg className="action-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            <span>Ver Reportes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Sección Gestión de Usuarios - Solo Admin */}
              {activeSection === 'usuarios' && user?.tipoUsuario === 'Administrador' && (
                <>
                  <div className="welcome-section">
                    <h1 className="page-title">Gestión de Usuarios</h1>
                    <p className="page-subtitle">Administra y autoriza usuarios del sistema</p>
                  </div>

                  {/* Filtros */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h2 className="card-title">Usuarios del Sistema</h2>
                      <div className="filter-tabs">
                        <button 
                          className={`filter-tab ${userFilter === 'todos' ? 'active' : ''}`}
                          onClick={() => setUserFilter('todos')}
                        >
                          Todos
                        </button>
                        <button 
                          className={`filter-tab ${userFilter === 'pendientes' ? 'active' : ''}`}
                          onClick={() => setUserFilter('pendientes')}
                        >
                          Pendientes
                        </button>
                        <button 
                          className={`filter-tab ${userFilter === 'autorizados' ? 'active' : ''}`}
                          onClick={() => setUserFilter('autorizados')}
                        >
                          Autorizados
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      {loadingUsers ? (
                        <div className="loading-message">Cargando usuarios...</div>
                      ) : users.length === 0 ? (
                        <div className="empty-message">No hay usuarios {userFilter !== 'todos' ? userFilter : ''}</div>
                      ) : (
                        <div className="users-table-wrapper">
                          <table className="users-table">
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Fecha Registro</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((u) => (
                                <tr key={u.id}>
                                  <td>
                                    <div className="user-name">
                                      <div className="user-avatar-small">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                          <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                      </div>
                                      <span>{u.nombre} {u.apellido}</span>
                                    </div>
                                  </td>
                                  <td>{u.email}</td>
                                  <td>{u.telefono || 'N/A'}</td>
                                  <td>
                                    <span className={`user-type-badge ${u.tipoUsuario.toLowerCase()}`}>
                                      {u.tipoUsuario}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${u.autorizado ? 'authorized' : 'pending'}`}>
                                      {u.autorizado ? 'Autorizado' : 'Pendiente'}
                                    </span>
                                  </td>
                                  <td>{u.fechaCreacion ? new Date(u.fechaCreacion).toLocaleDateString() : 'N/A'}</td>
                                  <td>
                                    {!u.autorizado ? (
                                      <div className="action-buttons">
                                        <button 
                                          className="btn-approve"
                                          onClick={() => handleAuthorize(u.id, true)}
                                          title="Autorizar usuario"
                                        >
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                          </svg>
                                        </button>
                                        <button 
                                          className="btn-reject"
                                          onClick={() => handleAuthorize(u.id, false)}
                                          title="Rechazar usuario"
                                        >
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                          </svg>
                                        </button>
                                      </div>
                                    ) : (
                                      <button 
                                        className="btn-revoke"
                                        onClick={() => handleAuthorize(u.id, false)}
                                        title="Revocar autorización"
                                      >
                                        Revocar
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Sección de Entrenamientos */}
              {activeSection === 'entrenamientos' && (
                <TrainingSection user={user} />
              )}

              {/* Placeholder para otras secciones */}
              {activeSection !== 'inicio' && activeSection !== 'usuarios' && activeSection !== 'entrenamientos' && (
                <div className="welcome-section">
                  <h1 className="page-title">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
                  <p className="page-subtitle">Esta sección está en desarrollo</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .filter-tabs {
          display: flex;
          gap: 0.5rem;
        }
        
        .filter-tab {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-tab.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .users-table-wrapper {
          overflow-x: auto;
        }
        
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .users-table th {
          text-align: left;
          padding: 1rem;
          background: var(--background-light);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .users-table td {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
        }
        
        .user-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .user-avatar-small {
          width: 32px;
          height: 32px;
          background: var(--primary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
        }
        
        .user-type-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .user-type-badge.administrador {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .user-type-badge.asistente {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        
        .user-type-badge.agente {
          background: #e8f5e9;
          color: #388e3c;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-badge.authorized {
          background: #d4f4dd;
          color: #2e7d32;
        }
        
        .status-badge.pending {
          background: #fff3cd;
          color: #f57c00;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-approve, .btn-reject {
          padding: 0.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-approve {
          background: #4caf50;
          color: white;
        }
        
        .btn-approve:hover {
          background: #45a049;
        }
        
        .btn-reject {
          background: #f44336;
          color: white;
        }
        
        .btn-reject:hover {
          background: #da190b;
        }
        
        .btn-revoke {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #f44336;
          color: #f44336;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-revoke:hover {
          background: #f44336;
          color: white;
        }
        
        .loading-message, .empty-message {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        }
      `}</style>
    </>
  );
}