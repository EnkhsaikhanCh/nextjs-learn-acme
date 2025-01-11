// src/app/api/graphql/hooks/useRefreshToken.ts
import { useRefreshTokenMutation } from "@/generated/graphql";

export function useRefreshToken() {
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const refreshToken = async () => {
    try {
      // Refresh Token-г күүкигээс уншина
      const oldRefreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];

      if (!oldRefreshToken) {
        throw new Error("Refresh Token not found");
      }

      const { data } = await refreshTokenMutation({
        variables: { input: { refreshToken: oldRefreshToken } },
      });

      const newAccessToken = data?.refreshToken?.token;
      const newRefreshToken = data?.refreshToken?.refreshToken;

      // Шинэ токенуудыг күүкид тохируулна
      if (newAccessToken) {
        document.cookie = `authToken=${newAccessToken}; path=/; Secure; HttpOnly; SameSite=Strict`;
      }
      if (newRefreshToken) {
        document.cookie = `refreshToken=${newRefreshToken}; path=/; Secure; HttpOnly; SameSite=Strict`;
      }

      return { newAccessToken, newRefreshToken };
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  };

  return refreshToken;
}
