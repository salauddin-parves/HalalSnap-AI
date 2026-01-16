import React, { useState, useRef, useEffect } from 'react';
import { 
    Camera, Image as ImageIcon, X, AlertTriangle, Check, HelpCircle, 
    Loader2, ShoppingCart, Zap, Mic, Barcode, ScanLine, Layers, 
    Share2, Flag, AlertOctagon, Info, ChevronRight, RotateCcw, 
    ChevronDown, ChevronUp, Search, ShieldCheck, ThumbsUp, ThumbsDown,
    Users, Star
} from 'lucide-react';
import { analyzeProductImage, analyzeIngredientText, analyzeIngredientText as analyzeText, askScholar } from '../services/geminiService';
import { ProductAnalysis, ScanStatus } from '../types';

interface ScanProps {
  onScanComplete: (item: any) => void;
  scansLeft: number;
  decrementScan: () => void;
  kidsMode: boolean;
}

type ScanMode = 'BARCODE' | 'INGREDIENTS' | 'VOICE' | 'CERTIFICATION';

// Fake history for demo
const RECENT_SCANS = [
    { id: '1', name: 'Lay\'s Classic', status: ScanStatus.HALAL, time: '2m ago' },
    { id: '2', name: 'Haribo Gold', status: ScanStatus.HARAM, time: '1h ago' },
    { id: '3', name: 'Pringles', status: ScanStatus.HALAL, time: '3h ago' },
];

