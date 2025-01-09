
import { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

// Definisikan type aliases untuk Row types
export type DbUser = Database['public']['Tables']['users']['Row']
export type DbGame = Database['public']['Tables']['games']['Row']
export type DbFamilyGroup = Database['public']['Tables']['family_groups']['Row']
export type DbFamilyMember = Database['public']['Tables']['family_members']['Row']
export type DbGamePurchase = Database['public']['Tables']['game_purchases']['Row']

declare global {
  type SupabaseClient = SupabaseClientType<Database>
}

// Definisikan interface
export interface User {
  id: string
  email: string
  family_group_id?: string
  created_at: string
}

export interface Game {
  id: number
  title: string
  description: string | null
  price: number
  genre: string[]
  created_at: string
}

export interface FamilyGroup {
  id: string
  owner_id: string
  name: string
  created_at: string
}

export interface FamilyMember {
  user_id: string
  family_group_id: string
  role: 'owner' | 'member'
  created_at: string
  users: {
    email: string
  }
}

export interface GamePurchase {
  id: string
  game_id: number
  owner_id: string
  purchased_at: string
}