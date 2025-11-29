
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CameraCard from './components/CameraCard';
import EventItem from './components/EventItem';
import TrainingView from './components/TrainingView';
import { ViewState, Camera, Person } from './types';
import { MOCK_EVENTS, ANALYTICS_DATA, DETECTION_DISTRIBUTION } from './constants';
import { initializeBackend, getCameras, addCamera, getFaces, getEvents, addFace, deleteFace } from './services/backend';
import { ShieldAlert, Search, Bell, X, UserX, AlertOctagon, PlusCircle, Server, Disc, Loader2, Upload, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

// --- SUB-COMPONENTS DEFINED OUTSIDE APP TO PREVENT RE-RENDERS ---

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
           <p>No cameras connected.</p>
           <button onClick={() => setIsAddCamOpen(true)} className="text-blue-500 mt-2 hover:underline">Connect RTSP Stream</button>
        </div>
      )}
    </div>
  </div>
);

const ReviewView = () => (
  <div className="h-full overflow-y-auto p-6 animate-in fade-in duration-300">
     <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white">Event Review</h1>
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
              type="text"
              placeholder="Search events, objects..."
              className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64 focus:ring-1 focus:ring-blue-500 transition-all"
          />
      </div>
    </header>
    <div className="space-y-4 max-w-4xl">
       {getEvents().map(event => (
           <EventItem key={event.id} event={event as any} />
       ))}
    </div>
  </div>
);

