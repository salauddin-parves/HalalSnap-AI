import React, { useState, useEffect, useRef } from 'react';
import { 
    ArrowLeft, Star, MapPin, Search, Filter, 
    Download, Camera, Plus, Check, X as XIcon, ChevronUp, Layers, Navigation, Globe
} from 'lucide-react';
import { Place, PlaceType } from '../types';

declare var google: any;

interface MapProps {
  onBack: () => void;
  restaurant: any;
}

// Fallback data for when API is missing
const MOCK_PLACES: Place[] = [
    {
        id: '1',
        name: "Al-Barakah Restaurant",
        type: 'RESTAURANT',
        subtype: 'Middle Eastern',
        distance: "1.2 km",
        rating: 4.7,
        reviews: 234,
        address: "123 Spice Route, Downtown",
        lat: 45,
        lng: 50,
        isOpen: true,
        priceRange: "$$$",
        certification: "100% Halal Certified (JAKIM)"
    },
    {
        id: '2',
        name: "Halal Mart Express",
        type: 'STORE',
        subtype: 'Grocery',
        distance: "800m",
        rating: 4.5,
        reviews: 89,
        address: "45 Green Lane",
        lat: 60,
        lng: 30,
        isOpen: true,
        promotion: "Dates 20% off today only!"
    },
    {
        id: '3',
        name: "Masjid Al-Noor",
        type: 'MOSQUE',
        subtype: 'Mosque',
        distance: "2.1 km",
        rating: 5.0,
        reviews: 450,
        address: "1 Prayer Road",
        lat: 30,
        lng: 70,
        isOpen: true
    }
];

