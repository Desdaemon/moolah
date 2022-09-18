import type { Session } from "@supabase/supabase-js";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import Dashboard from "../components/dashboard";
import Login from "../components/login";
import SessionContext from "../components/session";
import { supabase } from "../utils/supabase";

const Home: NextPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session);
        }

        setIsLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);


  if (isLoading) return null;
  if (session) {
    return (
      <SessionContext.Provider value={session}>
        <Dashboard />
      </SessionContext.Provider>   
    )
  } else {
    return <Login />;
  }
};

export default Home;