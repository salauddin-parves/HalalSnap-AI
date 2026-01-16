import React, { useState } from 'react';
import { Download, Globe, CheckCircle, Search, Map } from 'lucide-react';

const Travel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [downloaded, setDownloaded] = useState<string[]>([]);

  // Real-world data for Halal certification bodies
  const countries = [
    { id: 'au', name: 'Australia', body: 'AFIC / HCA', size: '9 MB' },
    { id: 'fr', name: 'France', body: 'ARGML (Lyon)', size: '14 MB' },
    { id: 'de', name: 'Germany', body: 'Halal Control EU', size: '11 MB' },
    { id: 'id', name: 'Indonesia', body: 'MUI (Majelis Ulama)', size: '18 MB' },
    { id: 'jp', name: 'Japan', body: 'JMA / NAHA', size: '8 MB' },
    { id: 'my', name: 'Malaysia', body: 'JAKIM', size: '12 MB' },
    { id: 'sa', name: 'Saudi Arabia', body: 'SASO / SFDA', size: '4 MB' },
    { id: 'sg', name: 'Singapore', body: 'MUIS', size: '5 MB' },
    { id: 'kr', name: 'South Korea', body: 'KMF', size: '6 MB' },
    { id: 'tr', name: 'Turkey', body: 'GIMDES', size: '10 MB' },
    { id: 'ae', name: 'UAE', body: 'ESMA', size: '7 MB' },
    { id: 'uk', name: 'United Kingdom', body: 'HFA / HMC', size: '15 MB' },
    { id: 'us', name: 'USA', body: 'IFANCA / ISWA', size: '22 MB' },
  ];

  const toggleDownload = (id: string) => {
    if (downloaded.includes(id)) {
        setDownloaded(prev => prev.filter(c => c !== id));
    } else {
        setDownloaded(prev => [...prev, id]);
    }
  };

  const filteredCountries = countries
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="h-full bg-gray-50 flex flex-col pb-24">
      <div className="bg-emerald-600 p-6 pb-12 rounded-b-[2rem] shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
            <Globe className="text-emerald-200" />
            <h1 className="text-2xl font-bold">Travel Mode</h1>
        </div>
        <p className="text-emerald-100 text-sm mb-6 max-w-xs leading-relaxed">
            Download databases for your destination to scan offline.
            We automatically sync with local certification bodies.
        </p>
        
        <div className="relative">
            <Search className="absolute left-3 top-3 text-emerald-700 opacity-50" size={18} />
            <input 
                type="text" 
                placeholder="Where are you going?" 
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredCountries.map((country, index) => {
                const isDownloaded = downloaded.includes(country.id);
                return (
                    <div key={country.id} className={`p-4 flex items-center justify-between ${index !== filteredCountries.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                                {country.id.toUpperCase()}
                             </div>
                             <div>
                                <h3 className="font-semibold text-gray-800">{country.name}</h3>
                                <p className="text-xs text-gray-500">Certified by {country.body} • {country.size}</p>
                             </div>
                        </div>
                        <button 
                            onClick={() => toggleDownload(country.id)}
                            className={`p-2 rounded-full transition-all ${isDownloaded ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                            {isDownloaded ? <CheckCircle size={20} /> : <Download size={20} />}
                        </button>
                    </div>
                );
            })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <Map className="text-blue-500 mt-0.5" size={20} />
            <div>
                <h4 className="text-sm font-semibold text-blue-800">Travel Tip</h4>
                <p className="text-xs text-blue-600 mt-1">
                    Traveling to East Asia? Look out for "Mirin" (cooking wine) and "Shortening" (often animal-based) in ingredient lists.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Travel;