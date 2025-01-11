// src/context/AuthContext.tsx
"use client";

import { createContext, useContext } from "react";

export interface User {
  _id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<boolean>; // Return boolean for success/failure
  login: (email: string, password: string) => Promise<boolean>; // Return boolean for success/failure
  // logout: () => Promise<void>;
  refetchMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined, // Provide default as `undefined` for better error handling
);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
