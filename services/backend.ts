
import { Camera, SecurityEvent, Person, TrainingModel, TheftAlert } from '../types';
import { MOCK_CAMERAS, MOCK_EVENTS, MOCK_FACES, MOCK_THEFT_ALERTS } from '../constants';

/**
 * MOCK BACKEND SERVICE
 * 
 * In a production environment, this would be a Node.js/Python server 
 * connecting to a PostgreSQL/MongoDB database and an RTSP stream processor.
 * 
 * Here, we use localStorage to simulate data persistence and backend logic.
 */

const STORAGE_KEYS = {
  CAMERAS: 'sentinel_cameras',
  EVENTS: 'sentinel_events',
  FACES: 'sentinel_faces',
  ALERTS: 'sentinel_alerts',
  TRAINING: 'sentinel_training_data'
};

// --- INITIALIZATION ---

export const initializeBackend = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CAMERAS)) {
    localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(MOCK_CAMERAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(MOCK_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FACES)) {
    localStorage.setItem(STORAGE_KEYS.FACES, JSON.stringify(MOCK_FACES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(MOCK_THEFT_ALERTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRAINING)) {
    localStorage.setItem(STORAGE_KEYS.TRAINING, JSON.stringify([]));
  }
};

// --- CAMERAS ---

export const getCameras = (): Camera[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMERAS) || '[]');
};

export const addCamera = (camera: Omit<Camera, 'id'>) => {
  const cameras = getCameras();
  const newCamera: Camera = { ...camera, id: `c-${Date.now()}` };
  cameras.push(newCamera);
  localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras));
  return newCamera;
};

// --- AI TRAINING DATA ---

export const getTrainingModels = (): TrainingModel[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAINING) || '[]');
};

export const addTrainingModel = (model: Omit<TrainingModel, 'id' | 'dateAdded'>) => {
  const models = getTrainingModels();
  const newModel: TrainingModel = { 
    ...model, 
    id: `tm-${Date.now()}`, 
    dateAdded: new Date().toISOString() 
  };
  models.push(newModel);
  try {
    localStorage.setItem(STORAGE_KEYS.TRAINING, JSON.stringify(models));
  } catch (e) {
    console.error("Storage limit reached", e);
    alert("Local storage full! In a real app, this would be saved to the cloud.");
  }
  return newModel;
};

export const deleteTrainingModel = (id: string) => {
  const models = getTrainingModels().filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRAINING, JSON.stringify(models));
};

// --- EVENTS ---

export const getEvents = (): SecurityEvent[] => {
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  return events.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// --- FACES ---

export const getFaces = (): Person[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FACES) || '[]');
};

export const addFace = (person: Omit<Person, 'id' | 'lastSeen' | 'confidence'>) => {
    const faces = getFaces();
    const newPerson: Person = {
        ...person,
        id: `p-${Date.now()}`,
        lastSeen: new Date().toISOString(),
        confidence: 0.0 // Initial confidence is 0 until seen
    };
    faces.push(newPerson);
    localStorage.setItem(STORAGE_KEYS.FACES, JSON.stringify(faces));
    return newPerson;
};

export const deleteFace = (id: string) => {
    const faces = getFaces().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.FACES, JSON.stringify(faces));
};
