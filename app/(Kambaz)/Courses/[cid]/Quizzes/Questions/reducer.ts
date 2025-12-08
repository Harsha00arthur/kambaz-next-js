import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Question {
  _id: string;
  title: string;
  question: string;
  questionType: "Multiple Choice" | "True False" | "Fill in the Blank";
  questionGroup: string;
  points: number;
  correctAnswer: string;
  options: { text: string; isCorrect: boolean }[];
  published: boolean;
  quiz?: string;
  course?: string;
}

interface QuestionsState {
  questions: Question[];
}

const initialState: QuestionsState = {
  questions: [],
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(
        (question) => question._id !== action.payload
      );
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(
        (question) => question._id === action.payload._id
      );
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
  },
});

export const { addQuestion, deleteQuestion, updateQuestion, setQuestions } =
  questionsSlice.actions;

export default questionsSlice.reducer;