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

  // 1) me query
  const { refetch: refetchMeQuery } = useQuery(ME_QUERY, {
    skip: true, // анх ачаалахад автоматаар дуудахгүй
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
        setError(error);
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

  // Анх AuthProvider ачаалахад cookie дээрх token хүчинтэй эсэхийг me query ашиглан шалгана
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

  // refetchMe -ийг context-д зарлах
  const refetchMe = useCallback(async () => {
    setError(null);
    await refetchMeQuery();
  }, [refetchMeQuery]);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await createUser({
        variables: {
          input: { email, password },
        },
      });
      if (data?.createUser?.token) {
        localStorage.setItem("authToken", data.createUser.token);
        await refetchMe();
      } else {
        throw new Error("Signup failed: Invalid server response.");
      }
    } catch (error) {
      const message = (error as Error).message;
      setError(message || "Signup failed: Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  // login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginMutation({
        variables: { input: { email, password } },
      });
      if (data?.loginUser?.token) {
        localStorage.setItem("authToken", data.loginUser.token);
        await refetchMe();
      } else {
        throw new Error("Login failed: Invalid server response.");
      }
    } catch (error) {
      const message = (error as Error).message;
      setError(message || "Login failed: Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  // const logout = async () => {
  //   setLoading(true);
  //   try {
  //     // Хэрэв сервер талд logoutUser mutation байгаа бол дуудаж cookie-г устгуулна
  //     // Эсвэл cookie-г force-оор устгах өөр route бэлдэж болно
  //     await logoutMutation();
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        // logout,
        refetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
