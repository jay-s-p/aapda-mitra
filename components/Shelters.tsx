import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Shelter } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { MapPinIcon } from './icons/MapPinIcon';

const Shelters: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      setIsLoading(true);
      try {
        const storedShelters = await db.shelters.toArray();
        setShelters(storedShelters);
      } catch (error) {
        console.error("Failed to load shelters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShelters();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700 text-center">
        <h2 className="text-3xl font-bold text-brand-gray-100 mb-6 flex items-center justify-center gap-3">
          <HomeIcon />
          Nearby Shelters
        </h2>
        <p className="text-brand-gray-300">Loading shelter information...</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
      <h2 className="text-3xl font-bold text-brand-gray-100 mb-6 flex items-center gap-3">
        <HomeIcon />
        Nearby Shelters
      </h2>
      
      {shelters.length > 0 ? (
        <div className="space-y-4">
          {shelters.map(shelter => (
            <div key={shelter.id} className="p-4 border border-brand-gray-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-gray-900/50">
              <div>
                <h3 className="font-bold text-lg text-brand-blue">{shelter.name}</h3>
                <p className="text-sm text-brand-gray-400 flex items-center gap-1"><MapPinIcon /> {shelter.location} - <span className="font-medium">{shelter.distance} away</span></p>
              </div>
              <div className="text-center bg-brand-green/20 text-green-300 p-3 rounded-lg">
                  <p className="text-sm font-bold">Availability</p>
                  <p className="text-2xl font-extrabold">{shelter.available}</p>
                  <p className="text-xs">/ {shelter.capacity} spots</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-brand-gray-400 text-center py-4">No shelter information is available locally. Please connect to the internet to sync data.</p>
      )}
    </div>
  );
};

export default Shelters;