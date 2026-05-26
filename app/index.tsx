import { useFlashcardStore } from "@/store/flashcardStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeSceen() {
  const router = useRouter();
  const { decks, deleteDeck, setCurrentDeck } = useFlashcardStore();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-3xl font-bold">My Decks</Text>
          <Text className="text-gray-500 mt-1">
            {decks?.length} {decks.length === 1 ? "deck" : "decks"} Long press
            to delete
          </Text>
        </View>
        <Text className="text-4xl">🧠</Text>
      </View>
      {decks?.length > 0 && (
        <View className="mx-4 mb-4 bg-gray-800 rounded-2xl p-4 flex-row justify-around border border-gray-700">
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {decks?.length}
            </Text>
            <Text className="text-gray-500 text-xs">Decks</Text>
          </View>

          <View className="w-px bg-gray-700" />

          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {decks?.reduce((acc, d) => acc + d.cards.length, 0)}
            </Text>
            <Text className="text-gray-500 text-xs">Total Cards</Text>
          </View>

          <View className="w-px bg-gray-700" />

          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {decks.reduce(
                (acc, d) => acc + d.cards.filter((c) => c.known).length,
                0,
              )}
            </Text>
            <Text className="text-gray-500 text-xs">Known</Text>
          </View>
        </View>
      )}

      {decks?.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-8xl mb-6">📚</Text>
          <Text className="text-white text-2xl font-bold text-center mb-3">
            No decks yet!
          </Text>
          <Text className="text-gray-500 text-center leading-6">
            Tap the + button below to scan your noyes and generate AI flashcards
            instantly
          </Text>
        </View>
      ) : (
        <FlatList />
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push("/camera")}
        className="absolute bottom-6 right-6 bg-blue-600 rounded-full mb-3 w-16 h-16 items-center justify-center shadow-lg"
      >
        <Text className="text-white text-3xl font-light ">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
