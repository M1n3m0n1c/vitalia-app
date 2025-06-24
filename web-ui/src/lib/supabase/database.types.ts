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
      // Tabela de usuários/médicos
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          crm: string | null
          specialty: string | null
          phone: string | null
          organization_id: string | null
          role: 'doctor' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          crm?: string | null
          specialty?: string | null
          phone?: string | null
          organization_id?: string | null
          role?: 'doctor' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          crm?: string | null
          specialty?: string | null
          phone?: string | null
          organization_id?: string | null
          role?: 'doctor' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // Tabela de pacientes
      patients: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string | null
          cpf: string | null
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | null
          address: Json | null
          medical_history: string | null
          doctor_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          phone?: string | null
          cpf?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: Json | null
          medical_history?: string | null
          doctor_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          cpf?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: Json | null
          medical_history?: string | null
          doctor_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'patients_doctor_id_fkey'
            columns: ['doctor_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      // Tabela de questionários
      questionnaires: {
        Row: {
          id: string
          title: string
          description: string | null
          questions: Json
          category: string | null
          is_active: boolean
          doctor_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          questions: Json
          category?: string | null
          is_active?: boolean
          doctor_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          questions?: Json
          category?: string | null
          is_active?: boolean
          doctor_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'questionnaires_doctor_id_fkey'
            columns: ['doctor_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      // Tabela de respostas
      responses: {
        Row: {
          id: string
          questionnaire_id: string
          patient_id: string
          answers: Json
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          questionnaire_id: string
          patient_id: string
          answers: Json
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          questionnaire_id?: string
          patient_id?: string
          answers?: Json
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'responses_questionnaire_id_fkey'
            columns: ['questionnaire_id']
            referencedRelation: 'questionnaires'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'responses_patient_id_fkey'
            columns: ['patient_id']
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
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
      user_role: 'doctor' | 'admin'
      gender: 'male' | 'female' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos de conveniência para uso na aplicação
export type User = Database['public']['Tables']['users']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type Questionnaire =
  Database['public']['Tables']['questionnaires']['Row']
export type Response = Database['public']['Tables']['responses']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type QuestionnaireInsert =
  Database['public']['Tables']['questionnaires']['Insert']
export type ResponseInsert = Database['public']['Tables']['responses']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']
export type QuestionnaireUpdate =
  Database['public']['Tables']['questionnaires']['Update']
export type ResponseUpdate = Database['public']['Tables']['responses']['Update']
