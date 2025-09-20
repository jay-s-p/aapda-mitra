
import { GoogleGenAI } from "@google/genai";
import { DisasterType, ChatMessage } from '../types';

// Initialize the Google Gemini API client.
// The API key is sourced from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

/**
 * Generates a survival guide for a specific disaster type using the Gemini API.
 * @param disasterType The type of disaster to generate a guide for.
 * @returns A promise that resolves to a markdown-formatted string containing the survival guide.
 */
export const generateSurvivalGuide = async (disasterType: DisasterType): Promise<string> => {
  const prompt = `Generate a comprehensive survival guide for a ${disasterType}. The guide should be practical, easy to understand, and provide actionable steps for before, during, and after the disaster. Use markdown formatting with headings (e.g., ### Before the ${disasterType}), and bullet points for lists.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    // Log the original error for debugging purposes.
    console.error('Error generating survival guide:', error);
    // Throw a new, more specific error to be handled by the calling component.
    // This is robust error handling as it allows the UI to display a user-friendly message.
    throw new Error('Failed to generate survival guide from Gemini API.');
  }
};

/**
 * Gets a response from the chatbot AI based on the conversation history and a new message.
 * @param history An array of previous chat messages.
 * @param newMessage The new message from the user.
 * @returns A promise that resolves to the chatbot's string response.
 */
export const getChatbotResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    const fullPrompt = [
        ...history.map(msg => `${msg.sender}: ${msg.text}`),
        `user: ${newMessage}`
    ].join('\n');

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
                systemInstruction: "You are 'Aapda Mitra', an AI assistant focused on disaster preparedness and response. Your goal is to provide clear, concise, and helpful information. You must not provide medical advice. If asked for medical advice, you must direct the user to consult a medical professional or contact emergency services.",
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
}
