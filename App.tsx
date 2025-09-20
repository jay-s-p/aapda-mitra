// FIX: Implement the main App component, which was previously missing.
// This component manages application state, routing, and renders different pages based on user authentication and navigation.
import React, { useState, useCallback, useEffect } from 'react';
import { Page, Alert, Shelter } from './types';
import { db } from './services/db';

// Components
import Auth from './components/Auth';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SurvivalGuide from './components/SurvivalGuide';
import Alerts from './components/Alerts';
import Shelters from './components/Shelters';
import VolunteerPortal from './components/VolunteerPortal';
import EmergencyContacts from './components/EmergencyContacts';
import Map from './components/Map';
import ReportIncident from './components/ReportIncident';
import Profile from './components/Profile';
import MeshNetwork from './components/MeshNetwork';
import NotFound from './components/NotFound';
import Chatbot from './components/Chatbot';

// Icons
import { ChatBubbleIcon } from './components/icons/ChatBubbleIcon';
import { CloseIcon } from './components/icons/CloseIcon';

const initialAlerts: Alert[] = [
  { id: 1, type: 'Flood Warning', area: 'Guwahati, Assam', severity: 'High', message: 'River Brahmaputra is flowing above the danger level. People in low-lying areas are advised to move to safer places.', time: '2 hours ago' },
  { id: 2, type: 'Cyclone Alert', area: 'Coastal Odisha', severity: 'Medium', message: 'A cyclone is expected to make landfall in the next 48 hours. Fishermen are advised not to venture into the sea.', time: '8 hours ago' },
  { id: 3, type: 'Heatwave', area: 'Jaipur, Rajasthan', severity: 'Low', message: 'Temperatures are expected to rise above 45°C. Stay hydrated and avoid outdoor activities during peak hours.', time: '1 day ago' },
];

const initialShelters: Shelter[] = [
  { id: 1, name: 'Govt. High School Relief Camp', location: 'Bhubaneswar', distance: '2.5 km', capacity: 250, available: 80, lat: 20.2961, lng: 85.8245 },
  { id: 2, name: 'Community Hall, Sector 12', location: 'Guwahati', distance: '4.1 km', capacity: 150, available: 25, lat: 26.1445, lng: 91.7362 },
  { id: 3, name: 'Red Cross Shelter', location: 'Dehradun', distance: '5.8 km', capacity: 100, available: 90, lat: 30.3165, lng: 78.0322 },
  { id: 4, name: 'City Stadium', location: 'Jaipur', distance: '10.2 km', capacity: 1000, available: 450, lat: 26.9124, lng: 75.7873 },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  useEffect(() => {
    const loadAndSeedData = async () => {
      try {
        // Load/Seed alerts
        const alertCount = await db.alerts.count();
        if (alertCount === 0) {
          await db.alerts.bulkPut(initialAlerts);
          setAlerts(initialAlerts);
        } else {
          const storedAlerts = await db.alerts.orderBy('id').reverse().toArray();
          setAlerts(storedAlerts);
        }

        // Seed shelters if DB is empty
        const shelterCount = await db.shelters.count();
        if (shelterCount === 0) {
          await db.shelters.bulkPut(initialShelters);
        }
      } catch (error) {
        console.error("Failed to load or seed offline data:", error);
      }
    };

    loadAndSeedData();
  }, []);

  const handleLogin = (isNewUser: boolean) => {
    setIsAuthenticated(true);
    if (isNewUser) {
      setCurrentPage('profile');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  }, []);

  const handleAddAlert = async (newAlertData: Omit<Alert, 'id' | 'time'>) => {
    // Create an alert object without an ID. Dexie will auto-generate it.
    const alertData: Omit<Alert, 'id'> = {
      ...newAlertData,
      time: 'Just now',
    };
    
    try {
        // `add` returns the new ID.
        const newId = await db.alerts.add(alertData as Alert); 
        // Create the full alert object to update the state.
        const newAlert: Alert = { ...alertData, id: newId };
        setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
        navigate('alerts');
        alert("Incident reported successfully! It will now appear in the alerts feed.");
    } catch (error) {
        console.error("Failed to save alert:", error);
        alert("There was an error reporting the incident. Please try again.");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard navigate={navigate} />;
      case 'guide': return <SurvivalGuide />;
      case 'alerts': return <Alerts alerts={alerts} />;
      case 'shelters': return <Shelters />;
      case 'volunteer': return <VolunteerPortal />;
      case 'contacts': return <EmergencyContacts />;
      case 'map': return <Map />;
      case 'report': return <ReportIncident onAddAlert={handleAddAlert} />;
      case 'profile': return <Profile onLogout={handleLogout} />;
      case 'mesh': return <MeshNetwork />;
      default: return <NotFound />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-gray-900 text-brand-gray-100 font-sans flex items-center justify-center p-4">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-900 text-brand-gray-100 font-sans">
      <Header onMenuClick={() => setIsSidebarOpen(true)} navigate={navigate} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} navigate={navigate} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
      
      {/* Chatbot Floating UI */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatbotOpen && (
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsChatbotOpen(false)}></div>
        )}
        <div className={`transition-all duration-300 ease-in-out ${isChatbotOpen ? 'w-[calc(100%-3rem)] max-w-md h-[calc(100%-3rem)] max-h-[600px] ' : 'w-16 h-16'}`}>
          <div className="h-full w-full relative">
            {isChatbotOpen ? (
              <>
                <Chatbot />
                <button 
                  onClick={() => setIsChatbotOpen(false)} 
                  className="absolute top-0 right-0 -mt-3 -mr-3 bg-brand-gray-700 text-white rounded-full p-1.5 hover:bg-brand-gray-600 z-10 shadow-lg"
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsChatbotOpen(true)}
                className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transform hover:scale-110 transition-transform"
                aria-label="Open AI assistant"
              >
                <ChatBubbleIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;