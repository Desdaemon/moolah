import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import HomeLink from "../components/homelink";
import { uri } from "../utils/common";
import { useElementRef } from "../utils/hooks";

const Homepage: NextPage = () => {
  const searchRef = useElementRef<'input'>();
  const router = useRouter()
  const user = useUser()
  return (
    <div className="container mx-auto">
      <div className="absolute m-2 p-2 flex flex-row">
        <Link href="/me">
          {user ? user.email || 'User' : 'Login'}
        </Link>
      </div>
      <div className="grid place-items-center h-screen">
        <div className="text-center">
          <HomeLink className="text-8xl" />
          <div className="text-3xl">Finance made easy!</div>
          <form onSubmit={event => {
            event.preventDefault()
            router.push(uri`/search?q=${searchRef.current!.value || ''}`)
          }}>
            <label htmlFor="search">
              <input
                ref={searchRef}
                className="min-w-[400px] indent-3 m-4 h-10 rounded-full"
                name="search"
                placeholder="Search for symbol, company or crypto" />
            </label>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Homepage