const Scan: React.FC<ScanProps> = ({ onScanComplete, scansLeft, decrementScan, kidsMode }) => {
  const [mode, setMode] = useState<ScanMode>('BARCODE');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProductAnalysis | null>(null);
  
  // Batch Mode State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [shoppingCart, setShoppingCart] = useState<ProductAnalysis[]>([]);

  // Comparison / Details State
  const [showIngredientDetails, setShowIngredientDetails] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkLimit = () => {
    if (scansLeft <= 0) {
        alert("Daily limit reached. Upgrade to Premium!");
        return false;
    }
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Full: string) => {
    if (!checkLimit()) {
        setImagePreview(null);
        return;
    }

    setIsAnalyzing(true);
    const base64Data = base64Full.split(',')[1];

    try {
      if (mode === 'CERTIFICATION') {
          // Simulation for certification checker
          setTimeout(() => {
              setResult({
                  productName: "Verified Certificate",
                  status: ScanStatus.HALAL,
                  confidenceScore: 99,
                  reason: "Valid JAKIM Malaysia Certification detected.",
                  scholarNote: "This logo corresponds to the Department of Islamic Development Malaysia (JAKIM). It is a globally recognized halal certification.",
                  ingredients: [],
                  alternatives: [],
                  certification: "JAKIM (Authentic)"
              });
              decrementScan();
              setIsAnalyzing(false);
          }, 2000);
          return;
      }

      const analysis = await analyzeProductImage(base64Data);
      
      if (isBatchMode) {
          setShoppingCart(prev => [analysis, ...prev]);
          setImagePreview(null); // Reset for next scan immediately
          decrementScan();
      } else {
          setResult(analysis);
          decrementScan();
      }
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
      setImagePreview(null);
    } finally {
        if (mode !== 'CERTIFICATION') {
            setIsAnalyzing(false);
        }
    }
  };

  const handleVoiceSearch = () => {
      const term = prompt("Simulating Voice Search: What product do you want to check?", "Is Doritos Halal?");
      if (term) {
          setIsAnalyzing(true);
          analyzeIngredientText(term).then(res => {
              setResult(res);
              setIsAnalyzing(false);
              decrementScan();
          }).catch(() => setIsAnalyzing(false));
      }
  };

  const resetScan = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper to render Status Colors
  const getStatusColor = (status: ScanStatus) => {
    switch (status) {
      case ScanStatus.HALAL: return 'bg-emerald-500';
      case ScanStatus.HARAM: return 'bg-red-500';
      case ScanStatus.DOUBTFUL: return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ScanStatus) => {
    switch (status) {
      case ScanStatus.HALAL: return <Check size={20} className="text-white" />;
      case ScanStatus.HARAM: return <X size={20} className="text-white" />;
      case ScanStatus.DOUBTFUL: return <HelpCircle size={20} className="text-white" />;
      default: return <HelpCircle size={20} className="text-white" />;
    }
  };

  // --- RENDER FUNCTIONS ---

  const renderCameraView = () => (
    <div className="h-full flex flex-col relative bg-black">
      {/* Top Header Controls */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 text-white">
        <button className="p-2 bg-black/30 rounded-full backdrop-blur-md">
            <Zap size={20} className="text-white/80" />
        </button>
        <div className="bg-black/40 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
            {isBatchMode ? `BATCH MODE (${shoppingCart.length})` : mode}
        </div>
        <button className="p-2 bg-black/30 rounded-full backdrop-blur-md">
            <RotateCcw size={20} className="text-white/80" />
        </button>
      </div>

      {/* Main Camera Viewport */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
         {/* Simulated Camera Feed Background if preview exists, else black */}
         {imagePreview ? (
             <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
         ) : (
             <div className="w-full h-full bg-gray-900 animate-pulse-slow"></div>
         )}

         {/* Focus Frame Overlay */}
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className={`border-2 border-white/50 rounded-2xl relative transition-all duration-300 ${mode === 'BARCODE' ? 'w-72 h-32' : mode === 'CERTIFICATION' ? 'w-48 h-48 rounded-full' : 'w-72 h-72'}`}>
                {/* Corners / Borders */}
                {mode !== 'CERTIFICATION' && (
                    <>
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1 rounded-br-lg"></div>
                    </>
                )}
                {mode === 'CERTIFICATION' && (
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full opacity-50 animate-ping"></div>
                )}
                
                {/* Scanning Laser Animation */}
                {isAnalyzing && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-scan-down opacity-80"></div>
                )}
                
                {/* Instruction Text */}
                <div className="absolute -bottom-10 w-full text-center text-white/90 text-sm font-medium shadow-black drop-shadow-md">
                    {mode === 'BARCODE' ? 'Align barcode in frame' : mode === 'CERTIFICATION' ? 'Center logo to verify' : 'Capture full ingredient list'}
                </div>
            </div>
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-white rounded-t-3xl p-6 pb-24 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         {/* Batch Mode Toggle */}
         {mode !== 'CERTIFICATION' && (
            <div className="flex justify-center mb-6">
                <button 
                    onClick={() => setIsBatchMode(!isBatchMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isBatchMode ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' : 'bg-gray-100 text-gray-500'}`}
                >
                    <Layers size={14} />
                    Batch Mode {isBatchMode ? 'ON' : 'OFF'}
                </button>
            </div>
         )}

         {/* Trigger & Gallery */}
         <div className="flex justify-around items-center mb-6">
            <div className="w-12"></div> {/* Spacer */}
            
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="cameraTrigger"
                />
                <label 
                    htmlFor="cameraTrigger"
                    className={`w-20 h-20 ${mode === 'CERTIFICATION' ? 'bg-blue-600' : 'bg-emerald-600'} rounded-full border-4 border-white shadow-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer`}
                >
                    <Camera size={32} className="text-white" />
                </label>
            </div>

            <label htmlFor="cameraTrigger" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 active:scale-95 cursor-pointer">
                <ImageIcon size={20} />
            </label>
         </div>

         {/* Recent History (Mini) */}
         <div className="border-t pt-4">
             <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-wide">Recent Scans</p>
             <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                 {RECENT_SCANS.map(scan => (
                     <div key={scan.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 min-w-[140px]">
                         <div className={`w-2 h-8 rounded-full ${scan.status === ScanStatus.HALAL ? 'bg-emerald-500' : scan.status === ScanStatus.HARAM ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                         <div>
                             <p className="text-xs font-bold text-gray-700 truncate w-20">{scan.name}</p>
                             <p className="text-[9px] text-gray-400">{scan.time}</p>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );

  const renderKidsResult = () => (
      <div className="h-full bg-yellow-50 overflow-y-auto pb-24 flex flex-col items-center justify-center text-center p-6 relative">
          <button onClick={resetScan} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-gray-500"><X size={32}/></button>
          
          <div className="mb-8">
              {result?.status === ScanStatus.HALAL ? (
                  <div className="animate-bounce">
                      <span className="text-9xl">😊</span>
                  </div>
              ) : (
                  <div className="animate-shake">
                      <span className="text-9xl">😞</span>
                  </div>
              )}
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight font-comic-sans">
              {result?.status === ScanStatus.HALAL ? "YES! Safe!" : "Oh no! Not safe."}
          </h1>
          
          <p className="text-xl text-gray-600 font-bold mb-8 font-comic-sans">
              {result?.status === ScanStatus.HALAL ? "You can eat this yummy treat!" : "Better find another snack!"}
          </p>

          <button 
            onClick={resetScan}
            className={`px-8 py-4 rounded-3xl text-2xl font-bold text-white shadow-xl active:scale-95 transition-transform ${result?.status === ScanStatus.HALAL ? 'bg-green-500' : 'bg-red-500'}`}
          >
              Scan Next Toy!
          </button>
      </div>
  );

  const renderResultView = () => {
      if (!result) return null;
      if (kidsMode) return renderKidsResult();

      // Smart Warning Logic (Mocked)
      const isRegionalWarning = result.origin && result.origin.includes("USA") && result.status === ScanStatus.HALAL;

      return (
        <div className="h-full bg-gray-50 overflow-y-auto pb-24 animate-in slide-in-from-bottom duration-300">
            {/* Header Status */}
            <div className={`${getStatusColor(result.status)} p-6 pb-12 text-white relative overflow-hidden`}>
                 <div className="absolute top-0 right-0 p-4 opacity-10"><ScanLine size={120} /></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                     <button onClick={resetScan} className="p-2 bg-black/20 rounded-full hover:bg-black/30"><X size={20}/></button>
                     <div className="flex gap-2">
                        <button onClick={() => onScanComplete(result)} className="p-2 bg-black/20 rounded-full hover:bg-black/30"><ShoppingCart size={20}/></button>
                        <button className="p-2 bg-black/20 rounded-full hover:bg-black/30"><Share2 size={20}/></button>
                     </div>
                 </div>

                 <div className="mt-6 flex flex-col items-center text-center relative z-10">
                      <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-3 shadow-inner">
                          {getStatusIcon(result.status)}
                      </div>
                      <h1 className="text-3xl font-extrabold tracking-tight">{result.status}</h1>
                      <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full text-xs font-bold">
                          <span>{result.confidenceScore}% Confidence</span>
                      </div>
                 </div>
            </div>

            {/* Main Info Card */}
            <div className="px-4 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{result.productName}</h2>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        {result.origin && <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><Flag size={10}/> Made in {result.origin}</span>}
                        {result.certification && <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100"><Check size={10}/> {result.certification}</span>}
                    </div>

                    {/* Crowd Verification Section (NEW) */}
                    <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                <Users className="text-blue-500" size={16}/> Crowd Verified
                            </h3>
                            <div className="flex text-amber-400">
                                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-3">
                            <span className="text-emerald-600 font-bold flex items-center gap-1"><ThumbsUp size={12}/> 2,847 Confirmed</span>
                            <span className="text-red-400 flex items-center gap-1"><ThumbsDown size={12}/> 12 Issues</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 shadow-sm">I can verify</button>
                            <button className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 shadow-sm">Report Issue</button>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Why it's {result.status.toLowerCase()}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{result.reason}</p>
                        
                        <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1 mb-1">
                                <Info size={12}/> Scholar Note
                            </h4>
                            <p className="text-xs text-blue-700">{result.scholarNote}</p>
                        </div>
                    </div>
                </div>

                {/* Regional Warning Card (Conditional) */}
                {isRegionalWarning && (
                     <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                        <AlertOctagon className="text-amber-600 flex-shrink-0" size={20} />
                        <div>
                            <h4 className="font-bold text-amber-800 text-sm">Region Alert</h4>
                            <p className="text-xs text-amber-700 mt-1">This product is Halal in its origin ({result.origin}) but manufacturing processes in your region may differ. Verify local packaging.</p>
                        </div>
                     </div>
                )}

                {/* Ingredient Deep Dive */}
                <div className="mt-6">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                        Ingredients 
                        <span className="text-xs font-normal text-gray-400">{result.ingredients?.length || 0} items</span>
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {result.ingredients && result.ingredients.length > 0 ? (
                            result.ingredients.map((ing, idx) => {
                                const isSuspicious = ing.toLowerCase().includes('e471') || ing.toLowerCase().includes('gelatin') || ing.toLowerCase().includes('carmine');
                                const isDetailsOpen = showIngredientDetails === ing;
                                
                                return (
                                    <div key={idx} className="border-b border-gray-50 last:border-0">
                                        <button 
                                            onClick={() => setShowIngredientDetails(isDetailsOpen ? null : ing)}
                                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {isSuspicious 
                                                    ? <AlertTriangle size={14} className="text-amber-500" /> 
                                                    : <Check size={14} className="text-emerald-400" />
                                                }
                                                <span className={`text-sm ${isSuspicious ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{ing}</span>
                                            </div>
                                            {isSuspicious && <ChevronDown size={14} className="text-gray-400" />}
                                        </button>
                                        
                                        {/* Ingredient Details Expansion */}
                                        {isDetailsOpen && isSuspicious && (
                                            <div className="bg-amber-50/50 p-3 px-10 text-xs text-gray-600 border-t border-dashed border-gray-200">
                                                <p className="font-bold text-amber-700 mb-1">Potential Issue:</p>
                                                <p>This ingredient can be derived from animal or plant sources. Without a "V" label or Halal certification, its source is ambiguous.</p>
                                                <div className="mt-2 flex gap-2">
                                                    <button className="px-2 py-1 bg-white border border-gray-200 rounded shadow-sm text-xs font-medium">Comparison</button>
                                                    <button className="px-2 py-1 bg-white border border-gray-200 rounded shadow-sm text-xs font-medium">Source</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-400 italic">No ingredients detected.</div>
                        )}
                    </div>
                </div>

                {/* Alternatives */}
                {(result.status === ScanStatus.HARAM || result.status === ScanStatus.DOUBTFUL) && result.alternatives && (
                    <div className="mt-6 mb-8">
                        <h3 className="font-bold text-gray-800 mb-3">Halal Alternatives</h3>
                        <div className="space-y-2">
                            {result.alternatives.map((alt, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                                    <span className="text-sm font-medium text-gray-700">{alt}</span>
                                    <button className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold">Switch</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  };

  const renderBatchModeView = () => (
      <div className="h-full flex flex-col bg-gray-50">
          <div className="bg-white p-4 pt-12 border-b shadow-sm flex justify-between items-center sticky top-0 z-10">
              <h1 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="text-indigo-600" /> Batch Cart ({shoppingCart.length})
              </h1>
              <button 
                  onClick={() => setIsBatchMode(false)}
                  className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full"
              >
                  Exit Batch
              </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {shoppingCart.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                      <Layers size={48} className="mb-4 text-gray-300" />
                      <p>Scan items to build your list</p>
                  </div>
              ) : (
                  shoppingCart.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getStatusColor(item.status)}`}>
                                   {item.status === ScanStatus.HALAL ? <Check size={16}/> : <X size={16}/>}
                               </div>
                               <div>
                                   <h3 className="font-bold text-gray-800 text-sm">{item.productName}</h3>
                                   <p className="text-[10px] text-gray-500">{item.status}</p>
                               </div>
                          </div>
                          {item.status !== ScanStatus.HALAL && (
                              <button className="text-xs text-indigo-600 font-bold">Alternatives</button>
                          )}
                      </div>
                  ))
              )}
          </div>

          <div className="p-4 bg-white border-t">
              <div className="flex justify-between mb-4 text-sm font-medium">
                  <span>Safe items:</span>
                  <span className="text-emerald-600 font-bold">{shoppingCart.filter(i => i.status === ScanStatus.HALAL).length}</span>
              </div>
              <button 
                onClick={() => {
                    setIsBatchMode(false);
                    // Add all to onScanComplete logic if needed
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95"
              >
                  Scan More Items
              </button>
          </div>
      </div>
  );

  // --- MAIN RENDER ---
  
  if (isBatchMode && !imagePreview) return renderBatchModeView();
  if (result && !isBatchMode) return renderResultView();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Mode Switcher Tabs */}
      <div className="bg-black pt-safe">
        <div className="flex text-center text-xs font-bold text-gray-400 uppercase tracking-wider overflow-x-auto">
            {['BARCODE', 'INGREDIENTS', 'VOICE', 'CERTIFICATION'].map((m) => (
                <button 
                    key={m}
                    onClick={() => setMode(m as ScanMode)}
                    className={`flex-1 py-4 px-2 min-w-[90px] border-b-2 transition-colors ${mode === m ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                >
                    {m === 'CERTIFICATION' ? 'Logo' : m.charAt(0) + m.slice(1).toLowerCase()}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black">
          {mode === 'VOICE' ? (
              <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none"></div>
                  
                  {isAnalyzing ? (
                       <div className="relative z-10">
                            <div className="w-32 h-32 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
                                <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                                     <Loader2 size={40} className="animate-spin text-white" />
                                </div>
                            </div>
                            <p className="mt-8 text-center text-indigo-200 font-medium">Processing...</p>
                       </div>
                  ) : (
                      <>
                        <p className="text-2xl font-bold mb-8 text-center px-6">"Is Haribo Halal?"</p>
                        <button 
                            onClick={handleVoiceSearch}
                            className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-[0_0_40px_rgba(99,102,241,0.4)] flex items-center justify-center active:scale-90 transition-transform z-10"
                        >
                            <Mic size={40} />
                        </button>
                        <p className="mt-8 text-gray-400 text-sm">Tap to speak</p>
                      </>
                  )}
              </div>
          ) : (
              renderCameraView()
          )}
      </div>
    </div>
  );
};

export default Scan;