const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo'
const base = 'https://www.alphavantage.co/query'


/** PRIVACY: Do not use this directly from the frontend, as the request includes the API key. */
export function search(keywords: string) {
  const q = new URL(base)
  const params = q.searchParams
  params.set('function', 'SYMBOL_SEARCH')
  params.set('keywords', keywords)
  params.set('apikey', ALPHA_VANTAGE_API_KEY)
  return fetch(q).then(toJson<SearchResults>)
}


/** PRIVACY: Do not use this directly from the frontend, as the request includes the API key. */
export async function timeseries(opts: TimeseriesOpts) {
  const q = new URL(base)
  const params = q.searchParams
  params.set('function', timeseriesMap[opts.scale])
  params.set('symbol', opts.symbol)
  if (opts.full) params.set('outputsize', 'full')
  params.set('apikey', ALPHA_VANTAGE_API_KEY)
  const dp = await fetch(q).then(toJson<any>)
  return dp[timeseriesRootMap[opts.scale]] as Datapoints | undefined
}

// End of functions


const toJson = <T>(e: Response) => e.json() as Promise<T>

const timeseriesMap = {
  daily: 'TIME_SERIES_DAILY',
  weekly: 'TIME_SERIES_WEEKLY',
  monthly: 'TIME_SERIES_MONTHLY'
} as const

const timeseriesRootMap = {
  daily: 'Time Series (Daily)',
  weekly: 'Weekly Time Series',
  monthly: 'Monthly Time Series'
} as const

interface TimeseriesOpts {
  symbol: string
  scale: 'daily' | 'weekly' | 'monthly'
  full?: boolean
}

interface SearchResults {
  bestMatches?: BestMatches[]
}

export type BestMatches = Record<BestMatchesKeys, string>
export const enum BestMatchesKeys {
  symbol = '1. symbol',
  name = '2. name',
  type = '3. type',
  region = '4. region',
  marketOpen = '5. marketOpen',
  marketClose = '6. marketClose',
  timezone = '7. timezone',
  currency = '8. currency',
  matchScore = '9. matchScore'
}

export const enum DatapointKeys {
  open = '1. open',
  high = '2. high',
  low = '3. low',
  close = '4. close',
  volume = '5. volume'
}

export type Datapoints = Record<string, Record<DatapointKeys, string>>
