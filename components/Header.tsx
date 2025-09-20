import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { UserProfileIcon } from './icons/UserProfileIcon';
import { Page } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { NotificationIcon } from './icons/NotificationIcon';

interface HeaderProps {
  onMenuClick: () => void;
  navigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, navigate }) => {
  return (
    <header className="bg-brand-gray-800 shadow-md sticky top-0 z-40 border-b border-brand-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <button onClick={onMenuClick} className="p-2 rounded-md text-brand-gray-300 hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue" aria-label="Open navigation menu">
              <MenuIcon />
            </button>
            <div onClick={() => navigate('dashboard')} className="flex items-center space-x-3 cursor-pointer">
              <LogoIcon className="h-10 w-10 text-brand-blue" />
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-gray-100">Aapda Mitra</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button 
                onClick={() => navigate('alerts')}
                className="p-2 rounded-full text-brand-gray-300 hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-800 focus:ring-brand-blue" 
                aria-label="View alerts"
              >
                <NotificationIcon />
              </button>
             <button 
                onClick={() => navigate('profile')}
                className="p-2 rounded-full text-brand-gray-300 hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-800 focus:ring-brand-blue" 
                aria-label="User profile"
              >
                <UserProfileIcon />
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;