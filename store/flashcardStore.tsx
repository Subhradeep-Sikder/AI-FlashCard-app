import { Deck } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface FlashcardState {
  decks: Deck[];
  currentDeck: Deck | null;
  currentImageUri: string | null;
  currentImageBase64: string | null;
  isLoading: boolean;
  error: string | null;

  loadDecks: () => Promise<void>;
  saveDeck: (deck: Deck) => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
  setCurrentDeck: (deck: Deck | null) => void;
  setCurrentImage: (uri: string, base64: string) => void;
  updateCardKnown: (
    deckId: string,
    cardId: string,
    known: boolean,
  ) => Promise<void>;
  setLoading: (val: boolean) => void;
  setError: (msg: string | null) => void;
}

const STORAGE_KEY = "flashcard_decks";

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  decks: [],
  currentDeck: null,
  currentImageUri: null,
  currentImageBase64: null,
  isLoading: false,
  error: null,

  loadDecks: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) set({ decks: JSON.parse(data) });
    } catch {
      set({ error: "Failed to load decks" });
    }
  },

  saveDeck: async (deck) => {
    try {
      const { decks } = get();
      const updated = [deck, ...decks.filter((d) => d.id !== deck.id)];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ decks: updated });
    } catch {
      set({ error: "Failed to save decks" });
    }
  },

  deleteDeck: async (deckId) => {
    try {
      const { decks } = get();
      const updated = decks.filter((d) => d.id !== deckId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ decks: updated });
    } catch {
      set({ error: "Failed to save decks" });
    }
  },

  setCurrentDeck: (deck) => set({ currentDeck: deck }),

  setCurrentImage: (uri, base64) =>
    set({ currentImageUri: uri, currentImageBase64: base64 }),

  updateCardKnown: async (deckId, cardId, known) => {
    const { decks, currentDeck } = get();
    const updated = decks.map((d) => {
      if (d.id !== deckId) return d;
      return {
        ...d,
        cards: d.cards.map((c) => (c.id === cardId ? { ...c, known } : c)),
      };
    });

    const updatedCurrentDeck = currentDeck && currentDeck.id === deckId
      ? updated.find((d) => d.id === deckId) || null
      : currentDeck;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ decks: updated, currentDeck: updatedCurrentDeck });
  },

  setLoading: (val) => set({ isLoading: val }),

  setError: (msg) => set({ error: msg }),
}));
