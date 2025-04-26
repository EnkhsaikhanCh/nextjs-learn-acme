// src/store/useSessionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session } from "next-auth";

interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "session-storage", // LocalStorage key name
      partialize: (state) => ({ session: state.session }), // Яг session хэсгийг л хадгална
    },
  ),
);