const FaceIdView = () => {
    const [faces, setFaces] = useState<Person[]>([]);
    const [isAddFaceOpen, setIsAddFaceOpen] = useState(false);
    
    // Face Form
    const [name, setName] = useState('');
    const [type, setType] = useState<any>('employee');
    const [faceImage, setFaceImage] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        setFaces(getFaces());
    }, []);

    const handleAddFace = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && faceImage) {
            addFace({
                name,
                type,
                thumbnail: faceImage
            });
            // Refresh list
            setFaces(getFaces());
            setIsAddFaceOpen(false);
            // Reset form
            setName('');
            setFaceImage(null);
            alert("Person added to Face ID database.");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFaceImage(reader.result as string);
        };
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
            {faces.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    <p>No faces registered in the database.</p>
                </div>
            )}
        </div>

        {/* Add Face Modal */}
        {isAddFaceOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Register New Person</h2>
                        <button onClick={() => setIsAddFaceOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button>
                    </div>
                    <form onSubmit={handleAddFace} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                                placeholder="Enter name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Classification</label>
                            <select 
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                            >
                                <option value="employee">Employee</option>
                                <option value="vip">VIP</option>
                                <option value="banned">Banned/Blacklisted</option>
                                <option value="known">Known Visitor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Face Image</label>
                            <div className="border-2 border-dashed border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center relative hover:border-slate-600 transition-colors bg-slate-950/50">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" required={!faceImage} />
                                {faceImage ? (
                                    <div className="relative">
                                         <img src={faceImage} alt="Preview" className="h-24 w-24 rounded-full object-cover border-2 border-slate-600" />
                                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                             <Upload size={16} className="text-white"/>
                                         </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto text-slate-500 mb-2" size={20}/>
                                        <span className="text-xs text-slate-400">Upload Photo</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold mt-2 shadow-lg shadow-blue-900/20">
                            Register ID
                        </button>
                    </form>
                </div>
            </div>
        )}
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
            <div className="bg-slate-900 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] rounded-xl overflow-hidden flex flex-col">
                <div className="h-48 relative">
                    <img src="https://picsum.photos/id/180/300/200" alt="Theft" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse shadow-lg">
                        ACTIVE
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Electronics Package Detected</h3>
                            <p className="text-red-400 text-sm font-medium">Warehouse Bay 4</p>
                        </div>
                        <span className="text-slate-500 text-sm font-mono">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                            Dispatch Security
                        </button>
                        <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg text-sm font-medium transition-colors">
                            Mark False Positive
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

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
                          <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                              cursor={{fill: '#1e293b'}}
                          />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
               <h3 className="text-lg font-semibold text-slate-200 mb-4">Detection Types Distribution</h3>
               <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={DETECTION_DISTRIBUTION}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                          >
                              {DETECTION_DISTRIBUTION.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex justify-center gap-4 mt-2">
                    {DETECTION_DISTRIBUTION.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            <span className="text-xs text-slate-400">{entry.name}</span>
                        </div>
                    ))}
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
                <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">Storage Configuration</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Retention Period</span>
                        <select className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-3 py-1 text-sm outline-none focus:border-blue-500">
                            <option>7 Days</option>
                            <option>30 Days</option>
                            <option>90 Days</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-slate-400">Cloud Backup</span>
                         <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                             <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                         </div>
                    </div>
                </div>
            </div>

             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">AI Sensitivity</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-400 text-sm">Motion Threshold</span>
                            <span className="text-slate-200 text-sm">65%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-400 text-sm">Face Recognition Confidence</span>
                            <span className="text-slate-200 text-sm">85%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>
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
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-4">
            <ShieldAlert className="text-red-500" size={32} />
            <div>
                <h2 className="text-red-400 font-bold text-lg">Blacklist Enforcement Active</h2>
                <p className="text-red-400/70 text-sm">System is actively scanning for banned individuals across all perimeter cameras.</p>
            </div>
        </div>
         <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Banned Individuals</h1>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Export List</button>
        </header>
        
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faces.filter(p => p.type === 'banned').map(person => (
                <div key={person.id} className="bg-slate-900 border border-red-900/30 rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden hover:border-red-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-2 bg-red-600 text-white text-[10px] font-bold uppercase">Banned</div>
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-red-600 grayscale bg-slate-800">
                        <img src={person.thumbnail} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-white font-semibold">{person.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">ID: #{person.id.substring(0,6)}</p>
                </div>
            ))}
            {faces.filter(p => p.type === 'banned').length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                    <p>No banned individuals on file.</p>
                </div>
            )}
        </div>
    </div>
)};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cameras, setCameras] = useState<Camera[]>([]);
  
  // Add Camera Modal State
  const [isAddCamOpen, setIsAddCamOpen] = useState(false);
  const [newCamUrl, setNewCamUrl] = useState('');
  const [newCamName, setNewCamName] = useState('');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Training Data State (Passed from Live View to Training)
  const [trainingDraft, setTrainingDraft] = useState<{image: string, description: string} | null>(null);

  // Initialization
  useEffect(() => {
    initializeBackend();
    setCameras(getCameras());

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer for Recording UI
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCamName && newCamUrl) {
      addCamera({
        name: newCamName,
        location: 'Custom Location',
        status: 'online',
        rtspUrl: newCamUrl,
        thumbnail: 'https://picsum.photos/800/450?random=' + Date.now(), // Placeholder for demo
        fps: 30,
        resolution: '1080p',
        isRecording: true
      });
      setCameras(getCameras());
      setIsAddCamOpen(false);
      setNewCamName('');
      setNewCamUrl('');
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording stop after 3 seconds for demo purposes
    // In real app, user would click stop
    setTimeout(() => {
        setIsRecording(false);
        if (selectedCamera) {
            const confirmTrain = window.confirm("Clip Captured! \n\nDo you want to send this footage to the AI Training module to improve detection?");
            if (confirmTrain) {
                // Pass data to training view
                setTrainingDraft({
                    image: selectedCamera.thumbnail, // In real app, this would be the video clip URL
                    description: `Footage captured from ${selectedCamera.name} at ${new Date().toLocaleTimeString()}`
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
        {/* View Routing */}
        {currentView === 'dashboard' && <DashboardView cameras={cameras} currentTime={currentTime} setIsAddCamOpen={setIsAddCamOpen} setSelectedCamera={setSelectedCamera} />}
        {currentView === 'review' && <ReviewView />}
        {currentView === 'face-id' && <FaceIdView />}
        {currentView === 'training' && <TrainingView initialData={trainingDraft} onClearInitialData={() => setTrainingDraft(null)} />}
        {currentView === 'theft' && <TheftView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'banned' && <BannedView />}
      </main>

      {/* Instant Playback Modal / Maximized Camera */}
      {selectedCamera && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200">
           <div className="w-full max-w-6xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-full">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                   <div>
                       <h2 className="text-xl font-bold text-white flex items-center gap-2">
                           {selectedCamera.name}
                           <span className="text-xs font-normal text-red-500 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20">LIVE</span>
                       </h2>
                       <p className="text-sm text-slate-500 flex items-center gap-2">
                           {selectedCamera.location} 
                           <span className="text-slate-600">|</span> 
                           <span className="text-xs font-mono bg-slate-800 px-1 rounded">{selectedCamera.rtspUrl ? 'RTSP' : 'SIMULATED'}</span>
                       </p>
                   </div>
                   <button onClick={() => setSelectedCamera(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                       <X size={24} />
                   </button>
               </div>
               
               <div className="relative aspect-video bg-black group">
                   <img src={selectedCamera.thumbnail} className="w-full h-full object-cover opacity-90" alt="Full feed"/>
                   
                   {/* Fake scrubber */}
                   <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end px-6 pb-4">
                       <div className="w-full">
                           <div className="flex justify-between text-xs text-slate-300 mb-2 font-mono">
                               <span>-00:30</span>
                               <span className="text-red-500 font-bold flex items-center gap-2">
                                 {isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                 {isRecording ? `REC 00:0${recordingDuration}` : 'LIVE'}
                               </span>
                           </div>
                           <div className="h-1 bg-slate-700 rounded-full relative overflow-hidden">
                               <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-500"></div>
                           </div>
                       </div>
                   </div>

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
                     <button className="col-span-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium shadow-lg shadow-blue-900/10">
                        Instant Replay (30s)
                    </button>
                    <button className="col-span-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium">
                        Take Snapshot
                    </button>
                    <button className="col-span-1 border border-red-500/50 text-red-500 hover:bg-red-950 py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                        <Bell size={18} /> Trigger Alarm
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
                      <h2 className="text-xl font-bold text-white">Add New Camera</h2>
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
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
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
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                              placeholder="rtsp://admin:12345@192.168.1.100:554/stream1"
                          />
                          <p className="text-xs text-slate-500 mt-1">Note: RTSP stream requires backend proxy (e.g., node-rtsp-stream) to render in browser. This demo will simulate connection.</p>
                      </div>
                      <div className="pt-2">
                          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold shadow-lg shadow-blue-900/20">
                              Connect Stream
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
