import React from 'react';
import { LayoutDashboard, Film, ScanFace, TrendingUp, Ban, Siren, Settings, Video, BrainCircuit } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Live View', icon: <LayoutDashboard size={20} /> },
    { id: 'review', label: 'Review Footage', icon: <Film size={20} /> },
    { id: 'face-id', label: 'Face ID', icon: <ScanFace size={20} /> },
    { id: 'training', label: 'AI Training', icon: <BrainCircuit size={20} className="text-purple-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
    { id: 'banned', label: 'Banned List', icon: <Ban size={20} /> },
    { id: 'theft', label: 'Theft Detection', icon: <Siren size={20} className="text-red-500" /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Video className="text-white" size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Sentinel<span className="text-blue-500">AI</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span className={currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">SYSTEM STATUS</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>CPU</span>
              <span className="text-slate-300">12%</span>
            </div>
             <div className="flex justify-between text-xs text-slate-500">
              <span>Storage</span>
              <span className="text-slate-300">64%</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Backbone</span>
              <span className="text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
