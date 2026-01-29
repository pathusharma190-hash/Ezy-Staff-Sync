import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HelperCategory, HelperProfile } from "../types";

// Helper function to get API Key safely
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API Key is missing!");
    return "";
  }
  return key;
};

// 1. Simulate extracting data from a "file" (raw text)
export const extractProfileFromText = async (text: string, filename: string): Promise<HelperProfile> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      category: { type: Type.STRING, enum: Object.values(HelperCategory) },
      experienceYears: { type: Type.NUMBER },
      age: { type: Type.NUMBER },
      maritalStatus: { type: Type.STRING },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      bio: { type: Type.STRING },
      availability: { type: Type.STRING },
    },
    required: ["name", "category", "experienceYears", "skills", "bio"]
  };

  const prompt = `
    You are a data extraction expert. 
    I have uploaded a resume file named "${filename}".
    The content or context is: "${text}".
    
    Please extract the candidate's details into a structured JSON. 
    If the text is sparse, infer reasonable details based on the filename and role to create a complete profile for demonstration purposes.
    Ensure the category matches one of: House Help, Gardener, Cook, Driver, Nanny.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      rating: 4.5, // Default for new uploads
      verified: false, // Requires documentation check
      ...data
    };
  } catch (error) {
    console.error("Extraction failed", error);
    throw new Error("Failed to extract profile data.");
  }
};

// 2. Chat Assistant Logic
export const getAssistantResponse = async (
  history: {role: string, parts: {text: string}[]}[],
  availableHelpers: HelperProfile[],
  lastUserMessage: string
): Promise<{ text: string; recommendedIds?: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  // We feed the available helpers as context so the AI knows who is available
  const context = `
    You are an intelligent recruitment assistant for "StaffSync".
    Your goal is to help the employer find the best candidate from the Available Candidates list below.
    
    AVAILABLE CANDIDATES (JSON):
    ${JSON.stringify(availableHelpers.map(h => ({ id: h.id, name: h.name, role: h.category, skills: h.skills, exp: h.experienceYears, bio: h.bio })))}

    INSTRUCTIONS:
    1. Answer the user's questions about the candidates.
    2. Ask clarifying questions (e.g., "Do you need someone with pet experience?") to narrow down the search.
    3. If you find good matches based on the conversation, list their Names in your response.
    4. Be professional, concise, and helpful.
    5. Do not make up candidates not in the list.
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: context,
      },
      history: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts
      })),
    });

    const result = await chat.sendMessage({ message: lastUserMessage });
    
    return {
      text: result.text || "I'm sorry, I didn't catch that."
    };

  } catch (error) {
    console.error("Chat error", error);
    return { text: "I'm having trouble connecting to the database right now. Please try again." };
  }
};

// 3. New: Analyze Requirements from Initial Chat
export const analyzeRequirements = async (
    chatHistory: {role: string, parts: {text: string}[]}[]
  ): Promise<{ category: HelperCategory | null, isReady: boolean, summary: string, nextQuestion: string }> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, enum: Object.values(HelperCategory) },
        isReady: { type: Type.BOOLEAN },
        summary: { type: Type.STRING },
        nextQuestion: { type: Type.STRING }
      },
      required: ["isReady", "summary", "nextQuestion"]
    };
  
    const prompt = `
      You are an intake specialist for a household staffing agency.
      Analyze the conversation history.
      
      Your goal is to identify:
      1. The specific category of help needed (House Help, Gardener, Cook, Driver, Nanny).
      2. If the user has provided enough detail (experience level, specific skills, or timing) to perform a search.
      
      If you have the category and at least one detail, set 'isReady' to true.
      If not, set 'isReady' to false and provide a polite 'nextQuestion' to gather the missing info.
      
      Generate a 'summary' of their requirements so far.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            { role: 'user', parts: [{ text: prompt }] },
            ...chatHistory // Append actual conversation
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
  
      const data = JSON.parse(response.text || "{}");
      
      return {
        category: data.category || null,
        isReady: data.isReady || false,
        summary: data.summary || "Requirements gathering...",
        nextQuestion: data.nextQuestion || "Could you tell me more about what you are looking for?"
      };
    } catch (error) {
      console.error("Requirement analysis failed", error);
      return { category: null, isReady: false, summary: "", nextQuestion: "How can I help you today?" };
    }
  };
