import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Patient {
  id: string
  full_name: string
  email: string | null
}

interface PatientSelectModalProps {
  open: boolean
  onClose: () => void
  onSelect: (patient: Patient) => void
}

export function PatientSelectModal({ open, onClose, onSelect }: PatientSelectModalProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Patient | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/patients?limit=20&search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setPatients(data.data || []))
      .finally(() => setLoading(false))
  }, [search, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Selecione um paciente</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar paciente pelo nome ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="max-h-60 overflow-y-auto space-y-2">
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : patients.length === 0 ? (
            <div className="text-center text-muted-foreground">Nenhum paciente encontrado.</div>
          ) : (
            patients.map(patient => (
              <div
                key={patient.id}
                className={`flex items-center justify-between rounded px-3 py-2 cursor-pointer border ${selected?.id === patient.id ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'}`}
                onClick={() => setSelected(patient)}
              >
                <div>
                  <div className="font-medium">{patient.full_name}</div>
                  <div className="text-xs text-muted-foreground">{patient.email}</div>
                </div>
                {selected?.id === patient.id && <span className="text-primary text-xs">Selecionado</span>}
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