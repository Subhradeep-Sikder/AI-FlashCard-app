import { useFlashcardStore } from "@/store/flashcardStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const loadDecks = useFlashcardStore((s: any) => s.loadDecks);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="study" />
    </Stack>
  );
}
