
import { getTrainingModels } from "./backend";

/**
 * Local AI Analysis Service
 * Simulates computer vision analysis locally without external APIs.
 */

export const analyzeFrame = async (base64Image: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
        const trainingModels = getTrainingModels();
        const rand = Math.random();

        // Check if we have relevant training data to "match"
        const relevantModel = trainingModels.length > 0 
            ? trainingModels[Math.floor(Math.random() * trainingModels.length)] 
            : null;

        if (relevantModel && rand > 0.6) {
             resolve(`POSITIVE MATCH: ${relevantModel.label} (${relevantModel.category}) detected with 89% confidence. Matched against user-trained dataset.`);
             return;
        }

        // Default generic responses based on random chance
        if (rand > 0.8) {
            resolve("ALERT: Unauthorized person detected in restricted zone. Facial features obscured.");
        } else if (rand > 0.6) {
            resolve("NOTICE: Delivery vehicle detected near loading bay.");
        } else if (rand > 0.4) {
            resolve("Status: Normal activity. 2 Staff members identified.");
        } else {
            resolve("Status: No active threats detected. Scene is static.");
        }
    }, 1500);
  });
};
