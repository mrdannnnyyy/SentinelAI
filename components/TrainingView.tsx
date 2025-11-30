
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Upload, Trash2, Plus, Check, Video, Image as ImageIcon } from 'lucide-react';
import { getTrainingModels, addTrainingModel, deleteTrainingModel } from '../services/backend';
import { TrainingModel } from '../types';

interface TrainingViewProps {
  initialData?: {
    image?: string;
    description?: string;
  } | null;
  onClearInitialData?: () => void;
}

const TrainingView: React.FC<TrainingViewProps> = ({ initialData, onClearInitialData }) => {
  const [models, setModels] = useState<TrainingModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<'person' | 'object' | 'vehicle'>('object');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState<'image' | 'video'>('image');
  const [uploadedData, setUploadedData] = useState<string | null>(null);

  useEffect(() => {
    refreshModels();
    if (initialData) {
        setIsModalOpen(true);
        if (initialData.image) setUploadedData(initialData.image);
        if (initialData.description) setDescription(initialData.description);
        setDataType('image');
    }
  }, [initialData]);

  const refreshModels = () => {
    setModels(getTrainingModels());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedData || !label) return;

    addTrainingModel({
      label,
      category,
      dataType,
      description,
      dataUrl: uploadedData
    });

    setLabel('');
    setDescription('');
    setUploadedData(null);
    setDataType('image');
    setIsModalOpen(false);
    if (onClearInitialData) onClearInitialData();
    refreshModels();
  };

  const handleDelete = (id: string) => {
    deleteTrainingModel(id);
    refreshModels();
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setUploadedData(null);
      setLabel('');
      if (onClearInitialData) onClearInitialData();
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
             <BrainCircuit className="text-purple-500" /> AI Model Training
           </h1>
           <p className="text-slate-400 text-sm">Teach Sentinel to recognize specific people, uniforms, or assets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> New Model
        </button>
      </header>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="aspect-square relative bg-black flex items-center justify-center">
              {model.dataType === 'video' ? (
                  <>
                    <Video className="text-slate-600 absolute z-0" size={48} />
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                        <Video className="text-white/80" size={32} />
                    </div>
                  </>
              ) : (
                <img src={model.dataUrl || ''} alt={model.label} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 z-20">
                 <div className="flex justify-between items-end">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 block">{model.category}</span>
                        <h3 className="text-white font-bold text-lg leading-tight">{model.label}</h3>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => handleDelete(model.id)}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-600/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-30"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-400 line-clamp-2">{model.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>Added {new Date(model.dateAdded).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-green-500"><Check size={12}/> Active</span>
              </div>
            </div>
          </div>
        ))}
        {models.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
             <BrainCircuit size={48} className="mb-4 opacity-50" />
             <p>No custom models trained yet.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-800">
               <h2 className="text-xl font-bold text-white">Train New Model</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Label Name</label>
                  <input type="text" required value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g., Red Backpack" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <select value={category} onChange={(e: any) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none">
                    <option value="object">Object</option>
                    <option value="person">Person</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
               </div>
               <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">Data Type</label>
                   <div className="flex gap-4 mb-4">
                       <button type="button" onClick={() => { setDataType('image'); setUploadedData(null); }} className={`flex-1 py-2 rounded-lg border ${dataType === 'image' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'border-slate-700 text-slate-400'}`}>Image</button>
                       <button type="button" onClick={() => { setDataType('video'); setUploadedData(null); }} className={`flex-1 py-2 rounded-lg border ${dataType === 'video' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'border-slate-700 text-slate-400'}`}>Video</button>
                   </div>
                  <div className="border-2 border-dashed border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden">
                     <input type="file" accept={dataType === 'image' ? "image/*" : "video/*"} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                     {uploadedData ? ( dataType === 'image' ? <img src={uploadedData} alt="Preview" className="h-32 object-contain" /> : <span className="text-green-400">Video Selected</span> ) : <span className="text-sm text-slate-400">Click to upload</span>}
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none h-24 resize-none" />
               </div>
               <div className="flex gap-3 pt-4">
                  <button type="button" onClick={handleCloseModal} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-bold">Train Model</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingView;
