
/**
 * Utility to generate local assets so the app works offline without external placeholders.
 */

// Generates a random color hex
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Generates a base64 image for a person/face
export const generateFaceThumbnail = (name: string, type: 'banned' | 'employee' | 'vip' | 'known') => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background
    ctx.fillStyle = type === 'banned' ? '#450a0a' : type === 'vip' ? '#3b0764' : '#172554';
    ctx.fillRect(0, 0, 100, 100);

    // "Head"
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(50, 40, 25, 0, Math.PI * 2);
    ctx.fill();

    // "Body"
    ctx.beginPath();
    ctx.arc(50, 110, 50, 0, Math.PI * 2);
    ctx.fill();

    // Initial
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name.charAt(0).toUpperCase(), 50, 50);

    return canvas.toDataURL('image/jpeg');
};

// Generates a generic thumbnail for events
export const generateEventThumbnail = (eventType: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 320, 180);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < 320; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 180); ctx.stroke();
    }
    for (let i = 0; i < 180; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(320, i); ctx.stroke();
    }

    // Draw Event Type Text
    ctx.fillStyle = '#64748b';
    ctx.font = '20px monospace';
    ctx.fillText(`REC: ${eventType.toUpperCase()}`, 20, 30);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(280, 10, 10, 10); // Red dot

    return canvas.toDataURL('image/jpeg');
};

/**
 * Draws a simulated CCTV feed onto a provided Canvas Context.
 * Used by the CameraFeed component to animate a "live" view.
 */
export const drawSimulatedFeed = (ctx: CanvasRenderingContext2D, width: number, height: number, type: string, time: number) => {
    // 1. Clear & Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. Environment (Simplified)
    if (type === 'simulated-outdoor') {
        ctx.fillStyle = '#1a2e1a'; // Dark green ground
        ctx.fillRect(0, height / 2, width, height / 2);
        ctx.fillStyle = '#0f172a'; // Sky
        ctx.fillRect(0, 0, width, height / 2);
    } else if (type === 'simulated-warehouse') {
        ctx.fillStyle = '#333333'; // Concrete floor
        ctx.fillRect(0, 0, width, height);
        // Racks
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 40, 20, height - 80);
        ctx.fillRect(width - 60, 40, 20, height - 80);
    } else {
        // Office
        ctx.fillStyle = '#f1f5f9'; // Wall
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#cbd5e1'; // Floor
        ctx.fillRect(0, height * 0.7, width, height * 0.3);
    }

    // 3. Moving Objects (Simulation)
    const speed = 0.05;
    const xPos = (time * speed) % (width + 100) - 50;
    
    ctx.fillStyle = '#2563eb'; // Person (Blue box)
    ctx.fillRect(xPos, height * 0.6, 20, 40);
    
    // Head
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(xPos + 10, height * 0.6 - 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // 4. Overlay Data
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, width, 24);
    
    ctx.fillStyle = '#22c55e';
    ctx.font = '10px monospace';
    ctx.fillText(new Date().toLocaleTimeString(), width - 70, 16);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText("CAM-01 LIVE", 10, 16);

    // 5. Noise / Grain
    // Calculating random noise is expensive for JS canvas every frame, 
    // so we just add a scanline effect
    const scanLineY = (time * 2) % height;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, scanLineY, width, 2);
};
