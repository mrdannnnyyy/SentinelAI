
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CameraCard from './components/CameraCard';
import EventItem from './components/EventItem';
import TrainingView from './components/TrainingView';
import CameraFeed from './components/CameraFeed';
import { ViewState, Camera, Person, CameraType, SecurityEvent } from './types';
import { ANALYTICS_DATA, DETECTION_DISTRIBUTION, MOCK_FACES } from './constants';
import { initializeBackend, getFaces, addFace, deleteFace } from './services/backend';
import { fetchCameras, registerCamera, connectWebSocket } from './services/apiService';
import { ShieldAlert, Search, X, UserX, AlertOctagon, PlusCircle, Server, Disc, Loader2, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

// --- Sub Components ---

const DashboardView = ({ 
  cameras, 
  currentTime, 
  setIsAddCamOpen, 
  setSelectedCamera 
}: { 
  cameras: Camera[], 
  currentTime: Date, 
  setIsAddCamOpen: (v: boolean) => void, 
  setSelectedCamera: (c: Camera) => void 
}) => (
  <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Live Overview</h1>
        <p className="text-slate-400 text-sm">Monitoring {cameras.length} active feeds • {currentTime.toLocaleTimeString()}</p>
      </div>
      <div className="flex gap-3">
           <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2 text-red-500 animate-pulse">
              <ShieldAlert size={18} />
              <span className="text-sm font-semibold">System Armed</span>
           </div>
           <button 
              onClick={() => setIsAddCamOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
           >
              <PlusCircle size={16} /> Add Camera
           </button>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {cameras.map(cam => (
        <CameraCard key={cam.id} camera={cam} onMaximize={setSelectedCamera} />
      ))}
      {cameras.length === 0 && (
        <div className="col-span-full py-20 flex flex-col items-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
           <Server size={48} className="mb-4" />
           <p>No backend connection or cameras found.</p>
           <p className="text-sm mt-2">Make sure the Python backend is running on port 8000.</p>
           <button onClick={() => setIsAddCamOpen(true)} className="text-blue-500 mt-2 hover:underline">Connect RTSP Stream</button>
        </div>
      )}
    </div>
  </div>
);

const ReviewView = ({ events }: { events: SecurityEvent[] }) => (
  <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
     <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white">Event Review</h1>
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
              type="text"
              placeholder="Search events..."
              className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64 focus:ring-1 focus:ring-blue-500 transition-all"
          />
      </div>
    </header>
    <div className="space-y-4 max-w-4xl">
       {events.length === 0 ? (
           <div className="text-slate-500">No events detected yet.</div>
       ) : (
           events.map((event, idx) => (
               <EventItem key={event.id || idx} event={event} />
           ))
       )}
    </div>
  </div>
);

const FaceIdView = () => {
    const [faces, setFaces] = useState<Person[]>([]);
    const [isAddFaceOpen, setIsAddFaceOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<any>('employee');
    const [faceImage, setFaceImage] = useState<string | null>(null);

    useEffect(() => {
        setFaces(getFaces());
    }, []);

    const handleAddFace = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && faceImage) {
            addFace({ name, type, thumbnail: faceImage });
            setFaces(getFaces());
            setIsAddFaceOpen(false);
            setName('');
            setFaceImage(null);
            alert("Person added to Face ID database.");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFaceImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

    const handleDeleteFace = (id: string) => {
        if(window.confirm('Are you sure you want to remove this person?')) {
            deleteFace(id);
            setFaces(getFaces());
        }
    };

    return (
    <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Face Recognition Database</h1>
          <button 
              onClick={() => setIsAddFaceOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
              <UserX size={16} /> Add Person
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faces.map(person => (
                <div key={person.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center hover:border-slate-600 transition-all relative group shadow-sm hover:shadow-lg">
                    <button 
                      onClick={() => handleDeleteFace(person.id)}
                      className="absolute top-2 right-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                        <X size={16}/>
                    </button>
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-slate-700 bg-slate-800">
                        <img src={person.thumbnail} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-white font-semibold">{person.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 uppercase font-bold ${
                        person.type === 'banned' ? 'bg-red-500/20 text-red-500' :
                        person.type === 'vip' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-blue-500/20 text-blue-500'
                    }`}>
                        {person.type}
                    </span>
                    <div className="w-full mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                        <span>Last seen</span>
                        <span>{new Date(person.lastSeen).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>

        {isAddFaceOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Register New Person</h2>
                        <button onClick={() => setIsAddFaceOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button>
                    </div>
                    <form onSubmit={handleAddFace} className="p-6 space-y-4">
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none"
                            placeholder="Full Name"
                        />
                        <select 
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none"
                        >
                            <option value="employee">Employee</option>
                            <option value="vip">VIP</option>
                            <option value="banned">Banned/Blacklisted</option>
                        </select>
                        <div className="border-2 border-dashed border-slate-800 rounded-lg p-4 text-center cursor-pointer relative">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" required={!faceImage} />
                            {faceImage ? <img src={faceImage} alt="Preview" className="h-20 mx-auto rounded-full" /> : <span className="text-slate-500 text-sm">Upload Photo</span>}
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold">Register ID</button>
                    </form>
                </div>
            </div>
        )}
    </div>
)};

const AnalyticsView = () => {
  const COLORS = ['#3b82f6', '#ef4444', '#eab308', '#a855f7'];

  return (
    <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-white mb-6">System Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-200">Events (Last 24h)</h3>
                  <Activity size={16} className="text-slate-500"/>
              </div>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ANALYTICS_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }} cursor={{fill: '#1e293b'}} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
               <h3 className="text-lg font-semibold text-slate-200 mb-4">Detection Types</h3>
               <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={DETECTION_DISTRIBUTION} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                              {DETECTION_DISTRIBUTION.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      </PieChart>
                  </ResponsiveContainer>
               </div>
          </div>
      </div>
    </div>
  );
};

const SettingsView = () => (
    <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
        <h1 className="text-2xl font-bold text-white mb-6">System Settings</h1>
        <div className="max-w-2xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">Storage</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-400">
                        <span>Retention Period</span>
                        <select className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-sm"><option>7 Days</option><option>30 Days</option></select>
                    </div>
                </div>
            </div>
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">Backend Connection</h3>
                <p className="text-slate-400 text-sm mb-2">Connected to: <span className="text-blue-400">ws://localhost:8000/ws</span></p>
            </div>
        </div>
    </div>
);

const BannedView = () => {
    const [faces, setFaces] = useState<Person[]>([]);
    
    useEffect(() => {
        setFaces(getFaces());
    }, []);

    return (
    <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
         <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Banned Individuals</h1>
        </header>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faces.filter(p => p.type === 'banned').map(person => (
                <div key={person.id} className="bg-slate-900 border border-red-900/30 rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-red-600 text-white text-[10px] font-bold uppercase">Banned</div>
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-red-600 grayscale bg-slate-800">
                        <img src={person.thumbnail} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-white font-semibold">{person.name}</h3>
                </div>
            ))}
        </div>
    </div>
)};

const TheftView = () => (
    <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
        <header className="mb-6 border-b border-slate-800 pb-6">
           <div className="flex items-center gap-3 mb-2">
               <AlertOctagon size={32} className="text-red-500" />
               <h1 className="text-2xl font-bold text-white">Active Theft Alerts</h1>
           </div>
           <p className="text-slate-400">High priority incidents requiring immediate attention.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
               <ShieldAlert size={48} className="mx-auto mb-4 opacity-50"/>
               <p>No active theft alerts detected.</p>
           </div>
        </div>
    </div>
);

// --- Main App ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  
  // Add Camera State
  const [isAddCamOpen, setIsAddCamOpen] = useState(false);
  const [newCamName, setNewCamName] = useState('');
  const [newCamUrl, setNewCamUrl] = useState('');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [trainingDraft, setTrainingDraft] = useState<{image: string, description: string} | null>(null);

  useEffect(() => {
    initializeBackend();
    
    // Load cameras from Backend
    const loadCameras = async () => {
      const cams = await fetchCameras();
      setCameras(cams);
    };
    loadCameras();

    // Connect WebSocket
    const ws = connectWebSocket((data) => {
        if (data.type === 'detection') {
            const newEvent: SecurityEvent = {
                id: `evt-${Date.now()}`,
                type: data.label === 'person' ? 'person' : 'vehicle',
                severity: 'medium',
                timestamp: new Date().toISOString(),
                cameraName: 'Camera ' + data.camera_id, // Simplify for now
                description: `${data.label} detected with ${(data.confidence * 100).toFixed(0)}% confidence`,
                thumbnail: '', // In a real app, backend sends a thumbnail URL here
                isReviewed: false
            };
            setEvents(prev => [newEvent, ...prev]);
        }
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
        clearInterval(timer);
        ws.close();
    };
  }, []);

  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCamName && newCamUrl) {
      const id = `c-${Date.now()}`;
      await registerCamera(id, newCamName, newCamUrl);
      const updated = await fetchCameras();
      setCameras(updated);
      setIsAddCamOpen(false);
      setNewCamName('');
      setNewCamUrl('');
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
        setIsRecording(false);
        if (selectedCamera) {
            const confirmTrain = window.confirm("Clip Captured! \n\nDo you want to send this footage to the AI Training module?");
            if (confirmTrain) {
                setTrainingDraft({
                    image: selectedCamera.thumbnail, 
                    description: `Footage captured from ${selectedCamera.name}`
                });
                setSelectedCamera(null);
                setCurrentView('training');
            }
        }
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 relative">
        {currentView === 'dashboard' && <DashboardView cameras={cameras} currentTime={currentTime} setIsAddCamOpen={setIsAddCamOpen} setSelectedCamera={setSelectedCamera} />}
        {currentView === 'review' && <ReviewView events={events} />}
        {currentView === 'face-id' && <FaceIdView />}
        {currentView === 'training' && <TrainingView initialData={trainingDraft} onClearInitialData={() => setTrainingDraft(null)} />}
        {currentView === 'theft' && <TheftView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'banned' && <BannedView />}
      </main>

      {/* Instant Playback / Maximized Camera */}
      {selectedCamera && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200">
           <div className="w-full max-w-6xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-full">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                   <div>
                       <h2 className="text-xl font-bold text-white flex items-center gap-2">
                           {selectedCamera.name}
                           <span className="text-xs font-normal text-red-500 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20">LIVE</span>
                       </h2>
                   </div>
                   <button onClick={() => setSelectedCamera(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                       <X size={24} />
                   </button>
               </div>
               
               <div className="relative aspect-video bg-black group">
                   <CameraFeed camera={selectedCamera} />
                   
                   {/* Recording Overlay */}
                   {isRecording && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                           <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold animate-pulse flex items-center gap-3">
                               <Disc size={20} className="animate-spin" /> Recording Clip...
                           </div>
                       </div>
                   )}
               </div>

               <div className="p-6 bg-slate-950 grid grid-cols-4 gap-4">
                    <button 
                        onClick={handleStartRecording}
                        disabled={isRecording}
                        className={`col-span-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                            isRecording 
                            ? 'bg-red-900/50 text-red-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                    >
                        {isRecording ? <Loader2 className="animate-spin" /> : <Disc />}
                        {isRecording ? 'Capturing...' : 'Record Clip'}
                    </button>
               </div>
           </div>
        </div>
      )}

      {/* Add Camera Modal */}
      {isAddCamOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white">Add Camera</h2>
                      <button onClick={() => setIsAddCamOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button>
                  </div>
                  <form onSubmit={handleAddCamera} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Camera Name</label>
                          <input 
                              type="text" 
                              required
                              value={newCamName}
                              onChange={e => setNewCamName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none"
                              placeholder="e.g., North Hallway"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">RTSP Stream URL</label>
                          <input 
                              type="text" 
                              required
                              value={newCamUrl}
                              onChange={e => setNewCamUrl(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none"
                              placeholder="rtsp://admin:password@192.168.1.100:554/stream1"
                          />
                          <p className="text-xs text-slate-500 mt-2">
                             Enter the full RTSP or HTTP stream URL. The backend will proxy this stream.
                          </p>
                      </div>
                      <div className="pt-2">
                          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold shadow-lg shadow-blue-900/20">
                              Connect Feed
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
