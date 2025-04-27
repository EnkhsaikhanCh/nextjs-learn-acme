// src/hooks/useCachedSession.ts
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSessionStore } from "@/store/useSessionStore";

export function useCachedSession() {
  const { data: session, status } = useSession();
  const cachedSession = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

  useEffect(() => {
    if (status === "authenticated" && session) {
      setSession(session);
    } else if (status === "unauthenticated") {
      clearSession();
    }
  }, [status, session, setSession, clearSession]);

  return {
    session: cachedSession,
    status,
  };
}
