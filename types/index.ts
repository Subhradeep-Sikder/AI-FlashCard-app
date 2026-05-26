export interface FlashCard{
    id: string;
    question: string;
    answer: string;
    known:boolean;
}

export interface Deck{
    id: string;
    title: string;
    subject: string;
    difficulty: "simple" | "detailed" | "exam";
    cards: FlashCard[];
    createdAt: string;
    imageUri: string;
}

export type Difficulty = "simple" | "detailed" | "exam";

