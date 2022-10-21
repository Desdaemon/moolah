import type { NextPage } from "next";
import { useRouter } from "next/router";
import { /* fetcher, */ supabase } from "../utils/client";
import { type User, withPageAuth } from "@supabase/auth-helpers-nextjs";
import HomeLink from "../components/homelink";
import Head from "next/head";
// import useSwr from 'swr'
// import type { Favorites } from "./api/favorites";

// const types = ['Stock', 'Crypto']
import Link from "next/link";
import { uri } from "../utils/common";
// import { Match, MatchK, search } from "../utils/api";

interface DashboardProps {
  user: User
  pinnedStocks: string[]
}
const Dashboard: NextPage<DashboardProps> = ({ user, pinnedStocks }) => {
  const router = useRouter()
  // const {data: favorites, error} = useSwr<Favorites>('/api/favorites', fetcher('GET'))
  
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  }

  // pinnedStocks.forEach(s => {
  //   console.log(s);
  //   search(s).then(e => console.log(e))
  // })

  return (
    <div className="container mx-auto">
      <Head>
        <title>Moolah • Dashboard</title>
      </Head>
      <div className="flex"><HomeLink className="self-center text-3xl mt-4" />
        <div className="flex spacer"></div>
        <h1 className="text-3xl mt-4">Dashboard</h1>
        <div className="flex spacer"></div>
        <button
          className="transition-colors border border-neutral-500 hover:border-neutral-300 p-2 rounded"
          onClick={logout}>Logout
        </button>
      </div>
      <div className="card">
        <h1 className="text-3xl">Pinned Stocks</h1>
        {pinnedStocks.map(e => {
          return (
            <Link href={uri`/details/${e}`} key={e}>
              <div key={e} className="card relative m-1 flex">
                <div className="spacer">{e}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
};

export default Dashboard;
export const getServerSideProps = withPageAuth<DashboardProps>({
  redirectTo: '/login?from=/me',
  async getServerSideProps(ctx, supabase) {
    const {data: { user }} = await supabase.auth.getUser()

    const {data} = await supabase
      .from('Users')
      .select()
      .eq("user-id", user!.id)

    return {
      props: {
        pinnedStocks: data?.length ? data[0]['pinned-stocks'] : []
      }
    }
  },
})
