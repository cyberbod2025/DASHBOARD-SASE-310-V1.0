
import React from 'react';
import { User, UserRole } from '../types';
import { HomeIcon, InboxIcon, UserCircleIcon, ChatBubbleLeftRightIcon, ChartBarIcon, PowerIcon } from './icons/SolidIcons';

interface SidebarProps {
  currentUser: User;
  currentView: string;
  onViewChange: (view: string) => void;
}

const NavLink: React.FC<{
    viewName: string;
    currentView: string;
    onClick: (view: string) => void;
    icon: React.ReactNode;
    label: string;
}> = ({ viewName, currentView, onClick, icon, label }) => {
    const isActive = currentView === viewName;
    return (
        <button
            onClick={() => onClick(viewName)}
            className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentView, onViewChange }) => {
  const getNavItems = () => {
    const commonItems = [
      { view: 'live-assistant', label: 'Asistente IA', icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> }
    ];

    switch (currentUser.role) {
      case UserRole.Teacher:
        return [
          { view: 'teacher-dashboard', label: 'Mi Panel', icon: <HomeIcon className="h-5 w-5" /> },
          ...commonItems
        ];
      case UserRole.Guidance:
        return [
          { view: 'guidance-inbox', label: 'Bandeja de Entrada', icon: <InboxIcon className="h-5 w-5" /> },
          ...commonItems
        ];
      case UserRole.Director:
      case UserRole.Coordination:
        return [
          { view: 'admin-dashboard', label: 'Dashboard Admin', icon: <ChartBarIcon className="h-5 w-5" /> },
          { view: 'guidance-inbox', label: 'Bandeja Orientación', icon: <InboxIcon className="h-5 w-5" /> },
          ...commonItems
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">SASE-310</span>
      </div>
      <div className="flex-1 p-4">
        <nav className="space-y-2">
            {navItems.map(item => (
                <NavLink
                    key={item.view}
                    viewName={item.view}
                    currentView={currentView}
                    onClick={onViewChange}
                    icon={item.icon}
                    label={item.label}
                />
            ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
            <UserCircleIcon className="h-10 w-10 text-gray-500" />
            <div className="ml-3">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
            </div>
        </div>
        <button className="flex items-center w-full mt-4 px-4 py-3 text-left text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <PowerIcon className="h-5 w-5" />
            <span className="ml-3">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
