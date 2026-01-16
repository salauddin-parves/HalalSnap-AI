import React, { useState } from 'react';
import { UserTier } from '../types';
import { 
    Crown, Settings, LogOut, ChevronRight, Star, ShieldCheck, Zap, 
    MapPin, Mail, Calendar, Award, Edit2, Camera, CheckCircle, XCircle, 
    AlertTriangle, TrendingUp, Heart, ShoppingBag, Globe, Bell, Moon, 
    Download, Lock, HelpCircle, FileText, Users, Share2, ToggleRight, ToggleLeft,
    Check, Gamepad2, Baby
} from 'lucide-react';

interface ProfileProps {
  userTier: UserTier;
  scansLeft: number;
  onUpgrade: () => void;
  kidsMode: boolean;
  toggleKidsMode: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userTier, scansLeft, onUpgrade, kidsMode, toggleKidsMode }) => {
  const [halalStandard, setHalalStandard] = useState<'strict' | 'moderate' | 'lenient'>('moderate');
  const [dietary, setDietary] = useState({
      halal: true,
      noPorkAlcohol: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      nutAllergy: false
  });

  const [notifications, setNotifications] = useState({
      products: true,
      prayer: true,
      community: false
  });

  const toggleDietary = (key: keyof typeof dietary) => {
      setDietary(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full bg-gray-50 pb-24 overflow-y-auto">
      
      {/* A. PROFILE OVERVIEW */}
      <div className="bg-white p-6 pb-8 border-b border-gray-100 relative">
        <button className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 active:scale-95 transition-transform">
            <Edit2 size={16} />
        </button>
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full mb-3 flex items-center justify-center text-4xl border-4 border-white shadow-lg relative">
                🧔🏻
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Community Level 5">
                    <span className="text-xs font-bold text-white">5</span>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Ahmed Rahman</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail size={12}/> ahmed@email.com</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> Dhaka, BD 🇧🇩</span>
            </div>
             <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Calendar size={10}/> Since Jan 2025</span>
                <span className="flex items-center gap-1 text-amber-500 font-medium"><Award size={10}/> 2,847 pts</span>
            </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* B. SCAN STATISTICS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                <TrendingUp size={16} className="text-emerald-600" /> Your Activity
            </h3>
            
            <div className="mb-4">
                <p className="text-xs text-gray-400 font-bold mb-2">THIS MONTH</p>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                        <Camera className="mx-auto text-emerald-600 mb-1" size={16} />
                        <span className="block text-lg font-bold text-gray-800">47</span>
                        <span className="text-[10px] text-gray-500">Scanned</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                        <CheckCircle className="mx-auto text-green-600 mb-1" size={16} />
                        <span className="block text-lg font-bold text-gray-800">39</span>
                        <span className="text-[10px] text-gray-500">Halal</span>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                        <XCircle className="mx-auto text-red-600 mb-1" size={16} />
                        <span className="block text-lg font-bold text-gray-800">3</span>
                        <span className="text-[10px] text-gray-500">Haram</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div>
                    <p className="text-xs text-gray-400 font-bold">ALL TIME</p>
                    <p className="text-sm font-bold text-gray-800">347 Total Scans</p>
                </div>
                <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">92% Halal Rate</span>
                </div>
            </div>
        </div>

        {/* C. SAVED PRODUCTS */}
        <div>
            <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Heart size={16} className="text-red-500" /> Saved Items (23)
                </h3>
                <button className="text-xs text-indigo-600 font-bold">See All</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <div className="min-w-[140px] bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                         <span className="text-2xl">🍫</span>
                         <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">Lindt Dark Chocolate</h4>
                </div>
                <div className="min-w-[140px] bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                         <span className="text-2xl">🥤</span>
                         <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">Red Bull Energy</h4>
                </div>
                <div className="min-w-[140px] bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                         <span className="text-2xl">🍪</span>
                         <AlertTriangle size={14} className="text-amber-500" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">Oreo Original</h4>
                </div>
            </div>
        </div>

        {/* D. DIETARY PREFERENCES */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                <Settings size={16} className="text-gray-600" /> Preferences
            </h3>
            
            <div className="mb-4">
                <p className="text-xs text-gray-400 font-bold mb-2">RESTRICTIONS</p>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(dietary).map(([key, value]) => (
                        <button 
                            key={key}
                            onClick={() => toggleDietary(key as any)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border transition-colors ${value ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${value ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'}`}>
                                {value && <Check size={10} className="text-white" />}
                            </div>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-50 pt-4">
                <p className="text-xs text-gray-400 font-bold mb-2">HALAL STANDARDS</p>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {['strict', 'moderate', 'lenient'].map((std) => (
                        <button
                            key={std}
                            onClick={() => setHalalStandard(std as any)}
                            className={`flex-1 py-2 text-xs font-bold rounded-md capitalize transition-all ${halalStandard === std ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-600'}`}
                        >
                            {std}
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center">
                    {halalStandard === 'strict' && "Hand-slaughtered required. No machine processing."}
                    {halalStandard === 'moderate' && "Machine slaughter accepted if Halal certified."}
                    {halalStandard === 'lenient' && "Avoid obvious haram ingredients. Certificates preferred."}
                </p>
            </div>
        </div>

        {/* E. FAMILY SHARING */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Users size={16} className="text-blue-500" /> Family Account
                </h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">4/5</span>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">A</div>
                         <div>
                             <p className="text-sm font-bold text-gray-800">Ayesha (Wife)</p>
                             <p className="text-[10px] text-gray-400">Admin</p>
                         </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">F</div>
                         <div>
                             <p className="text-sm font-bold text-gray-800">Fatima (Daughter)</p>
                             <p className="text-[10px] text-gray-400">Member</p>
                         </div>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">Y</div>
                         <div>
                             <p className="text-sm font-bold text-gray-800">Yusuf (Son)</p>
                             <p className="text-[10px] text-gray-400">Member</p>
                         </div>
                    </div>
                </div>
            </div>

            <button className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-gray-500 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
                <Share2 size={14} /> Invite Family Member
            </button>
        </div>

        {/* F. PREMIUM SUBSCRIPTION */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                        {userTier === UserTier.PREMIUM ? "Premium Active" : "Upgrade to Premium"}
                        <Crown size={18} fill="currentColor" />
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                        {userTier === UserTier.PREMIUM ? "Next billing date: Feb 28, 2025" : "Unlock unlimited potential"}
                    </p>
                </div>
            </div>
            
            {userTier === UserTier.FREE && (
                <>
                    <div className="mb-4 p-3 bg-white/10 rounded-xl">
                         <div className="flex justify-between text-xs mb-1">
                             <span className="text-gray-300">Daily Scans</span>
                             <span className="font-bold text-white">{scansLeft}/10 Remaining</span>
                         </div>
                         <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                             <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(scansLeft/10)*100}%` }}></div>
                         </div>
                    </div>

                    <ul className="space-y-2 mb-6 text-sm text-gray-300">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400"/> Unlimited scans</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400"/> Offline travel mode</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400"/> Family sharing (up to 5)</li>
                    </ul>
                    
                    <button 
                        onClick={onUpgrade}
                        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 rounded-xl transition-colors shadow-lg active:scale-95"
                    >
                        Try Free for 7 Days
                    </button>
                </>
            )}
        </div>

        {/* G. GAMIFICATION & HALAL SCORE (New Design) */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Gamepad2 size={100} /></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                        <Award size={16} className="text-amber-400" /> Your Halal Score
                    </h3>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded border border-white/30">Lvl 5</span>
                </div>

                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white">Halal Hunter 🏹</h2>
                    <div className="flex justify-between text-xs text-indigo-200 mt-1 mb-2">
                        <span>2,847 XP</span>
                        <span>5,000 XP</span>
                    </div>
                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '57%' }}></div>
                    </div>
                </div>

                <div className="bg-black/20 rounded-xl p-3 mb-4">
                    <h4 className="text-xs font-bold text-indigo-200 mb-2">RECENT ACHIEVEMENTS</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🏆</span>
                            <div>
                                <p className="text-xs font-bold">Scanned 50 products</p>
                                <p className="text-[10px] text-indigo-300">+100 XP</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <span className="text-lg">🥇</span>
                            <div>
                                <p className="text-xs font-bold">#1 Contributor this week</p>
                                <p className="text-[10px] text-indigo-300">+500 XP</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition-colors">
                    View All Achievements
                </button>
            </div>
        </div>

        {/* H. SETTINGS & SUPPORT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Settings size={16} className="text-gray-400" /> Settings
                </h3>
            </div>
            
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Globe size={16} /></div>
                    <div className="text-left">
                        <span className="block text-sm font-medium text-gray-700">Language & Region</span>
                        <span className="text-xs text-gray-400">English • Bangladesh</span>
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </button>

            {/* Kids Mode Toggle */}
            <div className="w-full flex items-center justify-between p-4 border-b border-gray-50 bg-yellow-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Baby size={16} /></div>
                    <div className="text-left">
                        <span className="block text-sm font-bold text-gray-800">Kids Safe Mode</span>
                        <span className="text-xs text-gray-500">Simplified UI for children</span>
                    </div>
                </div>
                <button onClick={toggleKidsMode} className="text-yellow-500 hover:scale-110 transition-transform">
                    {kidsMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-300"/>}
                </button>
            </div>

            <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Bell size={16} /></div>
                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">On</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Download size={16} /></div>
                    <div className="text-left">
                        <span className="block text-sm font-medium text-gray-700">Offline Data</span>
                        <span className="text-xs text-gray-400">127 MB Used</span>
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><HelpCircle size={16} /></div>
                    <span className="text-sm font-medium text-gray-700">Help & Support</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-500 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg"><LogOut size={16} /></div>
                    <span className="text-sm font-medium">Log Out</span>
                </div>
            </button>
        </div>

        <div className="text-center pt-4 pb-2">
            <p className="text-xs text-gray-400">HalalSnap AI v1.0.2</p>
            <div className="flex justify-center gap-4 mt-2">
                <a href="#" className="text-[10px] text-gray-400 hover:text-gray-600">Privacy Policy</a>
                <a href="#" className="text-[10px] text-gray-400 hover:text-gray-600">Terms of Service</a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;