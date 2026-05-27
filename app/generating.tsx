import { Deck, Difficulty, FlashCard } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Text, View } from "react-native";
import { useFlashcardStore } from "@/store/flashcardStore";
import { generateFlashCards } from "@/services/geminiApi";

const LOADING_MESSAGES = [
  "🔍 Reading your notes...",
  "🧠 Understanding the content...",
  "✍️ Writing flashcards...",
  "✨ Almost done...",
];

export default function GeneratingScreen() {
  const router = useRouter();
  const { difficulty } = useLocalSearchParams<{ difficulty: Difficulty }>();
  const { currentImageBase64, saveDeck, setCurrentDeck, setError } =
    useFlashcardStore();
  const hasCalled = useRef(false);

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasCalled.current) return;
    callAi();
  }, []);

  const callAi = async () => {
    try {
      if (!currentImageBase64) throw new Error("No image found");

      const result = await generateFlashCards(
        currentImageBase64,
        difficulty ?? "simple",
      );

      const cards: FlashCard[] = result?.cards?.map((c, i) => ({
        id: `card_${Date.now()}_${i}`,
        question: c.question,
        answer: c.answer,
        known: false,
      }));

      const deck: Deck = {
        id: `deck_${Date.now()}`,
        title: result.title,
        subject: result.subject,
        difficulty: difficulty ?? "simple",
        cards,
        createdAt: new Date().toLocaleDateString(),
        imageUri: "",
      };

      await saveDeck(deck);
      setCurrentDeck(deck);
      router.replace("/study");
    } catch (err: any) {
      console.log("ERROR FULL:", JSON.stringify(err?.response?.data, null, 2));
      console.log("ERROR STATUS:", err?.response?.status);
      console.log("ERROR MESSAGE:", err?.message);
      setError(
        err?.response?.data?.error?.message ??
          err.message ??
          "Something went wrong",
      );
      router.replace("/error");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center px-8">
      <View className="items-center">
        <ActivityIndicator size={"large"} color={"#6366f1"} className="mb-6" />

        <Text className="text-white text-2xl font-bold text-center mb-3">
          AI is working
        </Text>

        <Text className="text-indigo-400 text-base text-center font-medium">
          {LOADING_MESSAGES[messageIndex]}
        </Text>

        <Text className="text-gray-500 text-sm text-center mt-8">
          This usually takes 10-20 seconds
        </Text>
      </View>
    </SafeAreaView>
  );
}
