import { useRefreshToken } from "../hooks/useRefreshToken";

export const useFetchWithRefresh = () => {
  const refreshToken = useRefreshToken();

  const fetchWithRefresh = async (url: string, options: RequestInit = {}) => {
    let response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401) {
      console.log("Access Token expired. Attempting to refresh...");

      const { newAccessToken } = await refreshToken();

      if (newAccessToken) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
          credentials: "include",
        });
      } else {
        console.error("Refresh failed. Redirecting to login...");
        window.location.href = "/login";
      }
    }

    return response;
  };

  return fetchWithRefresh;
};
