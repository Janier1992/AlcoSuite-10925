
import React, { useState } from 'react';
// FIX: Changed to namespace import to resolve "no exported member" errors from react-router-dom.
import * as rr from 'react-router-dom';
const { NavLink, useLocation } = rr;
import type { User, NavItem } from '../types';
import { NAV_ITEMS, SignOutIcon, ChevronDownIcon } from '../constants';

interface SidebarProps {
    onLogout: () => void;
    isCollapsed: boolean;
    isMobileOpen: boolean;
    onMobileNavigate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isCollapsed, isMobileOpen, onMobileNavigate }) => {
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
        const parent = NAV_ITEMS.find(item => item.children?.some(child => location.pathname.startsWith(child.path)));
        return parent ? parent.id : null;
    });

    const handleSubmenuToggle = (id: string) => {
        setOpenSubmenu(prev => (prev === id ? null : id));
    };

    const renderNavLinks = (items: NavItem[]) => {
        return items.map(item => {
            if (item.children) {
                const isParentActive = item.children.some(child => location.pathname.startsWith(child.path));
                return (
                    <li key={item.id} className={`overflow-hidden`}>
                        <button
                            onClick={() => handleSubmenuToggle(item.id)}
                            className={`flex items-center w-full text-left p-3 transition-colors duration-200 text-slate-200 rounded-md mx-2 my-1 hover:bg-slate-700 hover:text-white ${isParentActive && !isCollapsed ? 'bg-slate-700' : ''} ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                        >
                            <div className="flex items-center">
                                <item.icon />
                                {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                            </div>
                            {!isCollapsed && <ChevronDownIcon className={`${openSubmenu === item.id ? 'rotate-180' : ''}`} />}
                        </button>
                        <ul className={`bg-slate-900/50 dark:bg-black/20 transition-all duration-300 ease-in-out ${openSubmenu === item.id && !isCollapsed ? 'max-h-96' : 'max-h-0'}`}>
                            {renderNavLinks(item.children)}
                        </ul>
                    </li>
                );
            }
            return (
                <li key={item.id} title={isCollapsed ? item.label : undefined} className="px-2">
                    <NavLink
                        to={item.path}
                        onClick={onMobileNavigate}
                        className={({ isActive }) =>
                            `flex items-center p-3 my-1 transition-colors duration-200 text-slate-200 rounded-md hover:bg-slate-700 hover:text-white ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-sky-700 dark:bg-sky-600 text-white shadow-inner' : ''}`
                        }
                    >
                        <item.icon />
                        {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                    </NavLink>
                </li>
            );
        });
    };

    const sidebarClasses = `
        bg-slate-800 dark:bg-slate-900 text-white flex flex-col fixed lg:relative z-[1000] h-full
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}
        ${isMobileOpen ? 'left-0 shadow-2xl' : '-left-[250px]'}
        lg:left-0 lg:shadow-none
    `;

    return (
        <aside className={sidebarClasses}>
            <div className={`flex items-center border-b border-slate-700 dark:border-slate-800 p-4 transition-all duration-300 h-[73px] ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="https://raw.githubusercontent.com/Janier1992/pruebaalco2/main/img/LOGO.png.jpg" alt="Alco Logo" className="h-8 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3 text-xl font-bold whitespace-nowrap">Alco Suite</span>}
            </div>

            <nav className="flex-grow overflow-y-auto overflow-x-hidden py-2">
                <ul>{renderNavLinks(NAV_ITEMS)}</ul>
            </nav>

            <div className="p-2 border-t border-slate-700 dark:border-slate-800">
                <button
                    onClick={onLogout}
                    className={`flex items-center w-full p-3 rounded-md text-slate-200 hover:bg-red-600 hover:text-white transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? 'Cerrar Sesión' : undefined}
                >
                    <SignOutIcon />
                    {!isCollapsed && <span className="ml-3 font-medium">Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;