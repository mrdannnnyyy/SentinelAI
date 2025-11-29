import React from 'react';
import { SecurityEvent } from '../types';
import { Play, Clock, AlertTriangle, Car, User, UserX } from 'lucide-react';

interface EventItemProps {
  event: SecurityEvent;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const getIcon = () => {
    switch (event.type) {
      case 'vehicle': return <Car size={16} />;
      case 'person': return <User size={16} />;
      case 'face': return <UserX size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getSeverityColor = () => {
    switch (event.severity) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-500';
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-500';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
      default: return 'border-blue-500 bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group">
      {/* Thumbnail */}
      <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0">
        <img src={event.thumbnail} alt="Event" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="text-white drop-shadow-md" size={24} fill="currentColor" />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <span className={`w-6 h-6 rounded flex items-center justify-center border ${getSeverityColor()}`}>
                    {getIcon()}
                </span>
                <span className="font-semibold text-slate-200">{event.type.toUpperCase()} DETECTED</span>
            </div>
            <p className="text-sm text-slate-400">{event.description}</p>
          </div>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Clock size={12} />
            {new Date(event.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
            <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">
                {event.cameraName}
            </span>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Review &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
