import type { NextPage } from "next";
import { useRouter } from "next/router";
import { supabase } from "../utils/client";
import { type User, withPageAuth } from "@supabase/auth-helpers-nextjs";

const Dashboard: NextPage<{user: User}> = ({ user }) => {
  const router = useRouter()
  
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  }

  return (
    <div className="container mx-auto">
      <div className="card">
        <h1 className="text-3xl">Dashboard</h1>
        <pre>
          {JSON.stringify(user, null, 2)}
        </pre>
        <button
          className="transition-colors border border-neutral-500 hover:border-neutral-300 p-2 rounded"
          onClick={logout}>Logout</button>
      </div>
    </div>
  )
};

export default Dashboard;

export const getServerSideProps = withPageAuth({ redirectTo: '/login?from=/me' })