const MapView: React.FC<MapProps> = ({ onBack, restaurant }) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | PlaceType>('ALL');
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 1. Check if Google Maps API is loaded
  useEffect(() => {
    // Check if global google object exists
    if ((window as any).google && (window as any).google.maps) {
        setIsApiLoaded(true);
        initRealMap();
    } else {
        // Listen for the callback
        window.addEventListener('google-maps-loaded', () => {
            setIsApiLoaded(true);
            initRealMap();
        });
    }

    // Attempt to get real location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            () => console.log("Location permission denied")
        );
    }
    
    return () => {
        window.removeEventListener('google-maps-loaded', () => {});
    };
  }, []);

  // 2. Initialize Real Map
  const initRealMap = () => {
      if (!mapRef.current) return;
      
      try {
        const initialPos = userLocation || { lat: 40.7128, lng: -74.0060 }; // NYC fallback
        
        googleMapRef.current = new google.maps.Map(mapRef.current, {
            center: initialPos,
            zoom: 14,
            disableDefaultUI: true,
            styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "off" }] 
                }
            ]
        });

        // Search for Halal places using Places Service
        const service = new google.maps.places.PlacesService(googleMapRef.current);
        const request = {
            location: initialPos,
            radius: 5000,
            keyword: 'halal'
        };

        service.nearbySearch(request, (results: any, status: any) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                // Clear old markers
                markersRef.current.forEach(m => m.setMap(null));
                markersRef.current = [];

                results.forEach((place: any) => {
                    if (!place.geometry || !place.geometry.location) return;

                    const marker = new google.maps.Marker({
                        map: googleMapRef.current,
                        position: place.geometry.location,
                        title: place.name,
                        icon: {
                            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }
                    });

                    marker.addListener("click", () => {
                        // Convert Google Place to our internal Place type
                        const convertedPlace: Place = {
                            id: place.place_id || Math.random().toString(),
                            name: place.name || "Unknown",
                            type: 'RESTAURANT', // Simplification
                            subtype: place.types?.[0] || "Place",
                            distance: "Nearby", // Would need calculation
                            rating: place.rating || 0,
                            reviews: place.user_ratings_total || 0,
                            address: place.vicinity || "",
                            lat: place.geometry!.location!.lat(),
                            lng: place.geometry!.location!.lng(),
                            isOpen: place.opening_hours?.isOpen() || false,
                            certification: "Verification Needed"
                        };
                        setSelectedPlace(convertedPlace);
                    });
                    
                    markersRef.current.push(marker);
                });
            }
        });

      } catch (e) {
          console.error("Failed to init real map", e);
          setIsApiLoaded(false); // Fallback to mock
      }
  };

  // 3. Effect to update map center if restaurant passed via props
  useEffect(() => {
     if (restaurant && restaurant.name !== "Unknown Location") {
         // If using real map and restaurant has geometry, pan to it?
         // Since restaurant prop from Home is usually Mock data, we might just search for it
     }
  }, [restaurant]);


  // --- RENDER MOCK MAP (Fallback) ---
  const renderMockMap = () => (
      <div 
        className="absolute inset-0 z-0 overflow-hidden bg-[#e5e3df]"
        onClick={() => setSelectedPlace(null)}
      >
         <div className="absolute w-full h-full" style={{ 
             backgroundImage: 'linear-gradient(#dcdad5 2px, transparent 2px), linear-gradient(90deg, #dcdad5 2px, transparent 2px)', 
             backgroundSize: '40px 40px' 
         }}></div>
         
         <div className="absolute top-1/2 left-0 w-full h-6 bg-white border-y border-gray-300 transform -rotate-12"></div>
         <div className="absolute top-0 left-1/3 w-6 h-full bg-white border-x border-gray-300 transform rotate-12"></div>
         <div className="absolute top-10 right-10 w-48 h-48 bg-[#cbe6a3] rounded-full opacity-60"></div>
         
         {/* User Location */}
         <div className="absolute top-[60%] left-[40%] flex flex-col items-center z-20">
             <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                 <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
             </div>
         </div>

         {/* Pins */}
         {MOCK_PLACES.filter(p => activeFilter === 'ALL' || p.type === activeFilter).map(place => (
             <button 
                key={place.id}
                onClick={(e) => { e.stopPropagation(); setSelectedPlace(place); }}
                className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ${selectedPlace?.id === place.id ? 'scale-125 z-30' : 'scale-100 z-10'}`}
                style={{ top: `${place.lat}%`, left: `${place.lng}%` }}
             >
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 ${place.type === 'RESTAURANT' ? 'bg-orange-500' : place.type === 'STORE' ? 'bg-emerald-600' : 'bg-indigo-600'} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white`}>
                        <MapPin size={18} fill="currentColor" />
                    </div>
                </div>
             </button>
         ))}
         
         <div className="absolute bottom-32 left-0 w-full text-center pointer-events-none">
             <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                 Demo Mode (Add API Key for Real Map)
             </span>
         </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col relative bg-gray-100">
      
      {/* MAP CONTAINER */}
      {isApiLoaded ? (
          <div ref={mapRef} className="absolute inset-0 z-0 bg-gray-200" />
      ) : (
          renderMockMap()
      )}

      {/* HEADER & SEARCH */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 pointer-events-none flex flex-col gap-3">
        <div className="flex gap-2 pointer-events-auto">
            <button onClick={onBack} className="p-3 bg-white shadow-lg rounded-full text-gray-700 active:scale-95">
                <ArrowLeft size={24} />
            </button>
            <div className="flex-1 bg-white rounded-full shadow-lg flex items-center px-4">
                <Search size={18} className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder={isApiLoaded ? "Search Google Maps..." : "Search demo places..."}
                    className="w-full py-3 px-2 focus:outline-none text-sm bg-transparent"
                />
            </div>
            <button className="p-3 bg-white shadow-lg rounded-full text-gray-700 active:scale-95">
                <Filter size={20} />
            </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto">
            {['ALL', 'RESTAURANT', 'STORE', 'MOSQUE'].map((f) => (
                <button
                    key={f}
                    onClick={() => setActiveFilter(f as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md whitespace-nowrap transition-colors ${
                        activeFilter === f ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600'
                    }`}
                >
                    {f === 'ALL' ? 'All Places' : f === 'RESTAURANT' ? 'Restaurants' : f === 'STORE' ? 'Stores' : 'Mosques'}
                </button>
            ))}
        </div>
      </div>

      {/* FLOATING ACTION BUTTONS */}
      {!selectedPlace && (
          <div className="absolute bottom-24 right-4 flex flex-col gap-3 pointer-events-auto z-10">
              <button 
                onClick={() => {
                    if (isApiLoaded && googleMapRef.current && userLocation) {
                        googleMapRef.current.panTo(userLocation);
                        googleMapRef.current.setZoom(15);
                    }
                }}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 active:scale-95"
              >
                  <Navigation size={24} className={userLocation ? "text-blue-500" : "text-gray-400"} />
              </button>
          </div>
      )}

      {/* BOTTOM SHEET DETAILS */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.15)] z-20 transition-transform duration-300 ease-in-out ${selectedPlace ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
        
        {selectedPlace ? (
            /* DETAILED VIEW (Selected) */
            <div className="h-[75vh] overflow-y-auto">
                 <div className="w-full h-8 flex items-center justify-center sticky top-0 bg-white z-10" onClick={() => setSelectedPlace(null)}>
                     <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                 </div>

                 <div className="h-40 bg-gray-200 w-full relative">
                     <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                        <MapPin size={48} className="text-white/50" />
                     </div>
                     <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                         {selectedPlace.subtype}
                     </div>
                 </div>

                 <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedPlace.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">{selectedPlace.address}</p>
                        </div>
                        <div className="flex flex-col items-end">
                             <span className={`px-2 py-1 rounded-md text-xs font-bold ${selectedPlace.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {selectedPlace.isOpen ? 'Open' : 'Closed'}
                             </span>
                             <div className="flex items-center gap-1 mt-1">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold text-sm">{selectedPlace.rating}</span>
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button className="py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md active:scale-95">Directions</button>
                        <button className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold shadow-sm active:scale-95">Call</button>
                        <button className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold shadow-sm active:scale-95">Share</button>
                    </div>

                    {selectedPlace.certification && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3 mb-6">
                            <Check className="text-emerald-600" size={20} />
                            <div>
                                <h4 className="font-bold text-emerald-800 text-sm">Status Info</h4>
                                <p className="text-xs text-emerald-600">{selectedPlace.certification}</p>
                            </div>
                        </div>
                    )}
                 </div>
            </div>
        ) : (
            /* OVERVIEW LIST (Not Selected) */
            <div className="bg-white pt-2 pb-6">
                 <div className="flex justify-center mb-2" onClick={() => {
                     // Auto select first item logic or expand
                 }}>
                     <ChevronUp className="text-gray-300" size={20} />
                 </div>
                 <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                     {isApiLoaded ? "Results from Google Maps" : "Demo Places"}
                 </h3>
                 <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                     {(isApiLoaded ? [] : MOCK_PLACES).map(place => (
                         <div 
                            key={place.id} 
                            onClick={() => setSelectedPlace(place)}
                            className="min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-sm p-3 flex flex-col gap-2 active:scale-95 transition-transform"
                         >
                             <div className="flex justify-between items-start">
                                 <div className={`p-2 rounded-lg text-white ${place.type === 'RESTAURANT' ? 'bg-orange-100 text-orange-600' : place.type === 'STORE' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                     <MapPin size={18}/>
                                 </div>
                                 <span className="text-xs font-bold text-gray-400">{place.distance}</span>
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-800 text-sm truncate">{place.name}</h4>
                                 <p className="text-xs text-gray-500">{place.subtype}</p>
                             </div>
                         </div>
                     ))}
                     {isApiLoaded && (
                         <div className="px-4 text-sm text-gray-400 italic">
                             Tap pins on the map to see details
                         </div>
                     )}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MapView;