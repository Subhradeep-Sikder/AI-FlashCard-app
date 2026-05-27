import { useFlashcardStore } from "@/store/flashcardStore";
import { Difficulty } from "@/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

const DIFFICULTIES: {
  key: Difficulty;
  label: string;
  desc: string;
  emoji: string;
}[] = [
  {
    key: "simple",
    label: "Simple",
    desc: "Short & beginner friendly",
    emoji: "🌱",
  },
  {
    key: "detailed",
    label: "Detailed",
    desc: "Thorough explanations",
    emoji: "📖",
  },
  { key: "exam", label: "Exam Level", desc: "Deep & challenging", emoji: "🎯" },
];

export default function PreviewScreen() {
  const router = useRouter();
  const { currentImageUri } = useFlashcardStore();
  const [difficulty, setDifficulty] = useState<Difficulty>("simple");

  const handleGenerate = () => {
    router.push({
      pathname: "/generating",
      params: { difficulty },
    });
  };

  if (!currentImageUri) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-white text-lg">No image selected.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-indigo-400 text-base">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center px-4 pt-4 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center mr-4"
          >
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Preview</Text>
        </View>

        <View className="mx-4 rounded-2xl overflow-hidden mb-6">
          <Image
            source={{ uri: currentImageUri }}
            style={{ width: "100%", height: 256 }}
            contentFit="cover"
          />
          <View className="absolute bottom-3 right-3 bg-black/60 px-4 py-1 rounded-full">
            <Text className="text-white text-xs">Your Notes</Text>
          </View>
        </View>

        <View className="px-4 mb-6">
          <Text className="text-white text-lg font-bold mb-3">
            Choose Difficulty
          </Text>

          <View className="gap-3">
            {DIFFICULTIES?.map((d) => (
              <TouchableOpacity
                key={d.key}
                onPress={() => setDifficulty(d.key)}
                className={`flex-row items-center p-4 rounded-xl border ${difficulty === d.key ? "border-indigo-500" : "border-gray-700"}`}
              >
                <Text>{d.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">
                    {d.label}
                  </Text>
                  <Text className="text-gray-300 text-sm">{d.desc}</Text>
                </View>
                {difficulty === d.key && (
                  <View className="w-6 h-6 rounded-full bg-indigo-500 items-center justify-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-4 pb-8 pt-2">
        <TouchableOpacity
          onPress={handleGenerate}
          className="bg-indigo-600 rounded-2xl py-4 items-center"
        >
          <Text className="text-white text-lg font-bold">
            ✨ Generate Flashcards
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
