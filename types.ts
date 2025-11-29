
export type ViewState = 'dashboard' | 'review' | 'face-id' | 'analytics' | 'banned' | 'theft' | 'settings' | 'training';

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  thumbnail: string; // Acts as the current frame for simulation
  rtspUrl?: string; // The backend connection string
  fps: number;
  resolution: string;
  isRecording: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'motion' | 'person' | 'vehicle' | 'face' | 'theft';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string; // ISO string for storage
  cameraName: string;
  description: string;
  thumbnail: string;
  isReviewed: boolean;
}

export interface Person {
  id: string;
  name: string;
  type: 'known' | 'employee' | 'banned' | 'vip';
  lastSeen: string;
  confidence: number;
  thumbnail: string;
}

export interface TrainingModel {
  id: string;
  label: string;
  category: 'person' | 'object' | 'vehicle';
  dataType: 'image' | 'video';
  dataUrl: string; // Base64 string of reference image or video thumbnail
  description: string;
  dateAdded: string;
}

export interface TheftAlert {
  id: string;
  item: string;
  location: string;
  timestamp: string;
  status: 'active' | 'resolved';
  thumbnail: string;
}
