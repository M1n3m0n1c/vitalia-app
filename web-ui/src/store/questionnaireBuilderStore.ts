import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Question, QuestionnaireData } from '@/types/questionnaire'

interface QuestionnaireBuilderState {
  questions: Question[]
  questionnaire: Partial<QuestionnaireData>
  isInitialized: boolean
  
  // Actions
  setQuestions: (questions: Question[]) => void
  setQuestionnaire: (questionnaire: Partial<QuestionnaireData>) => void
  addQuestions: (newQuestions: Question[]) => void
  clearQuestions: () => void
  clearAll: () => void
  setInitialized: (initialized: boolean) => void
  resetStore: () => void
}

export const useQuestionnaireBuilderStore = create<QuestionnaireBuilderState>()(
  persist(
    (set, get) => ({
      questions: [],
      questionnaire: {},
      isInitialized: false,
      
      setQuestions: (questions) => {
        const currentQuestions = get().questions
        // Evitar atualização se as perguntas são idênticas
        if (JSON.stringify(currentQuestions) === JSON.stringify(questions)) {
          return
        }
        set({ questions, isInitialized: true })
      },
      
      setQuestionnaire: (questionnaire) => set({ questionnaire }),
      
      addQuestions: (newQuestions) => {
        if (!newQuestions || newQuestions.length === 0) {
          return
        }
        
        set((state) => {
          const currentQuestions = state.questions
          
          // Gerar IDs únicos e ordems sequenciais
          const questionsWithOrder = newQuestions.map((q, idx) => ({
            ...q,
            id: `question_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
            order: currentQuestions.length + idx
          }))
          
          const finalQuestions = [...currentQuestions, ...questionsWithOrder]
          
          return {
            questions: finalQuestions,
            isInitialized: true
          }
        })
      },
      
      clearQuestions: () => set({ questions: [] }),
      
      clearAll: () => set({ questions: [], questionnaire: {}, isInitialized: false }),
      
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      
      resetStore: () => {
        set({ questions: [], questionnaire: {}, isInitialized: false })
        // Limpar também do localStorage
        localStorage.removeItem('questionnaire-builder-storage')
      }
    }),
    {
      name: 'questionnaire-builder-storage',
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      }
    }
  )
) 