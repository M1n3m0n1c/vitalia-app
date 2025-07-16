import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Question } from '@/types/questionnaire'

interface QuestionnaireBuilderState {
  questions: Question[]
  setQuestions: (questions: Question[]) => void
  addQuestions: (newQuestions: Question[]) => void
  clearQuestions: () => void
}

export const useQuestionnaireBuilderStore = create<QuestionnaireBuilderState>()(
  persist(
    (set) => ({
      questions: [],
      setQuestions: (questions) => set({ questions }),
      addQuestions: (newQuestions) => set((state) => ({
        questions: [
          ...state.questions,
          ...newQuestions.map((q, idx) => ({
            ...q,
            id: `question_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
            order: state.questions.length + idx
          }))
        ]
      })),
      clearQuestions: () => set({ questions: [] })
    }),
    {
      name: 'questionnaire-builder-storage',
      skipHydration: true
    }
  )
) 