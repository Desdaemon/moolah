import pl from 'nodejs-polars'

export interface Data {
  date: Date
  df: pl.DataFrame
}
// const data = new Map<string, Data>()

export interface SymbolDataOptions {
  period1: Date | number
  period2: Date | number
  interval: string
  events: 'history' | 'div' | 'split' | 'capitalGain'
  revalidate: number
}

const HOUR_S = 60 * 60
const YEAR = 360 * 24 * HOUR_S * 1000

/** Return a timestamped {@link pl.DataFrame} with six metrics:
  - `Open`
  - `High`
  - `Low`
  - `Close`
  - `Adj Close`
  - `Volume`

  By default, `opts` will be ignored if a cached version is found.
  If using a custom query, set `opts.cached` to false.
*/
export async function symbolData(symbol: string, opts?: Partial<SymbolDataOptions>) {
  const now = new Date()
  const start = new Date(now.getTime() - YEAR)
  const {revalidate, ...rest} = {
    revalidate: HOUR_S,
    period1: start,
    period2: now,
    interval: '1d',
    events: 'history' as const,
    ...opts
  }
  // const symbolData = data.get(symbol)
  // if (symbolData && cached && !shouldRefresh(symbolData)) {
  //   console.log(`Cache hit for ${symbol}`)
  //   return {data: symbolData.df}
  // }
  const query = new URLSearchParams(toQuery(rest))
  const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?${query}`
  const res = await fetch(url, { next: { revalidate } })
  const text = await res.text()
  if (res.status >= 400) {
    return {error: {code: res.status, message: `${res.statusText}\n${text}`}}
  }

  let df = pl.readCSV(text, { parseDates: true })
  // if (cached) data.set(symbol, {date: now, df})
  return {data: df}
}

// function shouldRefresh({ date }: Data) {
//   return Date.now() - date.getTime() > HOUR
// }

function toQuery(query: Omit<SymbolDataOptions, 'revalidate'>) {
  const {period1, period2, ...rest} = query
  return {
    period1: toYahooTimestamp(period1),
    period2: toYahooTimestamp(period2),
    ...rest,
    includeAdjustedClose: 'true'
  }
}

/** Formats the date to a 10-character Unix timestamp. */
function toYahooTimestamp(period: Date | number) {
  const ret = typeof period === 'number' ? period.toString()
    : period.getTime().toString()
  return ret.substring(0, 10)
}