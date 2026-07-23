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
      profiles: {
        Row: {
          id: string
          kinde_user_id: string
          name: string
          email: string
          profile_picture: string | null
          registration_status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
          role: 'Guest' | 'Student' | 'Approved Student' | 'Admin' | 'Super Admin'
          chamber_access: boolean
          course_completed: boolean
          institution: string | null
          debate_format: string | null
          experience_years: number
          admission_code: string | null
          completed_sessions: number[]
          created_at: string
          updated_at: string
          last_login_at?: string | null
          registration_completed?: boolean
          registered_at?: string | null
        }
        Insert: {
          id?: string
          kinde_user_id: string
          name: string
          email: string
          profile_picture?: string | null
          registration_status?: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
          role?: 'Guest' | 'Student' | 'Approved Student' | 'Admin' | 'Super Admin'
          chamber_access?: boolean
          course_completed?: boolean
          institution?: string | null
          debate_format?: string | null
          experience_years?: number
          admission_code?: string | null
          completed_sessions?: number[]
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          registration_completed?: boolean
          registered_at?: string | null
        }
        Update: {
          id?: string
          kinde_user_id?: string
          name?: string
          email?: string
          profile_picture?: string | null
          registration_status?: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
          role?: 'Guest' | 'Student' | 'Approved Student' | 'Admin' | 'Super Admin'
          chamber_access?: boolean
          course_completed?: boolean
          institution?: string | null
          debate_format?: string | null
          experience_years?: number
          admission_code?: string | null
          completed_sessions?: number[]
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          registration_completed?: boolean
          registered_at?: string | null
        }
      }
      workshop_registrations: {
        Row: {
          id: string
          profile_id: string | null
          kinde_user_id: string | null
          name: string
          email: string
          phone: string | null
          institution: string | null
          status: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          kinde_user_id?: string | null
          name: string
          email: string
          phone?: string | null
          institution?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          kinde_user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          institution?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id?: string | null
          kinde_user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          institution?: string | null
          debate_format?: string | null
          experience_years?: number
          bkash_trx_id?: string | null
          admission_letter_code?: string | null
          status: string
          approval_status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | 'pending' | 'approved' | 'rejected' | 'suspended'
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          kinde_user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          institution?: string | null
          debate_format?: string | null
          experience_years?: number
          bkash_trx_id?: string | null
          admission_letter_code?: string | null
          status?: string
          approval_status?: 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | 'pending' | 'approved' | 'rejected' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          kinde_user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          institution?: string | null
          debate_format?: string | null
          experience_years?: number
          bkash_trx_id?: string | null
          admission_letter_code?: string | null
          status?: string
          approval_status?: 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | 'pending' | 'approved' | 'rejected' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      speakers: {
        Row: {
          id: string
          name: string
          title: string | null
          bio: string | null
          photo_url: string | null
          achievements: Json
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          title?: string | null
          bio?: string | null
          photo_url?: string | null
          achievements?: Json
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string | null
          bio?: string | null
          photo_url?: string | null
          achievements?: Json
          order_index?: number
          created_at?: string
        }
      }
      workshops: {
        Row: {
          id: string
          session_number: number
          title: string
          description: string | null
          speaker_id: string | null
          speaker_name: string | null
          date: string | null
          time: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          session_number: number
          title: string
          description?: string | null
          speaker_id?: string | null
          speaker_name?: string | null
          date?: string | null
          time?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          session_number?: number
          title?: string
          description?: string | null
          speaker_id?: string | null
          speaker_name?: string | null
          date?: string | null
          time?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
      workshop_sessions: {
        Row: {
          id: string
          workshop_id: string | null
          session_number: number
          title: string
          assigned_speaker: string | null
          video_type: 'youtube' | 'gdrive'
          embed_url: string
          created_at: string
        }
        Insert: {
          id?: string
          workshop_id?: string | null
          session_number: number
          title: string
          assigned_speaker?: string | null
          video_type?: 'youtube' | 'gdrive'
          embed_url: string
          created_at?: string
        }
        Update: {
          id?: string
          workshop_id?: string | null
          session_number?: number
          title?: string
          assigned_speaker?: string | null
          video_type?: 'youtube' | 'gdrive'
          embed_url?: string
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          signatory_name: string | null
          signatory_title: string | null
          template_url: string | null
          qr_code_enabled: boolean
          verification_base_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          signatory_name?: string | null
          signatory_title?: string | null
          template_url?: string | null
          qr_code_enabled?: boolean
          verification_base_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          signatory_name?: string | null
          signatory_title?: string | null
          template_url?: string | null
          qr_code_enabled?: boolean
          verification_base_url?: string | null
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          date: string | null
          category: string
          is_pinned: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          date?: string | null
          category?: string
          is_pinned?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          date?: string | null
          category?: string
          is_pinned?: boolean
          created_at?: string
        }
      }
      website_cms: {
        Row: {
          id: string
          cms_json: Json
          updated_at: string
        }
        Insert: {
          id?: string
          cms_json: Json
          updated_at?: string
        }
        Update: {
          id?: string
          cms_json?: Json
          updated_at?: string
        }
      }
    }
  }
}
