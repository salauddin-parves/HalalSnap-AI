import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Alert } from '../types';

interface AlertCardProps {
  alert: Alert;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'WARNING': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'SUCCESS': return <CheckCircle className="text-emerald-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (alert.type) {
      case 'WARNING': return 'bg-amber-50 border-amber-100';
      case 'SUCCESS': return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getBgColor()} mb-3 flex items-start gap-3 shadow-sm`}>
      <div className="mt-0.5">{getIcon()}</div>
      <div>
        <h4 className="font-semibold text-gray-800 text-sm">{alert.title}</h4>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.message}</p>
        <span className="text-[10px] text-gray-400 mt-2 block">{alert.date}</span>
      </div>
    </div>
  );
};

export default AlertCard;