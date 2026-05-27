import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFlashcardStore } from "@/store/flashcardStore";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const router = useRouter();
  const { setCurrentImage } = useFlashcardStore();

  const handleCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Please allow camera access to scan notes.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        setCurrentImage(result.assets[0].uri, result.assets[0].base64);
        router.push("/preview");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to open camera");
    }
  };

  const handleGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow photo library access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        setCurrentImage(result.assets[0].uri, result.assets[0].base64);
        router.push("/preview");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to open photo library");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center px-4 pt-4 pb-6 ">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-2xl bg-slate-900 items-center justify-center mr-4 border border-slate-800"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#ffffff" />
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
        <TouchableOpacity
          onPress={handleCamera}
          className="bg-indigo-600 rounded-2xl py-4 items-center"
        >
          <Text className="text-white text-lg font-bold">Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGallery}
          className="bg-gray-800 rounded-2xl py-4 items-center"
        >
          <Text className="text-white text-lg font-bold">
            Choose from galley
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
