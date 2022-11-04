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

export const enum SeriesKeys {
  open = 'Open',
  high = 'High',
  low = 'Low',
  close = 'Close',
  adjClose = 'Adj Close',
  volume = 'Volume'
}

export interface Series extends Record<SeriesKeys, number[]> {
  Date: string[]
}

export class Hsl {
  constructor(
    /** A degree between 0 and 360 */
    public hue = 180,
    /** A percentage value between 0 and 100  */
    public saturation = 50,
    /** A percentage value between 0 and 100 */
    public lightness = 100,
    /** A fraction value between 0 and 1 */
    public alpha?: number
  ) {}
  
  withAlpha(alpha?: number) {
    return new Hsl(this.hue, this.saturation, this.lightness, alpha)
  }
  
  static random(hue?: number, saturation?: number, lightness?: number) {
    return new Hsl(hue ?? Math.random() * 360, saturation ?? Math.random() * 100, lightness ?? Math.random() * 100)
  }
  
  toString() {
    const hsl = `${this.hue}, ${this.saturation}%, ${this.lightness}%`
    if (typeof this.alpha !== 'undefined') {    
      return `hsla(${hsl}, ${this.alpha})`
    } else {
      return `hsl(${hsl})`
    }
  }
}
