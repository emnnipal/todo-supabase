export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          created_at: string
          id: number
          is_done: boolean
          updated_at: string | null
          user_id: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_done?: boolean
          updated_at?: string | null
          user_id: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_done?: boolean
          updated_at?: string | null
          user_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
