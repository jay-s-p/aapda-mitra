
import React from 'react';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';

const NotFound: React.FC = () => {
  // FIX: Populating NotFound component to be used for invalid routes.
  return (
    <div className="flex flex-col items-center justify-center text-center bg-brand-gray-800 p-8 rounded-xl shadow-lg border border-brand-gray-700 h-full">
      <div className="w-16 h-16 text-brand-blue">
        <QuestionMarkCircleIcon />
      </div>
      <h2 className="mt-4 text-3xl font-bold text-brand-gray-100">Page Not Found</h2>
      <p className="mt-2 text-brand-gray-400">
        Sorry, the page you are looking for does not exist. You can use the menu to navigate to other sections.
      </p>
    </div>
  );
};

export default NotFound;
