import type { NextPage } from "next";
import { useRouter } from "next/router";
import { supabase } from "../utils/client";
import { type User, withPageAuth } from "@supabase/auth-helpers-nextjs";
import HomeLink from "../components/homelink";
import Head from "next/head";
import Link from "next/link";
import { uri } from "../utils/common";
import { Database } from "../utils/database.types";
import Image from 'next/image';
import m0 from './img/ml0.png';
import m1 from './img/ml1.png';
import m2 from './img/ml2.png';

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
        <title>Moolah • How To Use Moolah</title>
      </Head>
      <div className="flex">
        <HomeLink className="self-center text-3xl mt-4" />
        <div className="flex spacer" />
        <h1 className="text-3xl mt-4">How To Use Moolah</h1>
        <div className="flex spacer" />
        <button
          className="transition-colors border border-neutral-500 hover:border-neutral-300 p-2 rounded"
          onClick={logout}>Logout
        </button>
      </div>
      <div className="card">
        <h1 className="text-3xl">🔍 Search Stocks </h1>
        <p> In the homepage, you can type in the name of a stock or cryptocurrency to search.
        The name does not need to be exact to find the result you're looking for.</p>
        <Image src={m0} layout='responsive'/>
      </div>
      <div className="card">
        <h1 className="text-3xl">⚖️ Compare Stocks</h1>
        <p>In the search results, you can select the checkbox of stocks you wish to compare.
        The checkboxes can be selected across multiple searches.</p>
        <Image src={m1} layout='responsive'/>
      </div>
      <div className="card">
        <h1 className="text-3xl">⭐ Pin Stocks</h1>
        <p>To pin a stock and save it to your favorites, simply click on the star icon next to
        the stock and it will show up on your dashboard.</p>
        <Image src={m2} layout='responsive'/>
      </div>
    </div>
  )
};

export default Dashboard;
