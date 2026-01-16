import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Star, Navigation, MapPin, Phone, Globe, Clock, 
    Share2, Info, Utensils, ShoppingBag, Moon, Search, Filter, 
    Download, Camera, Plus, Check, X as XIcon, ChevronUp, Layers 
} from 'lucide-react';
import { Place, PlaceType } from '../types';

interface MapProps {
  onBack: () => void;
  restaurant: any; // Keeping generic to avoid breaking App.tsx call signature immediately
}

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
        certification: "100% Halal Certified (JAKIM)",
        popularDishes: [
            { name: "Chicken Biryani", rating: 4.9 },
            { name: "Lamb Kabsa", rating: 4.8 }
        ]
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
        promotion: "Dates 20% off today only!",
        inventory: [
            { item: "Halal Beef", status: 'IN_STOCK', type: 'HALAL' },
            { item: "Zabiha Chicken", status: 'IN_STOCK', type: 'ZABIHA' },
            { item: "Lamb Chops", status: 'OUT_OF_STOCK', type: 'HALAL' }
        ]
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
    },
    {
        id: '4',
        name: "Sultan's Kebab",
        type: 'RESTAURANT',
        subtype: 'Turkish',
        distance: "0.5km",
        rating: 4.8,
        reviews: 1240,
        address: "123 Halal Street",
        lat: 55,
        lng: 60,
        isOpen: true,
        priceRange: "$$",
        popularDishes: [
            { name: "Adana Kebab", rating: 4.7 },
            { name: "Kunafa", rating: 5.0 }
        ]
    }
];

