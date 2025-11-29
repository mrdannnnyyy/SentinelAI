
import { GoogleGenAI } from "@google/genai";
import { getTrainingModels } from "./backend";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a CCTV frame with context from the "Training" database.
 * This simulates a fine-tuned or few-shot learning model.
 */
export const analyzeFrame = async (base64Image: string): Promise<string> => {
  try {
    // 1. Fetch Training Data (Simulating Backend Retrieval)
    const trainingModels = getTrainingModels();
    
    // 2. Construct the prompt with training context
    let promptText = "Analyze this CCTV frame in detail. Identify any security threats, people, or vehicles.";
    
    const parts: any[] = [];

    // Add training examples to the prompt (Few-Shot Learning)
    if (trainingModels.length > 0) {
      promptText += "\n\nI have provided reference images for specific known objects/people below. Please check if any of these are present in the final frame:";
      
      trainingModels.forEach((model, index) => {
        // Skip video data for single-frame analysis to avoid payload issues, 
        // unless we have a thumbnail. Assuming dataUrl is a thumbnail for videos in this context.
        if (model.dataType === 'video') {
            promptText += `\n- Reference ${index + 1} (VIDEO SOURCE): ${model.label} (${model.category}). ${model.description}`;
            // If the video dataUrl is actually a thumbnail image base64, we can include it.
            // If it is a full video base64, we should skip it for 'generateContent' to prevent size errors.
            // For this app, we assume dataUrl is an image representation even for videos.
             if (model.dataUrl && model.dataUrl.startsWith('data:image')) {
                 parts.push({
                    inlineData: {
                        mimeType: 'image/jpeg', 
                        data: model.dataUrl.split(',')[1] 
                    }
                 });
             }
        } else {
            promptText += `\n- Reference ${index + 1}: ${model.label} (${model.category}). ${model.description}`;
            if (model.dataUrl) {
                 parts.push({
                    inlineData: {
                        mimeType: 'image/jpeg', // Assuming JPEG for simplicity
                        data: model.dataUrl.split(',')[1] // Remove data:image/jpeg;base64, prefix
                    }
                 });
            }
        }
      });
    }

    promptText += "\n\nTarget Frame to Analyze:";

    // Add the target frame (The CCTV footage)
    if (base64Image.startsWith('http')) {
       promptText += `\n[System Note: The input is a URL (${base64Image}), please describe what you usually see in a CCTV frame of this nature or simulate a detection based on the URL context.]`;
    } else {
        parts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image
            }
        });
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: parts
      }
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "AI Analysis temporarily unavailable. Check API Key configuration.";
  }
};
