
import React, { useState, useEffect, useCallback, Fragment } from 'react';
// FIX: Changed to namespace import to resolve "no exported member" errors from react-router-dom.
import * as rr from 'react-router-dom';
const { HashRouter, Routes, Route, Outlet, Navigate, useLocation } = rr;
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Forms from './components/Forms';
import Library from './components/Library';
import Indicators from './components/Indicators';
import Reports from './components/Reports';
import type { User } from './types';
import { NAV_ITEMS } from './constants';
import { Bars3Icon, BellIcon, ChevronDownIcon, UserCircleIcon, XMarkIcon, SunIcon, MoonIcon } from './constants';
import { VALID_USERS } from './users';
import { ThemeProvider, useTheme } from './components/ThemeContext';


const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};


const useResponsiveSidebar = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const currentIsDesktop = window.innerWidth >= 1024;
      if (currentIsDesktop !== isDesktop) {
        setIsDesktop(currentIsDesktop);
        if (currentIsDesktop) {
            setMobileSidebarOpen(false); // Close mobile sidebar when switching to desktop
        } else {
            setSidebarCollapsed(false); // Un-collapse sidebar for tablet/mobile view
        }
      }
    };

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isDesktop]);

  const toggleSidebar = useCallback(() => {
    if (isDesktop) {
      setSidebarCollapsed(prev => !prev);
    } else {
      setMobileSidebarOpen(prev => !prev);
    }
  }, [isDesktop]);
  
  const closeMobileSidebar = useCallback(() => {
    if(!isDesktop) {
      setMobileSidebarOpen(false);
    }
  }, [isDesktop]);

  return { isDesktop, isSidebarCollapsed, isMobileSidebarOpen, toggleSidebar, closeMobileSidebar };
};


const Header: React.FC<{ user: User; onLogout: () => void; onToggleSidebar: () => void }> = ({ user, onLogout, onToggleSidebar }) => {
    const location = useLocation();
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);

    const getPageTitle = () => {
        for (const item of NAV_ITEMS) {
            if (item.path === location.pathname) return item.label;
            if (item.children) {
                for (const child of item.children) {
                    if (location.pathname.startsWith(child.path)) return child.label;
                }
            }
        }
        return 'Dashboard';
    };

    return (
        <header className="bg-white dark:bg-slate-800 shadow-sm dark:shadow-none dark:border-b dark:border-slate-700 p-4 flex justify-between items-center z-40 transition-colors">
            <div className="flex items-center">
                <button onClick={onToggleSidebar} className="text-slate-600 dark:text-slate-300 hover:text-sky-700 lg:hidden mr-4">
                    <Bars3Icon />
                </button>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
                 <ThemeToggleButton />
                 <button className="text-slate-500 dark:text-slate-400 hover:text-sky-700 relative">
                    <BellIcon />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                    <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2">
                        <UserCircleIcon />
                        <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-300">{user.username}</span>
                        <ChevronDownIcon className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50">
                            <div className="px-4 py-2 border-b dark:border-slate-600">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.username}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                            </div>
                            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


const MainLayout: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const { isDesktop, isSidebarCollapsed, isMobileSidebarOpen, toggleSidebar, closeMobileSidebar } = useResponsiveSidebar();

    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-900`}>
            <Sidebar 
              onLogout={onLogout} 
              isCollapsed={isDesktop && isSidebarCollapsed}
              isMobileOpen={!isDesktop && isMobileSidebarOpen}
              onMobileNavigate={closeMobileSidebar}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isDesktop ? (isSidebarCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[250px]') : ''}`}>
                <Header user={user} onLogout={onLogout} onToggleSidebar={toggleSidebar} />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                      <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

function AppInternal() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(VALID_USERS);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  const handleRegisterUser = (newUser: Pick<User, 'username' | 'email' | 'password'>): User | null => {
      if (users.some(u => u.email === newUser.email)) {
          return null; // Email already exists
      }
      const userToRegister: User = {
          ...newUser,
          id: String(Date.now()), // Use a more unique ID
          role: 'Quality Inspector', // Assign a default role
      };
      setUsers(prevUsers => [...prevUsers, userToRegister]);
      return userToRegister; // Registration successful, return new user
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegisterUser} users={users} />;
  }
  
  return (
    <HashRouter>
        <Routes>
            <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard user={user}/>} />
                <Route path="quality/forms" element={<Forms />} />
                <Route path="quality/library" element={<Library />} />
                <Route path="quality/indicators" element={<Indicators />} />
                <Route path="reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    </HashRouter>
  );
}

function App() {
    return (
        <ThemeProvider>
            <AppInternal />
        </ThemeProvider>
    );
}

export default App;