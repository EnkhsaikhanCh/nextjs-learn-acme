import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserV2 } from "@/generated/graphql";

interface UserStoreState {
  user: UserV2 | null;
  setUser: (user: UserV2) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store",
    },
  ),
);
