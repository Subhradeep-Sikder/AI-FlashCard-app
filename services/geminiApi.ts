import { Difficulty, FlashCard } from "@/types";
import axios from "axios";

// Gemini API base URL using gemini-2.5-flash
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const DIFFICULTY_PROMPTS: Record<Difficulty, string> = {
  simple:
    "Create simple, beginner-friendly flashcards with short clear answers.",
  detailed:
    "Create detailed flashcards with thorough explanations in the answers.",
  exam: "Create challenging exam-level flashcards that test deep understanding.",
};

export interface AIResponse {
  title: string;
  subject: string;
  cards: Omit<FlashCard, "id" | "known">[];
}

function getMediaType(
  base64: string,
): "image/jpeg" | "image/png" | "image/webp" {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("UklG")) return "image/webp";
  return "image/jpeg";
}

export async function generateFlashCards(
  base64Image: string,
  difficulty: Difficulty,
): Promise<AIResponse> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "EXPO_PUBLIC_GEMINI_API_KEY is not defined in your environment variables.",
    );
  }

  const cleanBase64 = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;
  const mediaType = getMediaType(cleanBase64);

  try {
    const response = await axios.post(
      `${API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mediaType,
                  data: cleanBase64,
                },
              },
              {
                text: `You are an expert study assistant. Analyze this image of notes or textbook content.
${DIFFICULTY_PROMPTS[difficulty]}

Generate 5-8 flashcards from the content in this image.
Also detect the subject (e.g. Biology, History, Math) and create a short deck title.`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              subject: { type: "string" },
              cards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" }
                  },
                  required: ["question", "answer"]
                }
              }
            },
            required: ["title", "subject", "cards"]
          }
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("No response text content received from Gemini API.");
    }

    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    }
    return JSON.parse(cleaned);
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.error?.message || error.message || error;
    console.error("Error generating flashcards:", errorMsg);
    throw new Error(errorMsg);
  }
}
