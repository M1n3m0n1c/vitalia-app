import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Questionnaire {
  id: string
  title: string
  description?: string
}

interface QuestionnaireSelectModalProps {
  open: boolean
  onClose: () => void
  onSelect: (questionnaire: Questionnaire) => void
}

export function QuestionnaireSelectModal({ open, onClose, onSelect }: QuestionnaireSelectModalProps) {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Questionnaire | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/questionnaires?limit=20&search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setQuestionnaires(data.data || []))
      .finally(() => setLoading(false))
  }, [search, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Selecione um questionário</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar questionário pelo título..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="max-h-60 overflow-y-auto space-y-2">
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : questionnaires.length === 0 ? (
            <div className="text-center text-muted-foreground">Nenhum questionário encontrado.</div>
          ) : (
            questionnaires.map(q => (
              <div
                key={q.id}
                className={`flex items-center justify-between rounded px-3 py-2 cursor-pointer border ${selected?.id === q.id ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'}`}
                onClick={() => setSelected(q)}
              >
                <div>
                  <div className="font-medium">{q.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{q.description}</div>
                </div>
                {selected?.id === q.id && <span className="text-primary text-xs">Selecionado</span>}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 