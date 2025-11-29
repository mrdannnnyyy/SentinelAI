import { Camera, Person, SecurityEvent, TheftAlert } from './types';

export const MOCK_CAMERAS: Camera[] = [
  { id: 'c1', name: 'Front Entrance', location: 'Main Lobby', status: 'online', thumbnail: 'https://picsum.photos/id/237/800/450', fps: 30, resolution: '4K', isRecording: true },
  { id: 'c2', name: 'Parking Lot A', location: 'Exterior North', status: 'online', thumbnail: 'https://picsum.photos/id/111/800/450', fps: 24, resolution: '1080p', isRecording: true },
  { id: 'c3', name: 'Warehouse Bay 4', location: 'Storage', status: 'online', thumbnail: 'https://picsum.photos/id/180/800/450', fps: 15, resolution: '1080p', isRecording: false },
  { id: 'c4', name: 'Cash Register 1', location: 'Retail Floor', status: 'online', thumbnail: 'https://picsum.photos/id/20/800/450', fps: 60, resolution: '4K', isRecording: true },
  { id: 'c5', name: 'Back Alley', location: 'Exterior South', status: 'offline', thumbnail: 'https://picsum.photos/id/10/800/450', fps: 0, resolution: 'N/A', isRecording: false },
  { id: 'c6', name: 'Server Room', location: 'Secure Zone', status: 'online', thumbnail: 'https://picsum.photos/id/60/800/450', fps: 30, resolution: '2K', isRecording: true },
];

export const MOCK_EVENTS: SecurityEvent[] = [
  { id: 'e1', type: 'person', severity: 'medium', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), cameraName: 'Front Entrance', description: 'Unknown male loitering near door', thumbnail: 'https://picsum.photos/id/1005/200/200', isReviewed: false },
  { id: 'e2', type: 'theft', severity: 'critical', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), cameraName: 'Cash Register 1', description: 'Object removed from counter without scan', thumbnail: 'https://picsum.photos/id/1025/200/200', isReviewed: false },
  { id: 'e3', type: 'vehicle', severity: 'low', timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(), cameraName: 'Parking Lot A', description: 'Delivery truck arrival', thumbnail: 'https://picsum.photos/id/1070/200/200', isReviewed: true },
  { id: 'e4', type: 'face', severity: 'high', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), cameraName: 'Main Lobby', description: 'Banned individual detected: John Doe', thumbnail: 'https://picsum.photos/id/1062/200/200', isReviewed: false },
];

export const MOCK_FACES: Person[] = [
  { id: 'p1', name: 'Alice Smith', type: 'employee', lastSeen: new Date().toISOString(), confidence: 0.98, thumbnail: 'https://picsum.photos/id/338/100/100' },
  { id: 'p2', name: 'John Doe', type: 'banned', lastSeen: new Date(Date.now() - 86400000).toISOString(), confidence: 0.92, thumbnail: 'https://picsum.photos/id/64/100/100' },
  { id: 'p3', name: 'Sarah Connor', type: 'vip', lastSeen: new Date(Date.now() - 43200000).toISOString(), confidence: 0.99, thumbnail: 'https://picsum.photos/id/65/100/100' },
  { id: 'p4', name: 'Unknown #402', type: 'known', lastSeen: new Date().toISOString(), confidence: 0.65, thumbnail: 'https://picsum.photos/id/91/100/100' },
];

export const MOCK_THEFT_ALERTS: TheftAlert[] = [
  { id: 't1', item: 'Electronics Package', location: 'Warehouse Bay 4', timestamp: new Date().toISOString(), status: 'active', thumbnail: 'https://picsum.photos/id/180/300/200' },
  { id: 't2', item: 'Cash Bundle', location: 'Cash Register 1', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'resolved', thumbnail: 'https://picsum.photos/id/20/300/200' },
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
