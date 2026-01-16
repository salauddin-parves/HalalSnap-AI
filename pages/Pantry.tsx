import React, { useState } from 'react';
import { Users, Filter, Clock, Trash2, AlertTriangle, CheckCircle, XCircle, Utensils, ChefHat, ArrowRight } from 'lucide-react';
import { PantryItem, ScanStatus, Recipe } from '../types';

interface PantryProps {
    history: PantryItem[];
    onRemoveItem: (id: string) => void;
}

type FilterType = 'ALL' | 'HALAL' | 'ATTENTION';
type TabType = 'ITEMS' | 'RECIPES';

const MOCK_RECIPES: Recipe[] = [
    {
        id: '1',
        title: "Halal Chicken Alfredo",
        emoji: "🍝",
        matchCount: 2,
        totalIngredients: 4,
        usedIngredients: ["Chicken Breast", "Pasta"],
        missingIngredients: ["Heavy Cream", "Parmesan"]
    },
    {
        id: '2',
        title: "Spicy Ramen Hack",
        emoji: "🍜",
        matchCount: 1,
        totalIngredients: 3,
        usedIngredients: ["Samyang Noodles"],
        missingIngredients: ["Egg", "Green Onion"]
    },
    {
        id: '3',
        title: "Chocolate Lava Cake",
        emoji: "🍰",
        matchCount: 1,
        totalIngredients: 5,
        usedIngredients: ["Nutella"],
        missingIngredients: ["Flour", "Eggs", "Sugar", "Butter"]
    }
];

const Pantry: React.FC<PantryProps> = ({ history, onRemoveItem }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [activeTab, setActiveTab] = useState<TabType>('ITEMS');

  const filteredHistory = history.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'HALAL') return item.status === ScanStatus.HALAL;
    if (activeFilter === 'ATTENTION') return item.status !== ScanStatus.HALAL; // Shows HARAM and DOUBTFUL
    return true;
  });

  const getDaysUntilExpiry = (dateStr?: string) => {
      if (!dateStr) return 999;
      const expiry = new Date(dateStr);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const renderExpiryBadge = (dateStr?: string) => {
      const days = getDaysUntilExpiry(dateStr);
      if (days < 0) return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Expired</span>;
      if (days <= 3) return <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={8}/> {days}d left</span>;
      if (days <= 7) return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{days}d left</span>;
      return null;
  };

  return (
    <div className="h-full bg-gray-50 pb-24 flex flex-col">
       <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-gray-800">Family Pantry</h1>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                        onClick={() => setActiveTab('ITEMS')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'ITEMS' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                    >
                        Items
                    </button>
                    <button 
                        onClick={() => setActiveTab('RECIPES')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'RECIPES' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                    >
                        <ChefHat size={12}/> Recipes
                    </button>
                </div>
            </div>
            
            {activeTab === 'ITEMS' && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button 
                        onClick={() => setActiveFilter('ALL')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'ALL' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        All Items
                    </button>
                    <button 
                        onClick={() => setActiveFilter('HALAL')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shadow-sm ${activeFilter === 'HALAL' ? 'bg-emerald-600 text-white border-transparent' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        Halal Only
                    </button>
                    <button 
                        onClick={() => setActiveFilter('ATTENTION')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-colors shadow-sm ${activeFilter === 'ATTENTION' ? 'bg-amber-500 text-white border-transparent' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Filter size={12}/> {activeFilter === 'ATTENTION' ? 'Issues Only' : 'Filter'}
                    </button>
                </div>
            )}
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'ITEMS' ? (
                <>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {activeFilter === 'ALL' ? 'My Pantry List' : activeFilter === 'HALAL' ? 'Halal Items' : 'Items Needing Review'} ({filteredHistory.length})
                    </h2>
                    {filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <Users size={24} />
                            </div>
                            <p className="text-sm">No items found matching filter.</p>
                        </div>
                    ) : (
                        filteredHistory.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${
                                        item.status === ScanStatus.HALAL ? 'bg-emerald-500' :
                                        item.status === ScanStatus.HARAM ? 'bg-red-500' : 'bg-amber-500'
                                    }`}></div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-base">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                item.status === ScanStatus.HALAL ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                item.status === ScanStatus.HARAM ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>{item.status}</span>
                                            {renderExpiryBadge(item.expiryDate)}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors active:scale-90"
                                    aria-label="Delete item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </>
            ) : (
                <>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
                        <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                            <Utensils size={16}/> Cook from Pantry
                        </h3>
                        <p className="text-xs text-indigo-700 mt-1">
                            These recipes use items you already have scanned!
                        </p>
                    </div>
                    {MOCK_RECIPES.map((recipe) => (
                         <div key={recipe.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-3">
                             <div className="p-4">
                                 <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center gap-3">
                                         <div className="text-3xl">{recipe.emoji}</div>
                                         <div>
                                             <h3 className="font-bold text-gray-800">{recipe.title}</h3>
                                             <span className="text-xs text-emerald-600 font-bold">{recipe.matchCount}/{recipe.totalIngredients} ingredients match</span>
                                         </div>
                                     </div>
                                     <button className="text-gray-400"><ArrowRight size={20}/></button>
                                 </div>
                                 <div className="mt-2 text-xs">
                                     <p className="font-bold text-gray-500 mb-1">You have:</p>
                                     <div className="flex flex-wrap gap-1 mb-2">
                                         {recipe.usedIngredients.map((ing, i) => (
                                             <span key={i} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
                                                 <CheckCircle size={8}/> {ing}
                                             </span>
                                         ))}
                                     </div>
                                     <p className="font-bold text-gray-500 mb-1">You need:</p>
                                      <div className="flex flex-wrap gap-1">
                                         {recipe.missingIngredients.map((ing, i) => (
                                             <span key={i} className="bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-200">
                                                 {ing}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                             <button className="w-full py-2 bg-gray-50 text-xs font-bold text-gray-600 border-t border-gray-100 hover:bg-gray-100">
                                 View Full Recipe
                             </button>
                         </div>
                    ))}
                </>
            )}
       </div>
    </div>
  );
};

export default Pantry;