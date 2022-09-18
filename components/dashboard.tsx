import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const Dashboard: NextPage = () => {
  const [user, setUser] = useState(null);
  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (!session?.user) {
      throw new Error('User not logged in')
    }

    return session.user
  }

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  return <div className="container">{JSON.stringify(user)}</div>;
};

export default Dashboard;