import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFlashcardStore } from "@/store/flashcardStore";
import { Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const router = useRouter();
  const { setCurretImage } = useFlashcardStore();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center px-4 pt-4 pb-6 ">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center mr-4"
        >
          <Text className="text-white text-lg text-center ">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Scan Notes</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-8xl mb-6">📸</Text>
        <Text className="text-white text-2xl font-bold text-center mb-3">
          Scan your notes
        </Text>
        <Text className="text-gray-400 text-center text-base leading-6">
          Take a photo or pick from gallery. AI will read your notes and
          generate flashcards instantly.
        </Text>
      </View>

      <View className="px-6 pb-10 gap-4">
        <TouchableOpacity className="bg-indigo-600 rounded-2xl py-4 items-center">
          <Text className="text-white text-lg font-bold">Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-800 rounded-2xl py-4 items-center">
          <Text className="text-white text-lg font-bold">
            Choose from galley
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
