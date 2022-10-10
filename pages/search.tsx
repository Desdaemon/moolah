import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next/types";
import { useRef } from "react";
import { BestMatches, BestMatchesKeys, search } from "../utils/api";

interface SearchProps {
  results: BestMatches[]
  initialQuery: string
}

const Search: NextPage<SearchProps> = (props) => {
  const searchRef = useRef<HTMLInputElement>()
  const router = useRouter()
  return (
    <div className="container">
      <form onSubmit={event => {
        event.preventDefault()
        router.push(`/search?q=${encodeURIComponent(searchRef.current!.value || '')}`)
      }}>
        <label htmlFor="search">
          <input
            ref={ref => {
              if (ref) {
                ref.value = props.initialQuery
                searchRef.current = ref
              }
            }}
            className="rounded-full indent-3 min-w-[300px] m-4 h-10 border border-slate-700"
            name="search"
            placeholder="Search for signals, cryptocurrencies" />
        </label>
      </form>
      {props.results.map(result => {
        const symbol = encodeURIComponent(result[BestMatchesKeys.symbol])
        return (
          <Link
            href={`/details/${symbol}`}
            key={result[BestMatchesKeys.symbol]}>
            <div className="card cursor-pointer">
              <pre>{JSON.stringify(result, undefined, 2)}</pre>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Search

export const getServerSideProps: GetServerSideProps<SearchProps> =
  async context => {
    let q = context.query.q || []
    let qs = typeof q === 'string' ? q : q.join(' ')
    const { bestMatches } = await search(qs)
    if (bestMatches) {
      bestMatches.sort((a, b) =>
        b[BestMatchesKeys.matchScore] > a[BestMatchesKeys.matchScore] ? 1 : 0)
    }
    return {
      props: {
        results: bestMatches ?? [],
        initialQuery: qs,
      }
    }
  }