const MapView: React.FC<MapProps> = ({ onBack, restaurant }) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | PlaceType>('ALL');
  const [showTravelDownload, setShowTravelDownload] = useState(true);

  // Handle initial selection if passed from Home
  useEffect(() => {
    if (restaurant && restaurant.name !== "Unknown Location") {
        // Try to match the passed restaurant to our mock data, or create a temporary one
        const match = MOCK_PLACES.find(p => p.name === restaurant.name);
        if (match) {
            setSelectedPlace(match);
        } else {
            // Create temp object for the prop passed from Home
            setSelectedPlace({
                id: '99',
                name: restaurant.name,
                type: 'RESTAURANT',
                subtype: restaurant.type,
                distance: restaurant.distance,
                rating: restaurant.rating,
                reviews: restaurant.reviews,
                address: restaurant.address,
                lat: 50, 
                lng: 50,
                isOpen: restaurant.isOpen,
                priceRange: "$$",
                certification: "Halal Certified"
            });
        }
    }
  }, [restaurant]);

  const handleBack = () => {
      if (selectedPlace) {
          setSelectedPlace(null);
      } else {
          onBack();
      }
  };

  const filteredPlaces = MOCK_PLACES.filter(p => activeFilter === 'ALL' || p.type === activeFilter);

  // --- COMPONENT: MAP PIN ---
  const Pin = ({ place, isSelected }: { place: Place, isSelected: boolean }) => {
      let Icon = MapPin;
      let color = "bg-red-500";
      
      if (place.type === 'RESTAURANT') { Icon = Utensils; color = "bg-orange-500"; }
      if (place.type === 'STORE') { Icon = ShoppingBag; color = "bg-emerald-600"; }
      if (place.type === 'MOSQUE') { Icon = Moon; color = "bg-indigo-600"; }

      return (
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedPlace(place); }}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'scale-100 z-10'}`}
            style={{ top: `${place.lat}%`, left: `${place.lng}%` }}
          >
              <div className="flex flex-col items-center">
                  <div className={`bg-white px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                      <span className="text-[10px] font-bold text-gray-800">{place.name}</span>
                  </div>
                  <div className={`w-10 h-10 ${color} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white`}>
                      <Icon size={18} fill="currentColor" />
                  </div>
                  <div className="w-2 h-1 bg-black/20 rounded-full mt-1 blur-[1px]"></div>
              </div>
          </button>
      );
  };

  // --- RENDER ---
  return (
    <div className="h-full flex flex-col relative bg-gray-100">
      
      {/* 1. INTERACTIVE MAP LAYER */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden bg-[#e5e3df]"
        onClick={() => setSelectedPlace(null)}
      >
         {/* Simulated Map Grid */}
         <div className="absolute w-full h-full" style={{ 
             backgroundImage: 'linear-gradient(#dcdad5 2px, transparent 2px), linear-gradient(90deg, #dcdad5 2px, transparent 2px)', 
             backgroundSize: '40px 40px' 
         }}></div>
         
         {/* Simulated Roads/Parks (Visual Flavor) */}
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
         {filteredPlaces.map(place => (
             <Pin key={place.id} place={place} isSelected={selectedPlace?.id === place.id} />
         ))}
      </div>

      {/* 2. HEADER & SEARCH */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 pointer-events-none flex flex-col gap-3">
        <div className="flex gap-2 pointer-events-auto">
            <button 
                onClick={handleBack}
                className="p-3 bg-white shadow-lg rounded-full text-gray-700 active:scale-95"
            >
                <ArrowLeft size={24} />
            </button>
            <div className="flex-1 bg-white rounded-full shadow-lg flex items-center px-4">
                <Search size={18} className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search halal places..." 
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

        {/* Travel Mode Alert (Dismissible) */}
        {showTravelDownload && !selectedPlace && (
            <div className="bg-white rounded-xl shadow-xl p-3 flex items-center justify-between pointer-events-auto animate-in slide-in-from-top fade-in border-l-4 border-emerald-500">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        <Globe size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-xs">Traveling to London?</h4>
                        <p className="text-[10px] text-gray-500">Download offline database (45MB)</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-xs flex items-center gap-1">
                        <Download size={14} /> Get
                    </button>
                    <button onClick={() => setShowTravelDownload(false)} className="text-gray-400 p-1"><XIcon size={14}/></button>
                </div>
            </div>
        )}
      </div>

      {/* 3. FLOATING ACTION BUTTONS */}
      {!selectedPlace && (
          <div className="absolute bottom-24 right-4 flex flex-col gap-3 pointer-events-auto z-10">
              <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 active:scale-95">
                  <Camera size={24} />
              </button>
              <button className="w-14 h-14 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white active:scale-95">
                  <Plus size={28} />
              </button>
          </div>
      )}

      {/* 4. BOTTOM SHEET DETAILS */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.15)] z-20 transition-transform duration-300 ease-in-out ${selectedPlace ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
        
        {selectedPlace ? (
            /* DETAILED VIEW (Selected) */
            <div className="h-[75vh] overflow-y-auto">
                 {/* Drag Handle */}
                 <div className="w-full h-8 flex items-center justify-center sticky top-0 bg-white z-10" onClick={() => setSelectedPlace(null)}>
                     <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                 </div>

                 {/* Hero Image / Banner */}
                 <div className="h-40 bg-gray-200 w-full relative">
                     {selectedPlace.type === 'RESTAURANT' ? (
                        <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                            <Utensils size={48} className="text-white/50" />
                        </div>
                     ) : selectedPlace.type === 'STORE' ? (
                        <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-600 flex items-center justify-center">
                            <ShoppingBag size={48} className="text-white/50" />
                        </div>
                     ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-blue-600 flex items-center justify-center">
                            <Moon size={48} className="text-white/50" />
                        </div>
                     )}
                     <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                         {selectedPlace.subtype}
                     </div>
                 </div>

                 <div className="p-6">
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedPlace.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">{selectedPlace.distance} • {selectedPlace.address}</p>
                        </div>
                        <div className="flex flex-col items-end">
                             <span className={`px-2 py-1 rounded-md text-xs font-bold ${selectedPlace.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {selectedPlace.isOpen ? 'Open' : 'Closed'}
                             </span>
                             <div className="flex items-center gap-1 mt-1">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold text-sm">{selectedPlace.rating}</span>
                                <span className="text-xs text-gray-400">({selectedPlace.reviews})</span>
                             </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button className="py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md active:scale-95">Directions</button>
                        <button className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold shadow-sm active:scale-95">Call</button>
                        <button className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold shadow-sm active:scale-95">Share</button>
                    </div>

                    {/* Certification Badge */}
                    {selectedPlace.certification && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3 mb-6">
                            <Check className="text-emerald-600" size={20} />
                            <div>
                                <h4 className="font-bold text-emerald-800 text-sm">Certified Halal</h4>
                                <p className="text-xs text-emerald-600">{selectedPlace.certification}</p>
                            </div>
                        </div>
                    )}

                    {/* RESTAURANT SPECIFIC: Popular Dishes */}
                    {selectedPlace.type === 'RESTAURANT' && selectedPlace.popularDishes && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Utensils size={16} className="text-orange-500" /> Popular Dishes
                            </h3>
                            <div className="space-y-3">
                                {selectedPlace.popularDishes.map((dish, i) => (
                                    <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <span className="text-sm font-medium text-gray-700">{dish.name}</span>
                                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-sm">
                                            <Star size={10} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-bold">{dish.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STORE SPECIFIC: Live Inventory */}
                    {selectedPlace.type === 'STORE' && selectedPlace.inventory && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Layers size={16} className="text-emerald-500" /> Live Inventory
                            </h3>
                            
                            {selectedPlace.promotion && (
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-3 rounded-xl mb-3 flex items-center gap-2">
                                    <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">HOT</div>
                                    <span className="text-xs text-red-700 font-medium">{selectedPlace.promotion}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                {selectedPlace.inventory.map((inv, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${inv.type === 'ZABIHA' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {inv.type}
                                            </span>
                                            <span className="text-sm text-gray-700">{inv.item}</span>
                                        </div>
                                        {inv.status === 'IN_STOCK' ? (
                                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Check size={12}/> Stock</span>
                                        ) : (
                                            <span className="text-xs font-bold text-red-400 flex items-center gap-1"><XIcon size={12}/> Out</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Add Contribution */}
                    <button className="w-full py-4 border-t border-gray-100 mt-2 flex items-center justify-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors">
                        <Camera size={16} />
                        <span className="text-sm font-medium">Add Photo / Update Info</span>
                    </button>
                 </div>
            </div>
        ) : (
            /* OVERVIEW LIST (Not Selected) */
            <div className="bg-white pt-2 pb-6">
                 <div className="flex justify-center mb-2" onClick={() => setSelectedPlace(MOCK_PLACES[0])}>
                     <ChevronUp className="text-gray-300" size={20} />
                 </div>
                 <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Nearby Places ({filteredPlaces.length})</h3>
                 <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                     {filteredPlaces.map(place => (
                         <div 
                            key={place.id} 
                            onClick={() => setSelectedPlace(place)}
                            className="min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-sm p-3 flex flex-col gap-2 active:scale-95 transition-transform"
                         >
                             <div className="flex justify-between items-start">
                                 <div className={`p-2 rounded-lg text-white ${place.type === 'RESTAURANT' ? 'bg-orange-100 text-orange-600' : place.type === 'STORE' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                     {place.type === 'RESTAURANT' ? <Utensils size={18}/> : place.type === 'STORE' ? <ShoppingBag size={18}/> : <Moon size={18}/>}
                                 </div>
                                 <span className="text-xs font-bold text-gray-400">{place.distance}</span>
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-800 text-sm truncate">{place.name}</h4>
                                 <p className="text-xs text-gray-500">{place.subtype}</p>
                             </div>
                             <div className="flex items-center gap-1 mt-1">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold text-gray-700">{place.rating}</span>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MapView;