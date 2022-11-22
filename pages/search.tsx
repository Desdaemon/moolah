import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next/types";
import { useRef, useState } from "react";
import Checkbox from "../components/checkbox";
import HomeLink from "../components/homelink";
import { Match, MatchK, search } from "../utils/api";
import { uri } from "../utils/common";
import { MdStar, MdStarBorder } from 'react-icons/md'

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

function useSymbols() {
  // symbols is still the same set, but each dispatch is guaranteed to refresh
  const [{symbols}, setSymbol] = useState({symbols: new Set<string>()})
  return [symbols, (symbol?: string) => {
    if (symbol) {
      symbols.delete(symbol) || symbols.add(symbol)
    } else {
      symbols.clear()
    }
    setSymbol({ symbols })
  }] as const
}

const Search: NextPage<SearchProps> = (props) => {
  const searchRef = useRef<HTMLInputElement>()
  const router = useRouter()
  const [symbols, setSymbol] = useSymbols()
  const [favorites, setFavorites] = useSymbols()

  return (
    <div className="container mx-auto">
      <Head>
        <title>Moolah • Search</title>
      </Head>
      <div className="flex flex-row">
        <HomeLink className="text-3xl mt-4" />
        <form onSubmit={event => {
          event.preventDefault()
          router.push(uri`/search?q=${searchRef.current!.value || ''}`)
        }}>
          <label htmlFor="search">
            <input
              ref={ref => {
                if (ref) {
                  ref.value = props.initialQuery
                  searchRef.current = ref
                }
              }}
              className="rounded-full indent-3 min-w-[300px] m-4 h-10 border border-neutral-500"
              name="search"
              placeholder="Search for symbols, cryptocurrencies" />
          </label>
        </form>
      </div>
      {symbols.size > 0 && (
        <div className="flex flex-row gap-2 my-2">
          <span>{symbols.size} symbol{symbols.size > 1 ? 's' : ''} selected</span>
          <button
            className="rounded px-2 bg-primary font-bold text-white"
            onClick={() =>
              router.push(uri`/compare?${
                [...symbols].map(symbol => `s=${symbol}`).join("&")}`)}>Compare</button>
          <button
            className="rounded px-2 bg-secondary font-bold text-white"
            onClick={() => setSymbol()}>Clear all</button>
        </div>
      )}
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
              href={uri`/details/${symbol}`}
              key={symbol}>
              <div key={symbol} className="card relative m-0">
                <h1 title={closed ? 'Closed' : 'Open'} className="inline-flex">
                  {openTime && closeTime && (
                    <div
                      className={`h-2.5 self-center mr-1 aspect-square rounded-full ${closed ? 'bg-red-500' : 'bg-green-500'}`} />
                  )}
                  <span className="text-2xl">
                    {result[MatchK.symbol]}
                  </span>
                </h1>
                <p className="text-sm text-neutral-500">
                  {result[MatchK.name]}{" • "}{result[MatchK.region]}
                </p>
                <div className="flex flex-row gap-2 mt-2">
                  <div
                    title="Type"
                    className="badge bg-primary text-white">{result[MatchK.type]}</div>
                  <div
                    title="Currency"
                    className="badge bg-secondary text-white">
                    {flag && <span className="pr-1">{flag}</span>}
                    {result[MatchK.currency]}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <Checkbox
                    className="w-6 h-6"
                    checked={symbols.has(symbol)}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      setSymbol(symbol)
                    }}
                  />
                  <Checkbox
                    className="w-6 h-6"
                    checked={favorites.has(symbol)}
                    checkedIcon={MdStar}
                    uncheckedIcon={MdStarBorder}
                    color="orange"
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      setFavorites(symbol)
                    }}
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      {!props.results.length && (
        <span className="text-3xl text-gray-400 font-bold">No results found.</span>
      )}
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
