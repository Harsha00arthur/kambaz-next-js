import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Quiz } from "./client";

type QuizzesState = {
  quizzes: Quiz[];
};

const initialState: QuizzesState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload);
    },
    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      const updated = action.payload;
      state.quizzes = state.quizzes.map((q) =>
        q._id === updated._id ? updated : q
      );
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.quizzes = state.quizzes.filter((q) => q._id !== id);
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } =
  quizzesSlice.actions;

export default quizzesSlice.reducer;
