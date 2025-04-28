import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserV2 } from "@/generated/graphql";

interface UserStoreState {
  user: UserV2 | null;
  isInitialized: boolean;
  setUser: (user: UserV2) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: null,
      isInitialized: false,
      setUser: (user) => set({ user }),
      clearUser: () => {
        set({ user: null });
        localStorage.removeItem("user-store");
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
