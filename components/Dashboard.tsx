import React from 'react';
import { Page } from '../types';
import { SosButton } from './SosButton';
import { PhoneIcon } from './icons/PhoneIcon';
import { CameraIcon } from './icons/CameraIcon';

interface DashboardProps {
  navigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h2 className="text-3xl font-bold text-brand-gray-200 mt-4">
            Welcome to <span className="text-brand-blue">Aapda Mitra</span>
        </h2>
      
      <div className="w-full max-w-md p-4">
        <SosButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={() => navigate('report')}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-orange/20 border-2 border-brand-orange text-brand-orange font-bold rounded-xl shadow-md hover:bg-brand-orange/30 transition-all"
        >
          <CameraIcon />
          Report an Incident
        </button>
        <button
          onClick={() => navigate('contacts')}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-gray-800 border-2 border-brand-gray-700 text-brand-gray-200 font-bold rounded-xl shadow-md hover:bg-brand-gray-700 hover:border-brand-gray-600 transition-all"
        >
          <PhoneIcon />
          Emergency Contacts
        </button>
      </div>
    </div>
  );
};

export default Dashboard;