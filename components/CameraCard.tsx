import React, { useState } from 'react';
import { Camera } from '../types';
import { Maximize2, Activity, AlertCircle, PlayCircle, Eye } from 'lucide-react';
import { analyzeFrame } from '../services/geminiService';

interface CameraCardProps {
  camera: Camera;
  onMaximize: (camera: Camera) => void;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, onMaximize }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAIAnalysis = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnalyzing(true);
    // Simulate image capture with placeholder
    // In a real app, this would be a frame capture
    const result = await analyzeFrame(camera.thumbnail); // Passing URL, service handles it (mocked in this case for URL usage)
    setAnalysisResult(result);
    setAnalyzing(false);
    setTimeout(() => setAnalysisResult(null), 5000); // Clear after 5s
  };

  return (
    <div
      className={`relative group bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 ${
        camera.status === 'offline' ? 'border-red-900/50 opacity-70' : 'border-slate-800 hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-900/10'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Feed Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
           <h3 className="text-white font-medium text-sm flex items-center gap-2">
             {camera.name}
             {camera.isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Recording"></span>}
           </h3>
           <p className="text-xs text-slate-400">{camera.location}</p>
        </div>
        <div className="flex gap-1">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${camera.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {camera.status}
          </span>
          {camera.status === 'online' && (
             <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
               {camera.resolution}
             </span>
          )}
        </div>
      </div>

      {/* Main Video Area (Image Mock) */}
      <div className="aspect-video relative bg-black flex items-center justify-center cursor-pointer" onClick={() => onMaximize(camera)}>
        {camera.status === 'online' ? (
          <img
            src={camera.thumbnail}
            alt={camera.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-600">
            <AlertCircle size={32} className="mb-2" />
            <span className="text-sm">Signal Lost</span>
          </div>
        )}

        {/* AI Analysis Overlay */}
        {analysisResult && (
            <div className="absolute inset-0 bg-black/80 p-4 flex items-center justify-center text-center animate-in fade-in">
                <p className="text-sm text-blue-200">{analysisResult}</p>
            </div>
        )}

        {/* Playback Controls Overlay (On Hover) */}
        {isHovered && camera.status === 'online' && !analysisResult && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-200">
             <button
                onClick={(e) => { e.stopPropagation(); onMaximize(camera); }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-110"
             >
                <PlayCircle size={24} fill="white" className="text-transparent" />
             </button>
             <div className="flex gap-2">
                 <button
                    onClick={handleAIAnalysis}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2 shadow-lg"
                 >
                    {analyzing ? <Activity className="animate-spin" size={14}/> : <Eye size={14}/>}
                    {analyzing ? 'Analyzing...' : 'Smart Analysis'}
                 </button>
                 <button
                    onClick={(e) => { e.stopPropagation(); onMaximize(camera); }}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium flex items-center gap-2"
                 >
                    <Maximize2 size={14}/> Fullscreen
                 </button>
             </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-slate-900 p-2 px-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <div className="flex gap-3">
              <span className="flex items-center gap-1 hover:text-slate-300 cursor-help" title="Motion Events Today">
                  <Activity size={12} /> 142
              </span>
              <span>{camera.fps} FPS</span>
          </div>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default CameraCard;
