import { useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const lastUserIdRef = useRef<string | null>(null);
  const roleCacheRef = useRef(new Map<string, boolean>());
  const pendingRoleChecksRef = useRef(new Map<string, Promise<boolean>>());
  const requestIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;

    const syncSession = async (sess: Session | null, options?: { background?: boolean }) => {
      const isBackground = options?.background ?? false;

      if (!mountedRef.current) return;

      setSession(sess);
      setUser(sess?.user ?? null);

      if (!sess?.user) {
        lastUserIdRef.current = null;
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const userId = sess.user.id;
      const isSameUser = lastUserIdRef.current === userId;
      lastUserIdRef.current = userId;

      const cachedRole = roleCacheRef.current.get(userId);
      if (cachedRole !== undefined) {
        setIsAdmin(cachedRole);
        if (!isBackground || isSameUser) {
          setLoading(false);
        }
      } else if (!isBackground || !isSameUser) {
        setLoading(true);
      }

      const requestId = ++requestIdRef.current;
      const nextIsAdmin = await checkRole(userId);

      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      setIsAdmin(nextIsAdmin);
      setLoading(false);
    };

    // 1. Listener BEFORE getSession (per supabase guidelines)
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      const isBackgroundEvent = event === "TOKEN_REFRESHED" || event === "USER_UPDATED";
      setTimeout(() => {
        void syncSession(sess, { background: isBackgroundEvent });
      }, 0);
    });

    // 2. Then check existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      void syncSession(sess);
    });

    return () => {
      mountedRef.current = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function checkRole(userId: string): Promise<boolean> {
    const cachedRole = roleCacheRef.current.get(userId);
    if (cachedRole !== undefined) return cachedRole;

    const existingCheck = pendingRoleChecksRef.current.get(userId);
    if (existingCheck) return existingCheck;

    const roleCheck = supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        const nextIsAdmin = !!data;
        roleCacheRef.current.set(userId, nextIsAdmin);
        pendingRoleChecksRef.current.delete(userId);
        return nextIsAdmin;
      })
      .catch(() => {
        pendingRoleChecksRef.current.delete(userId);
        return false;
      });

    pendingRoleChecksRef.current.set(userId, roleCheck);
    return roleCheck;
  }

  return { user, session, isAdmin, loading };
}
