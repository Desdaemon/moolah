import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'

export const supabase = createBrowserSupabaseClient<Database>()

export function fetcher(method: 'GET' | 'POST' | 'DELETE', body?: any) {
  return (url: string) => fetch(url, { method, body }).then(res => res.json())
}