"use client";
import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();

      // ✅ IMPORTANT FIX — only set Redux if user exists
      if (currentUser) {
        dispatch(setCurrentUser(currentUser));
      }

    } catch (err: unknown) {
      console.error(err);
    }

    setPending(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!pending) {
    return <>{children}</>;
  }

  return null;
}
