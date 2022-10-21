import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createBrowserSupabaseClient()

export function fetcher(method: 'GET' | 'POST' | 'DELETE', body?: any) {
  return (url: string) => fetch(url, { method, body }).then(res => res.json())
}