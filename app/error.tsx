import { useFlashcardStore } from "@/store/flashcardStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ErrorScreen() {
  const router = useRouter();
  const { error, setError } = useFlashcardStore();

  const handleRetry = () => {
    setError(null);
    router.replace("/camera");
  };

  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center px-8">
      <Text className="text-6xl mb-6">😨</Text>
      <Text className="text-white text-2xl font-bold text-center mb-3">
        Something went wrong
      </Text>
      <Text className="text-gray-400 text-center mb-8">
        {error ?? "Failed to generate flashcards. Please try again."}
      </Text>
      <TouchableOpacity
        onPress={handleRetry}
        className="bg-indigo-600 rounded-2xl py-4 px-8"
      >
        <Text className="text-white text-lg font-bold">Try Again</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
