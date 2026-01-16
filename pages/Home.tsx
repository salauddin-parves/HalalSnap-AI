import React, { useState, useRef, useEffect } from 'react';
import { 
    Scan, MapPin, Search, MessageCircle, X, Send, Sparkles, Loader2, 
    ArrowLeft, CheckCircle, Mic, Image as ImageIcon, Barcode, 
    Flame, Users, BookOpen, Moon, ArrowRight, Bell, ChevronRight, AlertTriangle, PartyPopper, Navigation
} from 'lucide-react';
import { askScholar } from '../services/geminiService';
import { Notification } from '../types';

interface HomeProps {
  userTier: string;
  scansLeft: number;
  onScanClick: () => void;
  onLocationSelect: (restaurant: any) => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const TRENDING_ITEMS = [
    { id: 1, name: "Prime Energy", status: "HALAL", change: "+120%", image: "⚡" },
    { id: 2, name: "Takis Fuego", status: "DOUBTFUL", change: "+85%", image: "🔥" },
    { id: 3, name: "Monster Energy", status: "HALAL", change: "+60%", image: "🟢" },
];

const RECOMMENDED_SWAPS = [
    { id: 1, name: "Lindt 70% Dark", type: "Chocolates", match: "98%" },
    { id: 2, name: "Ferrero Rocher", type: "Sweets", match: "95%" },
    { id: 3, name: "Kit Kat (Local)", type: "Snacks", match: "92%" },
];

const NEARBY_MOCK = {
    name: "Sultan's Kebab",
    type: "Turkish Cuisine",
    distance: "0.5km away",
    rating: 4.8,
    reviews: 1240,
    address: "123 Halal Street, Food District, New York, NY",
    tags: ["HALAL CERTIFIED", "NO ALCOHOL"],
    isOpen: true
};

const MOCK_NOTIFICATIONS: Notification[] = [
    { 
        id: '1', 
        title: "Product Update Alert", 
        message: "Nutella changed recipe in your region. Now contains animal rennet.", 
        type: 'ALERT', 
        time: '2h ago', 
        read: false,
        actionLabel: 'Find Alternative'
    },
    { 
        id: '2', 
        title: "New Halal Product Alert", 
        message: "Ben & Jerry's now has 3 halal certified flavors in your area!", 
        type: 'SUCCESS', 
        time: '5h ago', 
        read: false,
        actionLabel: 'See Flavors'
    },
    { 
        id: '3', 
        title: "Near a Halal Store", 
        message: "Al-Safa Halal Mart is 200m away. Special: 20% off meat today!", 
        type: 'INFO', 
        time: '1d ago', 
        read: true,
        actionLabel: 'Get Directions'
    }
];

const Home: React.FC<HomeProps> = ({ userTier, scansLeft, onScanClick, onLocationSelect }) => {
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Safe DB State (Legacy view support)
  const [showSafeProducts, setShowSafeProducts] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, showChat]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
        const contextStr = "User is on the home dashboard asking general questions about Halal/Haram rules, E-codes, or travel advice.";
        const answer = await askScholar(userMsg, contextStr);
        setChatMessages(prev => [...prev, { sender: 'ai', text: answer }]);
    } catch (err) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't connect to the scholar." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleVoiceSearch = () => {
      setShowChat(true);
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Listening... What would you like to know? (e.g., 'Is Doritos Halal?')" }]);
  };

  // Safe Products View (Simplified from previous iteration to keep file clean, can be re-expanded)
  if (showSafeProducts) {
    return (
      <div className="h-full bg-gray-50 flex flex-col relative pb-20">
           <div className="bg-white p-4 border-b flex items-center gap-3 sticky top-0 z-10 shadow-sm">
              <button onClick={() => setShowSafeProducts(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                  <ArrowLeft size={24} />
              </button>
              <h1 className="font-bold text-lg text-gray-800">Verified Database</h1>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-full text-gray-400">
               <p>Database content loaded...</p>
               <button onClick={() => setShowSafeProducts(false)} className="mt-4 text-emerald-600">Go Back</button>
          </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-gray-50">
        <div className="pb-24 overflow-y-auto h-full scrollbar-hide">
            
            {/* SECTION A: Dashboard Header & Stats */}
            <div className="bg-emerald-600 text-white rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Moon size={120} />
                </div>
                
                <div className="p-6 pt-8 pb-16">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Good Morning, Ahmed! 🌙</h1>
                            <p className="text-emerald-100 text-sm mt-1 flex items-center gap-2">
                                <span className="bg-emerald-500/50 px-2 py-0.5 rounded-full text-xs">Ramadan Mubarak</span>
                                12 days left
                            </p>
                        </div>
                        <div className="relative cursor-pointer" onClick={() => setShowNotifications(true)}>
                            <Bell className="text-emerald-100" />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600"></div>
                        </div>
                    </div>

                    {/* Prayer Time Integration */}
                    <div className="bg-emerald-700/50 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between border border-emerald-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                                <Moon size={16} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-200">Next Prayer</p>
                                <p className="font-bold text-sm">Asr - 3:45 PM</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono bg-emerald-800/50 px-2 py-1 rounded">
                            -00:23:00
                        </span>
                    </div>
                </div>
            </div>

            {/* Overlapping Stats Card */}
            <div className="px-4 -mt-10 mb-6">
                <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">📊 Your Halal Journey</h3>
                    <div className="flex justify-between items-end">
                        <div className="text-center">
                            <span className="block text-xl font-bold text-gray-800">47</span>
                            <span className="text-[10px] text-gray-400">Scanned</span>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-100"></div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-emerald-600">12</span>
                            <span className="text-[10px] text-gray-400">New Brands</span>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-100"></div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-amber-500">5</span>
                            <span className="text-[10px] text-gray-400">Saves</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION B: Quick Actions Carousel */}
            <div className="mb-8">
                <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x">
                    {/* Scan Now */}
                    <button onClick={onScanClick} className="flex flex-col items-center gap-2 min-w-[72px] snap-start group">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg flex items-center justify-center text-white group-active:scale-95 transition-transform">
                            <Scan size={28} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">Scan</span>
                    </button>

                    {/* Voice Search */}
                    <button onClick={handleVoiceSearch} className="flex flex-col items-center gap-2 min-w-[72px] snap-start group">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center text-indigo-500 group-active:scale-95 transition-transform">
                            <Mic size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">Voice</span>
                    </button>

                     {/* Upload Photo */}
                     <button onClick={onScanClick} className="flex flex-col items-center gap-2 min-w-[72px] snap-start group">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center text-blue-500 group-active:scale-95 transition-transform">
                            <ImageIcon size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">Upload</span>
                    </button>

                     {/* Nearby */}
                     <button onClick={() => onLocationSelect(NEARBY_MOCK)} className="flex flex-col items-center gap-2 min-w-[72px] snap-start group">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center text-orange-500 group-active:scale-95 transition-transform">
                            <MapPin size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">Nearby</span>
                    </button>

                    {/* Emergency Scan (Manual) */}
                    <button onClick={onScanClick} className="flex flex-col items-center gap-2 min-w-[72px] snap-start group">
                        <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-2xl shadow-inner flex items-center justify-center text-gray-500 group-active:scale-95 transition-transform">
                            <Barcode size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Manual</span>
                    </button>
                </div>
            </div>

            {/* SECTION C: Smart Recommendations */}
            <div className="mb-8 pl-4">
                <div className="flex justify-between items-center pr-4 mb-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-400" /> Recommended for You
                    </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 pr-4 scrollbar-hide">
                    <div className="min-w-[140px] bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-100 flex flex-col justify-between">
                         <div className="mb-2">
                            <span className="text-[10px] font-bold text-amber-600 bg-white/50 px-1.5 py-0.5 rounded">Based on recent scans</span>
                            <h4 className="font-bold text-gray-800 mt-2 leading-tight">Halal Chocolate Alternatives</h4>
                         </div>
                         <div className="flex -space-x-2 mt-2">
                             {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-amber-200 border-2 border-white"></div>)}
                         </div>
                    </div>
                    {RECOMMENDED_SWAPS.map(item => (
                        <div key={item.id} className="min-w-[130px] bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                            <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-2xl">🍫</div>
                            <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                            <p className="text-xs text-emerald-600 font-medium">{item.match} Match</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Section */}
            <div className="mb-8 px-4">
                 <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <Flame size={16} className="text-red-500" /> Trending in Your Area
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {TRENDING_ITEMS.map((item, idx) => (
                        <div key={item.id} className={`p-3 flex items-center justify-between ${idx !== TRENDING_ITEMS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-300 w-4">{item.id}</span>
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">{item.image}</div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === 'HALAL' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400">{item.change}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION D: Community Feed */}
            <div className="mb-8 px-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Users size={16} className="text-blue-500" /> Community Updates
                    </h2>
                    <span className="text-xs text-blue-500 font-medium">View All</span>
                </div>
                
                <div className="space-y-3">
                    {/* Positive Update */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle size={10} /> Certified Alert
                            </span>
                            <span className="text-[10px] text-gray-400">2h ago</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm">Oreo Cookies now Halal-Certified!</h3>
                        <p className="text-xs text-gray-500 mt-1">Official certification received for Malaysian production lines.</p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                             <div className="flex -space-x-1.5">
                                <div className="w-5 h-5 rounded-full bg-gray-200 border border-white"></div>
                                <div className="w-5 h-5 rounded-full bg-gray-300 border border-white"></div>
                                <div className="w-5 h-5 rounded-full bg-gray-400 border border-white"></div>
                             </div>
                             2.3k people verified this
                        </div>
                    </div>

                    {/* Warning Update */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <Users size={10} /> Product Change
                            </span>
                            <span className="text-[10px] text-gray-400">Yesterday</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm">Nutella (EU Batches) Warning</h3>
                        <p className="text-xs text-gray-500 mt-1">Reports of animal-based emulsifiers in recent German batches.</p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                             <span className="text-red-500 font-bold">47 users reported this</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION E: Educational Card */}
            <div className="px-4 mb-8">
                 <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-indigo-500" /> Did You Know?
                </h2>
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm">
                        <Sparkles size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-indigo-900 text-sm">E471 Ambiguity</h4>
                        <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                            Mono- and diglycerides of fatty acids (E471) can be derived from both plant and animal fats. Always check for a "Vegetarian" label or Halal logo to be sure!
                        </p>
                        <button className="mt-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
                            Take a quick quiz <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Floating AI Chat Button */}
        <button 
            onClick={() => setShowChat(true)}
            className="absolute bottom-20 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors z-40 active:scale-95 animate-bounce-subtle"
            aria-label="Ask AI Scholar"
        >
            <MessageCircle size={28} />
        </button>

        {/* Notifications Overlay */}
        {showNotifications && (
            <div className="absolute inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setShowNotifications(false)}>
                <div className="w-4/5 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Bell size={20} className="text-emerald-600"/> Notifications
                        </h2>
                        <button onClick={() => setShowNotifications(false)}><X size={20} className="text-gray-400"/></button>
                    </div>
                    <div className="overflow-y-auto h-full pb-20 p-4 space-y-4">
                        {MOCK_NOTIFICATIONS.map(notif => (
                            <div key={notif.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm relative overflow-hidden">
                                {notif.type === 'ALERT' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                                {notif.type === 'SUCCESS' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                                {notif.type === 'INFO' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                                
                                <div className="flex justify-between items-start mb-1 pl-2">
                                    <h4 className="font-bold text-sm text-gray-800">{notif.title}</h4>
                                    <span className="text-[10px] text-gray-400">{notif.time}</span>
                                </div>
                                <p className="text-xs text-gray-600 pl-2 mb-2 leading-relaxed">{notif.message}</p>
                                {notif.actionLabel && (
                                    <button className="text-xs font-bold text-indigo-600 pl-2">{notif.actionLabel} →</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* AI Scholar Chat Overlay (Same as before) */}
        {showChat && (
            <div className="absolute bottom-0 left-0 right-0 h-[85%] bg-white rounded-t-3xl shadow-[0_-10px_60px_rgba(0,0,0,0.3)] flex flex-col z-[100] animate-in slide-in-from-bottom duration-300">
                <div className="p-4 border-b flex justify-between items-center bg-indigo-50 rounded-t-3xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Sparkles size={16} className="text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">AI Scholar</h3>
                            <p className="text-xs text-indigo-500">Ask general Halal questions</p>
                        </div>
                    </div>
                    <button onClick={() => setShowChat(false)} className="p-2 bg-white rounded-full text-gray-500 shadow-sm active:scale-95"><X size={16}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 text-sm px-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                                <Sparkles className="text-indigo-400" size={24} />
                            </div>
                            <p>Salam! I'm your Halal Scholar AI.</p>
                            <p className="mt-2 text-xs opacity-70">Ask me about ingredients (e.g., "Is gelatin halal?"), E-codes, or general dietary rules.</p>
                        </div>
                    )}
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isChatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-indigo-500" />
                                <span className="text-xs text-gray-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t flex gap-2">
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                        type="submit" 
                        disabled={!chatInput.trim() || isChatLoading}
                        className="p-3 bg-indigo-600 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md active:scale-95 transition-transform"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        )}
    </div>
  );
};

export default Home;