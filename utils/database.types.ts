export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      favorites: {
        Row: {
          id: number
          user_id: string
          name: string
          type: number | null
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          type?: number | null
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          type?: number | null
        }
      }
      Users: {
        Row: {
          "user-id": string
          "pinned-stocks": Json | null
        }
        Insert: {
          "user-id": string
          "pinned-stocks"?: Json | null
        }
        Update: {
          "user-id"?: string
          "pinned-stocks"?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
