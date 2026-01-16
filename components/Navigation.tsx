import React from 'react';
import { Home, ScanLine, ShoppingBasket, Plane, User } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'scan', icon: ScanLine, label: 'Scan', primary: true },
    { id: 'pantry', icon: ShoppingBasket, label: 'Pantry' },
    { id: 'travel', icon: Plane, label: 'Travel' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-end h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          if (item.primary) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative -top-5 flex flex-col items-center justify-center"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-emerald-500 text-white'}`}>
                    <item.icon size={28} />
                </div>
                <span className="text-xs mt-1 font-medium text-emerald-700">{item.label}</span>
              </button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full pb-2 transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;