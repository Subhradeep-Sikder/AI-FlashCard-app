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
import { Ionicons } from "@expo/vector-icons";

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
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg font-semibold">No Deck selected</Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text className="text-indigo-400 mt-4 text-base font-semibold">Go Home</Text>
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

  if (finished) {
    const finalKnown = cards.filter((c) => c.known).length;
    const percent = Math.round((finalKnown / cards.length) * 100);
    const emoji = percent >= 80 ? "🏆" : percent >= 50 ? "💪" : "📚";
    const message =
      percent >= 80
        ? "Crushed it!"
        : percent >= 50
          ? "Good progress!"
          : "Keep studying!";

    return (
      <SafeAreaView className="flex-1 bg-black px-6">
        <View className="flex-1 items-center justify-center w-full">
          <Text className="text-8xl mb-6">{emoji}</Text>
          <Text className="text-white text-3xl font-bold text-center mb-2">
            {message}
          </Text>
          <Text className="text-gray-400 text-center mb-10">
            You knew {finalKnown} out of {cards.length} cards
          </Text>

          <View className="w-36 h-36 rounded-full bg-indigo-950/60 border-4 border-indigo-500 items-center justify-center mb-8">
            <Text className="text-white text-4xl font-bold">{percent}%</Text>
            <Text className="text-indigo-300 text-xs uppercase font-semibold">score</Text>
          </View>

          <View className="w-full bg-slate-900 rounded-3xl p-5 mb-8 border border-slate-800">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Got it</Text>
              <Text className="text-green-400 font-bold">
                {finalKnown} cards
              </Text>
            </View>
            <View className="w-full h-px bg-slate-800 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Review again</Text>
              <Text className="text-red-400 font-bold">
                {cards.length - finalKnown} cards
              </Text>
            </View>
          </View>

          <View className="w-full pb-8 gap-3">
            <TouchableOpacity
              onPress={() => {
                setCurrentIndex(0);
                setFinished(false);
                setIsFlipped(false);
                flipAnim.setValue(0);
              }}
              className="bg-indigo-600 rounded-2xl py-4 items-center"
              style={{
                shadowColor: "#6366f1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
              }}
            >
              <Text className="text-white text-lg font-bold">
                🔄 Study Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/")}
              className="bg-slate-900 rounded-2xl py-4 items-center border border-slate-800"
            >
              <Text className="text-white text-lg font-bold">
                🏠 Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="w-11 h-11 rounded-2xl bg-slate-900 items-center justify-center border border-slate-800"
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
        <View className="items-center flex-1 mx-4">
          <Text className="text-white font-bold text-lg text-center" numberOfLines={1}>
            {currentDeck?.title}
          </Text>
          <Text className="text-gray-500 text-xs">{currentDeck.subject}</Text>
        </View>
        <View className="bg-indigo-950 border border-indigo-850 px-3 py-1.5 rounded-full">
          <Text className="text-indigo-300 text-sm font-bold">
            {currentIndex + 1}/{cards.length}
          </Text>
        </View>
      </View>

      <View className="mx-4 mt-3 bg-slate-900 rounded-full h-1.5 mb-2">
        <View
          className="bg-indigo-500 rounded-full h-1.5"
          style={{ width: `${progress}%` }}
        />
      </View>
      <Text className="text-center text-gray-500 text-xs mb-6">
        {cards?.filter((c) => c.known).length} known so far
      </Text>

      <View className="flex-1 items-center justify-center px-4">
        {!isFlipped && (
          <Text className="text-gray-500 text-sm mb-4">
            Tap card to reveal the answer
          </Text>
        )}

        <Pressable
          onPress={flipCard}
          style={{ width: width - 32, height: 380 }}
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
            <View
              className="flex-1 bg-slate-900 rounded-3xl p-8 items-center justify-center border border-indigo-500/25"
              style={{
                shadowColor: "#6366f1",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.22,
                shadowRadius: 24,
                elevation: 8,
              }}
            >
              <View className="bg-indigo-950/40 border border-indigo-500/30 px-5 py-1.5 rounded-full mb-8">
                <Text className="text-indigo-300 text-xs font-semibold tracking-widest uppercase">
                  QUESTION
                </Text>
              </View>
              <Text className="text-slate-100 text-[26px] font-bold text-center leading-10 px-2">
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
            <View
              className="flex-1 bg-slate-900 rounded-3xl p-8 items-center justify-center border border-purple-500/25"
              style={{
                shadowColor: "#a855f7",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.22,
                shadowRadius: 24,
                elevation: 8,
              }}
            >
              <View className="bg-purple-950/40 border border-purple-500/30 px-5 py-1.5 rounded-full mb-8">
                <Text className="text-purple-300 text-xs font-semibold tracking-widest uppercase">
                  ANSWER
                </Text>
              </View>
              <Text className="text-slate-100 text-[26px] font-bold text-center leading-10 px-2">
                {currentCard?.answer}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {isFlipped && (
        <View className="flex-row gap-4 px-4 pb-8 pt-4">
          <TouchableOpacity
            onPress={() => handleNext(false)}
            activeOpacity={0.8}
            className="flex-1 bg-slate-900 rounded-2xl py-4 items-center border border-slate-800"
          >
            <Text className="text-xl mb-1">🥺</Text>
            <Text className="text-gray-400 font-bold text-sm">
              Review Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNext(true)}
            activeOpacity={0.8}
            className="flex-1 bg-green-950 rounded-2xl py-4 items-center border border-green-900/80"
            style={{
              shadowColor: "#22c55e",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Text className="text-xl mb-1">☺️</Text>
            <Text className="text-green-400 font-bold text-sm">Got It</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
