"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as db from "../Database";

export interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

const initialState: { enrollments: Enrollment[] } = {
  enrollments: db.enrollments as Enrollment[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollCourse: (
      state,
      action: PayloadAction<{ user: string; course: string }>
    ) => {
      const { user, course } = action.payload;
      const exists = state.enrollments.some(
        (e) => e.user === user && e.course === course
      );
      if (!exists) {
        state.enrollments.push({ _id: `${user}-${course}`, user, course });
      }
    },
    unenrollCourse: (
      state,
      action: PayloadAction<{ user: string; course: string }>
    ) => {
      const { user, course } = action.payload;
      state.enrollments = state.enrollments.filter(
        (e) => !(e.user === user && e.course === course)
      );
    },
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
  },
});

export const { enrollCourse, unenrollCourse, setEnrollments } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
