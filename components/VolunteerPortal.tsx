import React from 'react';
import { UsersIcon } from './icons/UsersIcon';

const tasksData = [
  { id: 1, title: 'Distribute Food Packets', location: 'Relief Camp A', priority: 'High', status: 'Open' },
  { id: 2, title: 'Assist in First Aid Station', location: 'Community Hall', priority: 'High', status: 'Open' },
  { id: 3, title: 'Clear Debris from Main Road', location: 'NH-16', priority: 'Medium', status: 'In Progress' },
  { id: 4, title: 'Transport Supplies', location: 'Warehouse to Shelter B', priority: 'Low', status: 'Open' },
];

const priorityClasses = {
  High: 'bg-red-900/50 text-red-300',
  Medium: 'bg-yellow-900/50 text-yellow-300',
  Low: 'bg-blue-900/50 text-blue-300',
};

const VolunteerPortal: React.FC = () => {
  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
      <h2 className="text-3xl font-bold text-brand-gray-100 mb-6 flex items-center gap-3">
        <UsersIcon />
        Volunteer Tasks
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-gray-700">
          <thead className="bg-brand-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-brand-gray-800 divide-y divide-brand-gray-700">
            {tasksData.map(task => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-gray-100">{task.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-400">{task.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[task.priority as keyof typeof priorityClasses]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-brand-blue hover:text-blue-500 disabled:text-brand-gray-500" disabled={task.status !== 'Open'}>
                    {task.status === 'Open' ? 'Accept Task' : task.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerPortal;