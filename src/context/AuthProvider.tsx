// src/context/AuthProvider.tsx
"use client";

import React, { ReactNode, useState, useEffect, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import { AuthContext, User } from "./AuthContext";
import {
  useCreateUserMutation,
  useLoginUserMutation,
} from "@/generated/graphql";

const ME_QUERY = gql`
  query Me {
    me {
      _id
      email
      role
    }
  }
`;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { refetch: refetchMeQuery } = useQuery(ME_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
        setError(null);
      } else {
        setUser(null);
      }
    },
    onError: (error) => {
      setError(error.message);
      setUser(null);
    },
  });

  const [loginMutation] = useLoginUserMutation();
  const [createUser] = useCreateUserMutation();

  const fetchMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await refetchMeQuery();
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [refetchMeQuery]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const refetchMe = useCallback(async () => {
    setError(null);
    await refetchMeQuery();
  }, [refetchMeQuery]);

  const signup = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await createUser({
        variables: {
          input: { email, password },
        },
      });
      if (data?.createUser?.token && data?.createUser?.refreshToken) {
        await refetchMe();
        return true;
      } else {
        throw new Error("Signup failed: Invalid server response.");
      }
    } catch (error) {
      const message = (error as Error).message;
      setError(message || "Signup failed: Unknown error.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginMutation({
        variables: { input: { email, password } },
      });
      if (data?.loginUser?.token) {
        await refetchMe();
        return true;
      } else {
        throw new Error("Login failed: Invalid server response.");
      }
    } catch (error) {
      const message = (error as Error).message;
      setError(message || "Login failed: Unknown error.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        refetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
