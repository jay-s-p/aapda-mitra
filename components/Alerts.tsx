import React from 'react';
import { AlertIcon } from './icons/AlertIcon';
import { Alert } from '../types';
import { UserIcon } from './icons/UserIcon';

interface AlertsProps {
  alerts: Alert[];
}

const severityClasses = {
  High: 'bg-red-900/40 text-red-200 border-red-500',
  Medium: 'bg-yellow-900/40 text-yellow-200 border-yellow-500',
  Low: 'bg-blue-900/40 text-blue-200 border-blue-500',
};

const Alerts: React.FC<AlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
      <h2 className="text-3xl font-bold text-brand-gray-100 mb-6 flex items-center gap-3">
        <AlertIcon />
        Real-time Alerts
      </h2>
      <div className="space-y-4">
        {alerts.map(alert => {
            const isUserReport = alert.type === 'User Report';
            const alertStyle = isUserReport 
                ? 'bg-orange-900/40 text-orange-200 border-orange-500' 
                : severityClasses[alert.severity as keyof typeof severityClasses];

          return (
            <div key={alert.id} className={`p-4 border-l-4 rounded-r-lg ${alertStyle}`}>
              <div className="flex justify-between items-start mb-1">
                <div className='flex-grow'>
                    <h3 className="font-bold">{alert.type} - {alert.area}</h3>
                </div>
                <div className='flex-shrink-0 text-right ml-2'>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${alertStyle} border ${isUserReport ? 'border-orange-500' : `border-${alert.severity.toLowerCase()}-500`}`}>
                        {isUserReport ? <span className='flex items-center gap-1.5'><UserIcon /> User Report</span> : `${alert.severity} Severity`}
                    </span>
                    <span className="block text-xs text-brand-gray-400 mt-1">{alert.time}</span>
                </div>
              </div>
              <p className="text-sm mt-2">{alert.message}</p>
              {alert.image && (
                <div className="mt-4">
                  <img src={alert.image} alt="User submitted report" className="rounded-lg max-h-64 w-full object-cover" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Alerts;