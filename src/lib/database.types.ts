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
      messages: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      polls: {
        Row: {
          created_at: string
          id: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: number
          poll_id: number
          position: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          poll_id: number
          position: number
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          poll_id?: number
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_poll_id_fkey"
            columns: ["poll_id"]
            referencedRelation: "polls"
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
