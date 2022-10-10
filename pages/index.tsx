import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useElementRef } from "../utils/hooks";

const Homepage: NextPage = () => {
  const searchRef = useElementRef<'input'>();
  const router = useRouter()
  return (
    <div className="grid place-items-center h-screen">
      <div className="text-center w-screen">
        <h1 className="text-3xl font-bold">
          <span className="rainbow">Moolah</span>
        </h1>
        <div>Finance made easy!</div>
        <form onSubmit={event => {
          event.preventDefault()
          const q = new URLSearchParams({ q: searchRef.current!.value || '' })
          router.push('/search?' + q.toString())
        }}>
          <label htmlFor="search">
            <input
              ref={searchRef}
              className="min-w-[400px] text-black rounded-full"
              name="search"
              type="text"
              placeholder="Search for signals or cryptocurrency" />
          </label>
        </form>
      </div>
    </div>
  )
}

export default Homepage