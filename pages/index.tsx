import { NextPage } from "next";
import { useState, useEffect } from "react";
import Dashboard from "../components/dashboard";
import Login from "../components/login";
import { supabase } from "../utils/supabase";

const Home: NextPage = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return session ? <Dashboard /> : <Login />;
};

export default Home;