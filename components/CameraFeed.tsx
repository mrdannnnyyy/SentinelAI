
import React, { useState } from 'react';
import { Camera } from '../types';
import { getStreamUrl } from '../services/apiService';
import { AlertCircle, Loader2 } from 'lucide-react';

interface CameraFeedProps {
    camera: Camera;
    className?: string;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ camera, className }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // If using the Python backend, this URL returns a continuous MJPEG stream
    const streamUrl = getStreamUrl(camera.id);

    if (error) {
        return (
            <div className={`w-full h-full bg-black flex flex-col items-center justify-center text-red-500 ${className}`}>
                <AlertCircle size={32} className="mb-2" />
                <span className="text-xs">Stream Offline</span>
                <button 
                    onClick={() => { setError(false); setLoading(true); }}
                    className="mt-2 text-[10px] bg-red-900/30 px-2 py-1 rounded hover:bg-red-900/50"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full bg-black ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Loader2 className="animate-spin text-slate-700" size={24} />
                </div>
            )}
            <img 
                src={streamUrl}
                alt={`Live feed of ${camera.name}`}
                className="w-full h-full object-cover relative z-10"
                onLoad={() => setLoading(false)}
                onError={() => setError(true)}
            />
        </div>
    );
};

export default CameraFeed;
