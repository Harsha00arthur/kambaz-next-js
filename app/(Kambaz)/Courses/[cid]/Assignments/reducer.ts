"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as db from "../../../Database";

// ✅ Unified Assignment interface (matches components)
export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFromDate?: string;
  availableUntilDate?: string;
}

// ✅ Initial state from database
const initialState: { assignments: Assignment[] } = {
  assignments: db.assignments as Assignment[],
};

// ✅ Slice
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments.push(action.payload);
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.assignments.findIndex(
        (a) => a._id === action.payload._id
      );
      if (index !== -1) {
        state.assignments[index] = {
          ...state.assignments[index],
          ...action.payload,
        };
      }
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== action.payload
      );
    },
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
  },
});

export const {
  addAssignment,
  updateAssignment,
  deleteAssignment,
  setAssignments,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
