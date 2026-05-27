import { useFlashcardStore } from "@/store/flashcardStore";
import { Deck } from "@/types";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeSceen() {
  const router = useRouter();
  const { decks, deleteDeck, setCurrentDeck } = useFlashcardStore();

  const handleStudy = (deck: Deck) => {
    setCurrentDeck(deck);
    router.push("/study");
  };

  const handleDelete = (deck: Deck) => {
    Alert.alert("Delete Deck", `Delete "${deck.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteDeck(deck.id),
      },
    ]);
  };

  const renderDeck = ({ item }: { item: Deck }) => {
    const known = item.cards.filter((c) => c.known).length;
    const total = item.cards.length;
    const progress = total > 0 ? (known / 100) * 100 : 0;

    const subjectColors: Record<string, string> = {
      Biology: "bg-green-900 text-green-300",
      Math: "bg-blue-900 text-blue-300",
      History: "bg-yellow-900 text-yellow-300",
      Physics: "bg-purple-900 text-purple-300",
      Chemistry: "bg-red-900 text-red-300",
    };
    const subjectColor =
      subjectColors[item.subject] ?? "bg-indigo-900 text-indigo-300";

    return (
      <TouchableOpacity
        onPress={() => handleStudy(item)}
        onLongPress={() => handleDelete(item)}
        activeOpacity={0.8}
        className="bg-gray-800 rounded-3xl p-5 mb-4 border border-gray-700"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View
            className={`px-3 py-1 rounded-full ${subjectColor.split(" ")[0]}`}
          >
            <Text className={`text-xs font-bold ${subjectColor.split(" ")[1]}`}>
              {item.subject}
            </Text>
          </View>
          <View className="bg-gray-700 px-3 py-1 rounded-full">
            <Text className="text-gray-300 text-xs capitalize">
              {item?.difficulty}
            </Text>
          </View>
        </View>

        <Text className="text-white text-xl font-bold mb-1">{item?.title}</Text>
        <Text className="text-gray-500 text-sm mb-4">
          {total} cards • CREATED {item.createdAt}
        </Text>

        <View className="bg-gray-700 rounded-full h-2 mb-2">
          <View
            className="bg-indigo-500 rounded-full h-2"
            style={{ width: `${progress}%` }}
          />
        </View>

        <View className="flex-row justify-between">
          <Text className="text-gray-500 text-xs">
            {known}/{total} known
          </Text>
          <Text className="text-gray-500 text-xs">{Math.round(progress)}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          renderItem={renderDeck}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        />
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
