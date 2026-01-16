import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Travel from './pages/Travel';
import Pantry from './pages/Pantry';
import Profile from './pages/Profile';
import MapView from './pages/Map';
import { UserTier, ProductAnalysis, PantryItem, ScanStatus } from './types';
import { Wifi, WifiOff } from 'lucide-react';

// Real-world initial data for first-time users
const INITIAL_PANTRY_DATA: PantryItem[] = [
    { id: '1', name: 'Nutella Hazelnut Spread', status: ScanStatus.HALAL, addedBy: 'You', date: 'Today, 9:00 AM', expiryDate: '2025-08-15' },
    { id: '2', name: 'Haribo Goldbears (German)', status: ScanStatus.HARAM, addedBy: 'Ahmed', date: 'Yesterday', expiryDate: '2024-12-01' },
    { id: '3', name: 'Lay\'s Classic Chips', status: ScanStatus.HALAL, addedBy: 'You', date: 'Yesterday', expiryDate: '2024-03-10' }, // Expiring soon
    { id: '4', name: 'Kikkoman Soy Sauce', status: ScanStatus.DOUBTFUL, addedBy: 'Sarah', date: '2 days ago', expiryDate: '2026-01-01' },
    { id: '5', name: 'Oreo Cookies', status: ScanStatus.HALAL, addedBy: 'Mom', date: '3 days ago', expiryDate: '2025-05-20' },
    { id: '6', name: 'Parmesan Cheese Block', status: ScanStatus.HARAM, addedBy: 'Dad', date: 'Last week', expiryDate: '2024-03-15' }, // Expiring soon
    { id: '7', name: 'Greek Yogurt (Plain)', status: ScanStatus.HALAL, addedBy: 'You', date: 'Last week', expiryDate: '2024-03-05' }, // Expiring very soon
    { id: '8', name: 'Marshmallows (Generic)', status: ScanStatus.DOUBTFUL, addedBy: 'Sarah', date: '2 weeks ago', expiryDate: '2025-02-14' },
    { id: '9', name: 'Samyang Buldak Noodles', status: ScanStatus.HALAL, addedBy: 'You', date: '2 weeks ago', expiryDate: '2025-11-30' },
    { id: '10', name: 'Rice Krispies Treats', status: ScanStatus.HARAM, addedBy: 'Mom', date: '3 weeks ago', expiryDate: '2024-09-10' },
];

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNetworkToast, setShowNetworkToast] = useState(false);
  
  // Persistent State: User Tier
  const [userTier, setUserTier] = useState<UserTier>(() => {
    const saved = localStorage.getItem('hs_tier');
    return (saved as UserTier) || UserTier.FREE;
  });

  // Persistent State: Scans Left
  const [scansLeft, setScansLeft] = useState(() => {
    const saved = localStorage.getItem('hs_scans');
    return saved ? parseInt(saved, 10) : 10;
  });
  
  // Persistent State: Pantry History
  const [history, setHistory] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('hs_pantry');
    return saved ? JSON.parse(saved) : INITIAL_PANTRY_DATA;
  });

  // Global Kids Mode State
  const [kidsMode, setKidsMode] = useState(false);

  // Network Status Effect
  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        setShowNetworkToast(true);
        setTimeout(() => setShowNetworkToast(false), 3000);
    };
    const handleOffline = () => {
        setIsOnline(false);
        setShowNetworkToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Effects to save state changes
  useEffect(() => {
    localStorage.setItem('hs_tier', userTier);
  }, [userTier]);

  useEffect(() => {
    localStorage.setItem('hs_scans', scansLeft.toString());
  }, [scansLeft]);

  useEffect(() => {
    localStorage.setItem('hs_pantry', JSON.stringify(history));
  }, [history]);

  const handleScanComplete = (item: ProductAnalysis) => {
    // Default expiry 6 months from now for demo
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    
    const newItem: PantryItem = {
        id: Date.now().toString(),
        name: item.productName || "Unknown Product",
        status: item.status,
        addedBy: 'You',
        date: 'Just now',
        expiryDate: futureDate.toISOString().split('T')[0]
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleRemoveItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const decrementScan = () => {
    if (userTier === UserTier.FREE) {
      setScansLeft(prev => Math.max(0, prev - 1));
    }
  };

  const handleUpgrade = () => {
    setUserTier(UserTier.PREMIUM);
    alert("Welcome to Premium! Unlimited scans activated.");
  };

  const handleLocationSelect = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setCurrentTab('map');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home userTier={userTier} scansLeft={scansLeft} onScanClick={() => setCurrentTab('scan')} onLocationSelect={handleLocationSelect} />;
      case 'scan':
        return <Scan onScanComplete={handleScanComplete} scansLeft={scansLeft} decrementScan={decrementScan} kidsMode={kidsMode} />;
      case 'travel':
        return <Travel />;
      case 'pantry':
        return <Pantry history={history} onRemoveItem={handleRemoveItem} />;
      case 'profile':
        return <Profile userTier={userTier} onUpgrade={handleUpgrade} scansLeft={scansLeft} kidsMode={kidsMode} toggleKidsMode={() => setKidsMode(!kidsMode)} />;
      case 'map':
        return <MapView onBack={() => setCurrentTab('home')} restaurant={selectedRestaurant} />;
      default:
        return <Home userTier={userTier} scansLeft={scansLeft} onScanClick={() => setCurrentTab('scan')} onLocationSelect={handleLocationSelect} />;
    }
  };

  return (
    // Removed max-w-md and mx-auto to ensure full width "native" feel on Android devices
    <div className={`h-full w-full bg-white overflow-hidden relative ${kidsMode ? 'font-comic-sans' : ''}`}>
      
      {/* Network Toaster */}
      <div className={`absolute top-safe left-0 right-0 flex justify-center z-[100] transition-all duration-300 ${showNetworkToast ? 'translate-y-2 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-white ${isOnline ? 'bg-emerald-500' : 'bg-gray-800'}`}>
              {isOnline ? <Wifi size={14}/> : <WifiOff size={14}/>}
              {isOnline ? 'Back Online' : 'You are offline'}
          </div>
      </div>

      <main className="h-full overflow-hidden">
        {renderContent()}
      </main>
      {/* Hide navigation bar when in Map View to show full screen map */}
      {currentTab !== 'map' && <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />}
    </div>
  );
};

export default App;