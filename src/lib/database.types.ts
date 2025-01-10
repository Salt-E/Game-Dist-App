// lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          family_group_id?: string
        }
        Insert: {
          id: string
          email: string
          family_group_id?: string
        }
        Update: {
          id?: string
          email?: string
          family_group_id?: string
        }
      }
    }
  }
  public:{
    Tables: {
      family_groups: {
        Row: {
          id: string
          owner_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          created_at?: string
        }
      }
      family_members: {
        Row: {
          user_id: string
          family_group_id: string
          role: 'owner' | 'member'
          created_at: string
          users: {
            email: string
          }
        }
        Insert: {
          user_id: string
          family_group_id: string
          role: 'owner' | 'member'
          created_at?: string
        }
        Update: {
          user_id?: string
          family_group_id?: string
          role?: 'owner' | 'member'
          created_at?: string
        }
      }
      games: {
        Row: {
          id: number
          title: string
          description: string | null
          price: number
          created_at: string
          genre: string[]
        }
        Insert: {
          id: number
          title: string
          description?: string | null
          price: number
          created_at?: string
          genre?: string[]
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          price?: number
          created_at?: string
          genre?: string[]
        }
      }
      game_purchases: {
        Row: {
          id: string
          game_id: number
          owner_id: string
          purchased_at: string
        }
        Insert: {
          id?: string
          game_id: number
          owner_id: string
          purchased_at?: string
        }
        Update: {
          id?: string
          game_id?: number
          owner_id?: string
          purchased_at?: string
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
