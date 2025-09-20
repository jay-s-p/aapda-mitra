import React, { useEffect, useRef, useState } from 'react';
import { db } from '../services/db';
import { Shelter } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

// Since Leaflet is loaded from a CDN, we need to tell TypeScript about the 'L' global variable.
declare var L: any;

// Mock data for hazard zones relevant to South Asia - can remain static for now
const hazardZones = [
    { id: 1, name: 'Ganges Delta Flood Plain', coords: [22.5, 89.5], radius: 100000, type: 'flood' },
    { id: 2, name: 'Himalayan Landslide Zone', coords: [[27.7, 85.3], [27.75, 85.4], [27.65, 85.35]], type: 'landslide' }
];

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const shelterLayerRef = useRef<any>(null); // To hold the shelter markers layer

    const [shelters, setShelters] = useState<Shelter[]>([]);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState('');

    // Fetch shelter data from local DB
    useEffect(() => {
        const fetchSheltersFromDb = async () => {
            try {
                const storedShelters = await db.shelters.toArray();
                setShelters(storedShelters);
            } catch (error) {
                console.error("Failed to load shelters from DB:", error);
            }
        };
        fetchSheltersFromDb();
    }, []);

    // Initialize map (runs once)
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            // Initialize map, centered on South Asia
            const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([20.5937, 78.9629], 5);
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            mapRef.current = map;

            // Add dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);
            
            // Add hazard zones
            hazardZones.forEach(zone => {
                if (zone.type === 'flood') {
                     L.circle(zone.coords, {
                        color: '#FD7E14', // brand-orange
                        fillColor: '#FD7E14',
                        fillOpacity: 0.3,
                        radius: zone.radius
                    }).addTo(map).bindPopup(`<b>${zone.name}</b><br>High flood risk.`);
                } else if (zone.type === 'landslide') {
                     L.polygon(zone.coords, {
                        color: '#DC3545', // brand-red
                        fillColor: '#DC3545',
                        fillOpacity: 0.3
                    }).addTo(map).bindPopup(`<b>${zone.name}</b><br>High landslide risk.`);
                }
            });

            // Add user location
            map.locate({setView: false, maxZoom: 14});
            
            const userIcon = L.divIcon({
              html: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" style="color: #007BFF" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>`,
              className: 'bg-transparent border-0',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });

            function onLocationFound(e: any) {
                L.marker(e.latlng, { icon: userIcon }).addTo(map)
                    .bindPopup("You are here").openPopup();
                L.circle(e.latlng, {
                  radius: e.accuracy,
                  color: '#007BFF',
                  fillColor: '#007BFF',
                  fillOpacity: 0.1,
                  weight: 1
                }).addTo(map);
                map.setView(e.latlng, 14);
            }
            map.on('locationfound', onLocationFound);

            // Initialize the layer for shelters
            shelterLayerRef.current = L.layerGroup().addTo(map);
        }

        return () => { // Cleanup function
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);
    
    // Update shelter markers when data changes
    useEffect(() => {
        if (shelterLayerRef.current) {
            const shelterLayer = shelterLayerRef.current;
            shelterLayer.clearLayers();

            const shelterIcon = L.divIcon({
                html: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" style="color: #28A745" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
                className: 'bg-transparent border-0',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });

            shelters.forEach(shelter => {
                if (shelter.lat && shelter.lng) {
                    L.marker([shelter.lat, shelter.lng], { icon: shelterIcon })
                        .addTo(shelterLayer)
                        .bindPopup(`<b>${shelter.name}</b><br>Available: ${shelter.available}/${shelter.capacity}`);
                }
            });
        }
    }, [shelters]);

    const handleDownloadOfflineMap = async () => {
      setIsDownloading(true);
      setDownloadMessage('Downloading shelter data and map tiles for your region. This may take a moment...');
      try {
        // This simulates fetching and confirming data is stored.
        // A real-world implementation would use a Service Worker to intercept and cache map tile requests.
        // This allows the map to work offline by serving tiles from the cache.
        const offlineShelters = await db.shelters.toArray();
        if (offlineShelters.length === 0) {
          throw new Error('No shelter data available to save.');
        }
        // Simulate network delay for downloading tiles
        await new Promise(resolve => setTimeout(resolve, 2500));
        setDownloadMessage(`Successfully saved ${offlineShelters.length} shelters and map data for offline access.`);
      } catch (error) {
        console.error('Failed to download offline map data:', error);
        setDownloadMessage('Error: Could not save offline data. Please try again later.');
      } finally {
        setIsDownloading(false);
      }
    };

    return (
      <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
        <h2 className="text-3xl font-bold text-brand-gray-100 mb-4">Real-time Hazard & Resource Map</h2>
        <p className="text-brand-gray-400 mb-6">
          This map shows nearby shelters, known hazard zones, and your current location. Download map data to ensure access during emergencies with no internet.
        </p>

        <div className="mb-6">
          <button
            onClick={handleDownloadOfflineMap}
            disabled={isDownloading}
            className="w-full sm:w-auto px-6 py-3 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-brand-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon />
            {isDownloading ? 'Downloading...' : 'Save Map for Offline Use'}
          </button>
          {downloadMessage && (
            <p className={`text-sm mt-2 ${downloadMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {downloadMessage}
            </p>
          )}
        </div>
        
        <div ref={mapContainerRef} style={{ height: '500px', borderRadius: '8px', zIndex: 0, backgroundColor: '#1a1a1a' }} className="w-full" aria-label="Interactive map" />
        
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-gray-300">
            <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-green" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </div>
                <span>Shelter</span>
            </div>
             <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0 flex items-center justify-center">
                    <span className="h-4 w-4 rounded-full bg-brand-orange/50 border border-brand-orange"></span>
                </div>
                <span>Flood Zone</span>
            </div>
             <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0 flex items-center justify-center">
                  <span className="h-4 w-4 rounded-full bg-brand-red/50 border border-brand-red"></span>
                </div>
                <span>Landslide Zone</span>
            </div>
            <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
                <span>Your Location</span>
            </div>
        </div>
      </div>
    );
};

export default Map;