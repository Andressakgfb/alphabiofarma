import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (active) {
        setIsAdmin(!!data);
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => check(data.session?.user?.id));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoading(true);
      check(session?.user?.id);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
}
