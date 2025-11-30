/**
 * API Service for communicating with the Python FastAPI Backend.
 * Ensure the backend is running on http://localhost:8000
 */

const API_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws';

export const getStreamUrl = (cameraId: string) => `${API_URL}/stream/${cameraId}`;

export const fetchCameras = async () => {
  try {
    const res = await fetch(`${API_URL}/cameras`);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Backend offline. Ensure Docker container is running.", error);
    return [];
  }
};

export const registerCamera = async (id: string, name: string, url: string) => {
  try {
    const params = new URLSearchParams({ id, name, url });
    const res = await fetch(`${API_URL}/cameras/add?${params}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error("Failed to register camera");
    return await res.json();
  } catch (error) {
    console.error("Failed to add camera:", error);
    throw error;
  }
};

export const connectWebSocket = (onMessage: (data: any) => void) => {
  try {
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => console.log("Connected to AI Event Stream");
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };
  
    ws.onclose = () => console.log("Disconnected from AI Stream");
    ws.onerror = (e) => console.error("WebSocket Error:", e);
    
    return ws;
  } catch (e) {
    console.error("Could not create WebSocket", e);
    // Return dummy object to prevent crash
    return { close: () => {} } as WebSocket;
  }
};
