import { useFlashcardStore } from "@/store/flashcardStore";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function StudyScreen() {
  const router = useRouter();
  const { currentDeck, updateCardKnown } = useFlashcardStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!currentDeck) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950 items-center justify-center">
        <Text>No Deck selected</Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text className="text-indigo-400 mt-4">Go Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const cards = currentDeck.cards;
  const currentCard = cards[currentIndex];
  const progress = (currentIndex / cards.length) * 100;

  const flipCard = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const toValue = isFlipped ? 0 : 1;

    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleNext = async (known: boolean) => {
    await updateCardKnown(currentDeck.id, currentCard.id, known);
    flipAnim.setValue(0);
    setIsFlipped(false);
    if (currentIndex + 1 >= cards.length) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center border border-gray-70"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white font-bold text-base">
            {currentDeck?.title}
          </Text>
          <Text className="text-gray-500 text-xs">{currentDeck.subject}</Text>
        </View>
        <View className="bg-indigo-950 border border-indigo-800 px-3 py-1 rounded-full">
          <Text className="text-indigo-300 text-sm font-bold">
            {currentIndex + 1}/{cards.length}
          </Text>
        </View>
      </View>

      <View className="mx-4 mt-3 bg-gray-800 rounded-full h-1.5 mb-2">
        <View className="bg-indigo-500 rounded-full h-1.5" />
      </View>
      <Text className="text-center text-gray-600 text-xs mb-6">
        {cards?.filter((c) => c.known).length} known so far
      </Text>

      <View className="flex-1 items-center justify-center px-4">
        {!isFlipped && (
          <Text className="text-gray-600 text-sm mb-4">
            Tap to reveal the answer
          </Text>
        )}

        <Pressable
          onPress={flipCard}
          style={{ width: width - 32, height: 300 }}
        >
          <Animated.View
            style={{
              transform: [{ rotateY: frontInterpolate }, { scale: scaleAnim }],
              backfaceVisibility: "hidden",
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <View className="flex-1 bg-gray-800 rounded-3xl p-8 intem-center justify-center border border-gray-700">
              <View className="bg-indigo-900 border bordeer-800 px-4 py-1.5 rounded-full">
                <Text className="text-indigo-300 text-xs font-bold tracking-widest">
                  QUESTION
                </Text>
              </View>
              <Text className="text-white text-xl font-bold text-center leading-8">
                {currentCard?.question}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              transform: [{ rotateY: backInterpolate }, { scale: scaleAnim }],
              backfaceVisibility: "hidden",
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <View className="flex-1 bg-gray-800 rounded-3xl p-8 intem-center justify-center border border-gray-700">
              <View className="bg-indigo-900 border bordeer-800 px-4 py-1.5 rounded-full">
                <Text className="text-indigo-300 text-xs font-bold tracking-widest">
                  ANSWER
                </Text>
              </View>
              <Text className="text-white text-xl font-bold text-center leading-8">
                {currentCard?.question}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {isFlipped && (
        <Animated.View>
          <TouchableOpacity
            onPress={() => handleNext(false)}
            activeOpacity={0.8}
            className="flex-1 bg-gray-800 rounded-2xl py-5 items-center border-gray-700"
          >
            <Text>🥺</Text>
            <Text className="text-gray-300 font-bold text-sm">
              Review Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNext(true)}
            className="flex-1 bg-green-900 rounded-2xl py-5 items-center border border-green-200"
            style={{
              shadowColor: "#22c55e",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Text>☺️</Text>
            <Text className="text-green-300 font-bold text-sm">Got It</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
