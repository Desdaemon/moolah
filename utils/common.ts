/** Get the first query parameter if it's an array, otherwise the parameter itself. */
export function queryOr(query?: string | string[]) {
  return Array.isArray(query) ? query[0] : query;
}

/** Get the query as an array. */
export function queriesOf(query?: string | string[]) {
  return typeof query === 'string' ? [query] : query
}

/** Returns a valid URI. */
export function uri(tmp: TemplateStringsArray, ...parts: any[]) {
  return encodeURI(String.raw(tmp, ...parts));
}

export function dbg<T>(value: T) {
  console.log(value)
  return value
}

export const enum DatapointKeys {
  open = 'Open',
  high = 'High',
  low = 'Low',
  close = 'Close',
  adjClose = 'Adj Close',
  volume = 'Volume'
}

export interface Details extends Record<DatapointKeys, number[]> {
  Date: string[]
}
