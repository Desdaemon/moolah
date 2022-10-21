import type { NextPage } from "next";
import { useRouter } from "next/router";
import { fetcher, supabase } from "../utils/client";
import { type User, withPageAuth } from "@supabase/auth-helpers-nextjs";
import HomeLink from "../components/homelink";
import Head from "next/head";
import useSwr from 'swr'
import type { Favorites } from "./api/favorites";

const types = ['Stock', 'Crypto']

const Dashboard: NextPage<{user: User}> = ({ user }) => {
  const router = useRouter()
  const {data: favorites, error} = useSwr<Favorites>('/api/favorites', fetcher('GET'))
  
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
      <HomeLink className="self-center text-3xl mt-4" />
      <div className="card gap-4">
        <h1 className="text-3xl">Dashboard</h1>
        <h2 className="text-2xl my-2">Favorites</h2>
        {error && <span className="text-red-500">Could not get favorites.</span>}
        {favorites?.length ? (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map(fav => (
              <div key={fav.name} className="rounded border border-neutral-500 p-2">
                <span className="text-lg">
                  {fav.name}
                  {fav.type !== null && (<span className="text-neutral-500 text-sm"><br />{types[fav.type]}</span>)}
                </span>
              </div>
            ))}
          </div>
        ) : (<div>No favorites yet...</div>)} 
        <button
          className="transition-colors border border-neutral-500 hover:border-neutral-300 p-2 my-2 rounded"
          onClick={logout}>Logout</button>
      </div>
    </div>
  )
};

export default Dashboard;

export const getServerSideProps = withPageAuth({ redirectTo: '/login?from=/me' })