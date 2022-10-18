import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next/types";
import { useRef } from "react";
import { Match, MatchK, search } from "../utils/api";

interface SearchProps {
  results: Match[]
  initialQuery: string
}

const now = new Date()
const commonCurrencies = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBX: '🇬🇧',
  GBP: '🇬🇧',
  CNY: '🇨🇳',
  BRL: '🇧🇷',
  INR: '🇮🇳'
} as Record<string, string | undefined>

function parseTime(hour: string, tz: string) {
  if (!tz.startsWith('UTC')) return
  const timezone = +tz.substring(3)

  const [hour_, minute] = hour.split(':') 
  const date = new Date()
  date.setUTCHours(+hour_ - timezone, +minute, 0, 0)
  return date
}

const Search: NextPage<SearchProps> = (props) => {
  const searchRef = useRef<HTMLInputElement>()
  const router = useRouter()
  return (
    <div className="container mx-auto">
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
      <div className="grid lg:grid-cols-2 gap-4">
        {props.results.map(result => {
          const symbol = result[MatchK.symbol]
          const tz = result[MatchK.timezone]
          const openTime = parseTime(result[MatchK.marketOpen], tz)
          const closeTime = parseTime(result[MatchK.marketClose], tz)
          const closed = openTime && closeTime && (now > closeTime || now < openTime)
          const flag = commonCurrencies[result[MatchK.currency]]
          return (
            <Link
              href={`/details/${encodeURIComponent(symbol)}`}
              key={symbol}>
              <div className="card m-0 cursor-pointer">
                <h1 title={closed ? 'Closed' : 'Open'} className="text-2xl">
                  {openTime && closeTime && (
                    <span className={`pr-1 ${closed ? 'text-red-500' : 'text-green-500'}`}>•</span>
                  )}
                  {result[MatchK.symbol]}
                </h1>
                <p className="text-sm text-slate-500">
                  {result[MatchK.name]}{" • "}{result[MatchK.region]}
                </p>
                <div className="flex flex-row space-x-1 mt-2">
                  <div
                    title="Type"
                    className="badge bg-blue-500 text-white">{result[MatchK.type]}</div>
                  <div
                    title="Currency"
                    className="badge bg-orange-500 text-white">
                    {flag && <span className="pr-1">{flag}</span>}
                    {result[MatchK.currency]}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      {!props.results.length && <span className="text-3xl text-gray-400 font-bold">No results found.</span>}
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
        b[MatchK.matchScore].localeCompare(a[MatchK.matchScore]))
    }
    return {
      props: {
        results: bestMatches ?? [],
        initialQuery: qs,
      }
    }
  }
