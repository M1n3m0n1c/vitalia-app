export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type:
            | Database["public"]["Enums"]["appointment_type"]
            | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string | null
          description: string | null
          doctor_id: string
          end_time: string
          id: string
          location: string | null
          notes: string | null
          patient_id: string
          reminder_sent: boolean | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          appointment_type?:
            | Database["public"]["Enums"]["appointment_type"]
            | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          description?: string | null
          doctor_id: string
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          patient_id: string
          reminder_sent?: boolean | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          appointment_type?:
            | Database["public"]["Enums"]["appointment_type"]
            | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          description?: string | null
          doctor_id?: string
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string
          reminder_sent?: boolean | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_images: {
        Row: {
          body_region: string | null
          category: string | null
          created_at: string | null
          doctor_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          notes: string | null
          patient_id: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          body_region?: string | null
          category?: string | null
          created_at?: string | null
          doctor_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          patient_id: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          body_region?: string | null
          category?: string | null
          created_at?: string | null
          doctor_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          patient_id?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_images_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_images_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_notes: {
        Row: {
          created_at: string | null
          doctor_id: string
          id: string
          note_text: string
          patient_id: string
          question_id: string | null
          response_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id: string
          id?: string
          note_text: string
          patient_id: string
          question_id?: string | null
          response_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string
          id?: string
          note_text?: string
          patient_id?: string
          question_id?: string | null
          response_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_notes_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_notes_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: Json | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_documents: {
        Row: {
          created_at: string | null
          description: string | null
          doctor_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number
          id: string
          is_sensitive: boolean | null
          mime_type: string
          original_name: string
          patient_id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          doctor_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number
          id?: string
          is_sensitive?: boolean | null
          mime_type: string
          original_name: string
          patient_id: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          doctor_id?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          is_sensitive?: boolean | null
          mime_type?: string
          original_name?: string
          patient_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: Json | null
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          deleted_at: string | null
          doctor_id: string
          email: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          medical_history: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          doctor_id: string
          email?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          medical_history?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          doctor_id?: string
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          medical_history?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      public_links: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_used: boolean | null
          patient_id: string
          questionnaire_id: string
          token: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_used?: boolean | null
          patient_id: string
          questionnaire_id: string
          token?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean | null
          patient_id?: string
          questionnaire_id?: string
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_links_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_links_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaires: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          doctor_id: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          questions: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          doctor_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          questions: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          doctor_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaires_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_bank: {
        Row: {
          category: string | null
          created_at: string | null
          doctor_id: string | null
          id: string
          is_default: boolean | null
          options: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          specialty: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_default?: boolean | null
          options?: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          specialty?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_default?: boolean | null
          options?: Json | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          specialty?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_bank_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string | null
          id: string
          patient_id: string
          questionnaire_id: string
          updated_at: string | null
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          patient_id: string
          questionnaire_id: string
          updated_at?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string
          questionnaire_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          crm: string | null
          email: string
          full_name: string | null
          id: string
          organization_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          specialty: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crm?: string | null
          email: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          specialty?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crm?: string | null
          email?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          specialty?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_questionnaire_publicly_accessible: {
        Args: { questionnaire_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      appointment_type:
        | "consultation"
        | "follow_up"
        | "procedure"
        | "evaluation"
        | "emergency"
        | "telemedicine"
      document_type:
        | "identity"
        | "medical"
        | "insurance"
        | "consent"
        | "prescription"
        | "report"
        | "other"
      gender: "male" | "female" | "other"
      question_type:
        | "text"
        | "radio"
        | "checkbox"
        | "scale"
        | "date"
        | "file"
        | "yes_no"
        | "slider"
      user_role: "doctor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      appointment_type: [
        "consultation",
        "follow_up",
        "procedure",
        "evaluation",
        "emergency",
        "telemedicine",
      ],
      document_type: [
        "identity",
        "medical",
        "insurance",
        "consent",
        "prescription",
        "report",
        "other",
      ],
      gender: ["male", "female", "other"],
      question_type: [
        "text",
        "radio",
        "checkbox",
        "scale",
        "date",
        "file",
        "yes_no",
        "slider",
      ],
      user_role: ["doctor", "admin"],
    },
  },
} as const

// Tipos de conveniência para melhor DX
export type User = Database['public']['Tables']['users']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type Questionnaire = Database['public']['Tables']['questionnaires']['Row']
export type Response = Database['public']['Tables']['responses']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type QuestionnaireInsert = Database['public']['Tables']['questionnaires']['Insert']
export type ResponseInsert = Database['public']['Tables']['responses']['Insert']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']
export type QuestionnaireUpdate = Database['public']['Tables']['questionnaires']['Update']
export type ResponseUpdate = Database['public']['Tables']['responses']['Update']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

export type QuestionBank = Database['public']['Tables']['questions_bank']['Row']
export type QuestionBankInsert = Database['public']['Tables']['questions_bank']['Insert']
export type QuestionBankUpdate = Database['public']['Tables']['questions_bank']['Update']

export type MedicalNote = Database['public']['Tables']['medical_notes']['Row']
export type MedicalNoteInsert = Database['public']['Tables']['medical_notes']['Insert']
export type MedicalNoteUpdate = Database['public']['Tables']['medical_notes']['Update']

export type PublicLink = Database['public']['Tables']['public_links']['Row']
export type PublicLinkInsert = Database['public']['Tables']['public_links']['Insert']
export type PublicLinkUpdate = Database['public']['Tables']['public_links']['Update']

export type QuestionType = Database['public']['Enums']['question_type']
export type UserRole = Database['public']['Enums']['user_role']
export type Gender = Database['public']['Enums']['gender']
export type AppointmentStatus = Database['public']['Enums']['appointment_status']
export type AppointmentType = Database['public']['Enums']['appointment_type']
