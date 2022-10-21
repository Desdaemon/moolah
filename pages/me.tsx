import type { NextPage } from "next";
import { useRouter } from "next/router";
import { supabase } from "../utils/client";
import { type User, withPageAuth } from "@supabase/auth-helpers-nextjs";
import HomeLink from "../components/homelink";
import Head from "next/head";
import Link from "next/link";
import { uri } from "../utils/common";
import { Match, MatchK, search } from "../utils/api";

const Dashboard: NextPage<{user: User}> = ({ user, pinnedStocks }) => {
  const router = useRouter()

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  }

  pinnedStocks.forEach(s => {
    console.log(s);
    search(s).then(e => console.log(e))
  })
  console.log()

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
        })
        }
      </div>
    </div>
  )
};

// <div className="card">
//   <h1 className="text-3xl">Pinned Stocks</h1>
//   <pre>
//     {JSON.stringify(user, null, 2)}
//     {user?.id}
//   </pre>
// </div>

export default Dashboard;
export const getServerSideProps = async context => {
  withPageAuth({ redirectTo: '/login?from=/me' })()
  async function getPinnedStocks() {
    const {data, error} = await supabase
    .from('Users')
    .select()
    .eq("user-id", "6ea9c27d-9b7b-4354-bad4-ad7d903492d4")
    return data[0]['pinned-stocks']
  }

  const stocks = await getPinnedStocks()

  return {
    props: {
        pinnedStocks: stocks
    }
  }
}
