/** Get the first query parameter if it's an array, otherwise the parameter itself. */
export function queryOr(query?: string | string[]) {
  return Array.isArray(query) ? query[0] : query;
}

/** Returns a valid URI. */
export function uri(tmp: TemplateStringsArray, ...parts: any[]) {
  return encodeURI(String.raw(tmp, ...parts));
}
