import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Quiz } from "./client";

type QuizzesState = {
  quizzes: Quiz[];
  search: string;
  sort: "NAME" | "DUE" | "AVAILABLE" | null;
};

const initialState: QuizzesState = {
  quizzes: [],
  search: "",
  sort: null,
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
    deleteQuiz(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter(
        (q) => q._id !== action.payload
      );
    },

    setSearch(state, action: PayloadAction<string>) {
    state.search = action.payload.toLowerCase();
  },

    setSort(state, action: PayloadAction<"NAME" | "DUE" | "AVAILABLE">) {
      state.sort = action.payload;
    },

  },
});



export const {
  setQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  setSearch,
  setSort,
} = quizzesSlice.actions;


export default quizzesSlice.reducer;
