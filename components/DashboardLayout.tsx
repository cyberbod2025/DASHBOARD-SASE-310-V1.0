
import React from 'react';
import Sidebar from './Sidebar';
import { User } from '../types';
import { MOCK_USERS } from '../constants';
import { AtemiMXLogo } from './icons/AtemiMXLogo';

interface DashboardLayoutProps {
  currentUser: User;
  currentView: string;
  onUserChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onViewChange: (view: string) => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  currentView,
  onUserChange,
  onViewChange,
  children,
}) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar
        currentUser={currentUser}
        currentView={currentView}
        onViewChange={onViewChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
             <AtemiMXLogo className="h-8 w-auto mr-4"/>
             <h1 className="text-xl font-semibold">SASE-310 Dashboard</h1>
          </div>
          <div>
            <label htmlFor="user-select" className="sr-only">Change User</label>
            <select
              id="user-select"
              value={currentUser.id}
              onChange={onUserChange}
              className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2"
            >
              {MOCK_USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
