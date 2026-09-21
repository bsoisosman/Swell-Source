import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/**
 * Single source of truth for "is anyone signed in".
 *
 * `loading` exists to prevent a flash: on a cold start the session
 * is read from disk asynchronously, so for a moment there is no
 * session even for a signed-in user. Routing on that would bounce
 * them to the entrance screen every launch.
 *
 * `isGuest` reads is_anonymous off the token. A guest is a real
 * user with a real row — they just haven't attached an email yet.
 */

type AuthValue = {
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  session: null, loading: true, isGuest: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    // Fires on sign-in, sign-out, token refresh, and when a guest
    // is upgraded to a full account. One listener covers all of it.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isGuest: session?.user?.is_anonymous ?? false,
        signOut: async () => { await supabase.auth.signOut(); },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
