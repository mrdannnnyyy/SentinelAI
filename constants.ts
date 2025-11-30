
import { Camera, Person, SecurityEvent, TheftAlert } from './types';
import { generateFaceThumbnail, generateEventThumbnail } from './services/utils';

// We use the generator to ensure "download and run" works without broken external links
export const MOCK_CAMERAS: Camera[] = [
  { id: 'c1', name: 'Front Entrance', location: 'Main Lobby', status: 'online', type: 'simulated-office', rtspUrl: 'mock-stream', fps: 30, resolution: '4K', isRecording: true, thumbnail: '' },
  { id: 'c2', name: 'Parking Lot A', location: 'Exterior North', status: 'online', type: 'simulated-outdoor', rtspUrl: 'mock-stream', fps: 24, resolution: '1080p', isRecording: true, thumbnail: '' },
  { id: 'c3', name: 'Warehouse Bay 4', location: 'Storage', status: 'online', type: 'simulated-warehouse', rtspUrl: 'mock-stream', fps: 15, resolution: '1080p', isRecording: false, thumbnail: '' },
];

export const MOCK_EVENTS: SecurityEvent[] = [
  { id: 'e1', type: 'person', severity: 'medium', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), cameraName: 'Front Entrance', description: 'Unknown male loitering near door', thumbnail: generateEventThumbnail('person'), isReviewed: false },
  { id: 'e2', type: 'theft', severity: 'critical', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), cameraName: 'Cash Register 1', description: 'Object removed from counter without scan', thumbnail: generateEventThumbnail('theft'), isReviewed: false },
  { id: 'e3', type: 'vehicle', severity: 'low', timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(), cameraName: 'Parking Lot A', description: 'Delivery truck arrival', thumbnail: generateEventThumbnail('vehicle'), isReviewed: true },
];

export const MOCK_FACES: Person[] = [
  { id: 'p1', name: 'Alice Smith', type: 'employee', lastSeen: new Date().toISOString(), confidence: 0.98, thumbnail: generateFaceThumbnail('Alice Smith', 'employee') },
  { id: 'p2', name: 'John Doe', type: 'banned', lastSeen: new Date(Date.now() - 86400000).toISOString(), confidence: 0.92, thumbnail: generateFaceThumbnail('John Doe', 'banned') },
  { id: 'p3', name: 'Sarah Connor', type: 'vip', lastSeen: new Date(Date.now() - 43200000).toISOString(), confidence: 0.99, thumbnail: generateFaceThumbnail('Sarah Connor', 'vip') },
];

export const MOCK_THEFT_ALERTS: TheftAlert[] = [
  { id: 't1', item: 'Electronics Package', location: 'Warehouse Bay 4', timestamp: new Date().toISOString(), status: 'active', thumbnail: generateEventThumbnail('theft') },
];

export const ANALYTICS_DATA = [
  { time: '00:00', value: 12 },
  { time: '04:00', value: 8 },
  { time: '08:00', value: 45 },
  { time: '12:00', value: 89 },
  { time: '16:00', value: 67 },
  { time: '20:00', value: 34 },
];

export const DETECTION_DISTRIBUTION = [
  { name: 'Person', value: 400 },
  { name: 'Vehicle', value: 300 },
  { name: 'Motion', value: 300 },
  { name: 'Face', value: 200 },
];