import type { NextPage } from "next";
import { useRouter } from "next/router";
import { supabase } from "../utils/client";
import { type User, withPageAuth } from "@supabase/auth-helpers-nextjs";
import HomeLink from "../components/homelink";
import Head from "next/head";
import Link from "next/link";
import { uri } from "../utils/common";
import { Database } from "../utils/database.types";

interface DashboardProps {
  user: User
  pinnedStocks: string[]
}
const Dashboard: NextPage<DashboardProps> = ({ user, pinnedStocks }) => {
  const router = useRouter()
  
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  }

  return (
    <div className="container mx-auto">
      <Head>
        <title>Moolah • Dashboard</title>
      </Head>
      <div className="flex">
        <HomeLink className="self-center text-3xl mt-4" />
        <div className="flex spacer" />
        <h1 className="text-3xl mt-4">Dashboard</h1>
        <div className="flex spacer" />
        <button
          className="transition-colors border border-neutral-500 hover:border-neutral-300 p-2 rounded"
          onClick={logout}>Logout
        </button>
      </div>
      <div className="card">
        <h1 className="text-3xl">Pinned Stocks</h1>
        {pinnedStocks.map(stock => (
          <Link href={uri`/details/${stock}`} key={stock}>
            <div key={stock} className="card relative m-1 flex">
              <div className="spacer">{stock}</div>
            </div>
          </Link>
        ))}
        {!pinnedStocks.length && (
          <p>No favorites yet!</p>
        )}
      </div>
    </div>
  )
};

export default Dashboard;
export const getServerSideProps = withPageAuth<Database>({
  redirectTo: '/login?from=/me',
  async getServerSideProps(_ctx, supabase) {
    const {data: { user }} = await supabase.auth.getUser()

    const {data: favs} = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user!.id)

    return {
      props: {
        pinnedStocks: favs ? favs.map(fav => fav.name) : []
      }
    }
  },
})
