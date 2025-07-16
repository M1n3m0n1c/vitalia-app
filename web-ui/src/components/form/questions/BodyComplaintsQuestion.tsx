"use client"

import React, { useState, useEffect, useRef, createRef } from 'react'
import Script from 'next/script'
import { BodySVG } from '@/components/facial/BodySVG'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type LeaderLine from 'leader-line'
import type { Question } from '@/types/questionnaire'

interface BodyComplaintsQuestionProps {
  question: Question
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

const bodyComplaints = [
  // Coluna Esquerda (ordenada de cima para baixo visualmente)
  {
    id: 'papada',
    region: 'papada',
    text: 'Papada',
    side: 'left',
  },
  {
    id: 'pescoco',
    region: 'pescoço',
    text: 'Pescoço',
    side: 'left',
  },
  {
    id: 'colo',
    region: 'colo',
    text: 'Colo',
    side: 'left',
  },
  {
    id: 'mama',
    region: 'mama',
    text: 'Mama',
    side: 'left',
  },
  {
    id: 'abdomen',
    region: 'abdômen',
    text: 'Abdômen',
    side: 'left',
  },
  {
    id: 'umbigo',
    region: 'umbigo',
    text: 'Umbigo',
    side: 'left',
  },
  {
    id: 'intimo',
    region: 'íntimo',
    text: 'Íntimo',
    side: 'left',
  },
  {
    id: 'maos',
    region: 'mãos',
    text: 'Mãos',
    side: 'left',
  },
  {
    id: 'coxa',
    region: 'coxa',
    text: 'Coxa',
    side: 'left',
  },
  {
    id: 'joelho',
    region: 'joelho',
    text: 'Joelho',
    side: 'left',
  },
  // Coluna Direita (ordenada de cima para baixo visualmente)
  {
    id: 'braco',
    region: 'braço',
    text: 'Braço',
    side: 'right',
  },
  {
    id: 'costas',
    region: 'costas',
    text: 'Costas',
    side: 'right',
  },
  {
    id: 'flancos',
    region: 'flancos',
    text: 'Flancos',
    side: 'right',
  },
  {
    id: 'culote',
    region: 'culote',
    text: 'Culote',
    side: 'right',
  },
  {
    id: 'celulite',
    region: 'celulite',
    text: 'Celulite',
    side: 'right',
  },
  {
    id: 'gluteos',
    region: 'glúteos',
    text: 'Glúteos',
    side: 'right',
  },
  {
    id: 'bananinha',
    region: 'bananinha',
    text: 'Bananinha',
    side: 'right',
  },
  {
    id: 'regiao-interna-coxas',
    region: 'região-interna-coxas',
    text: 'Região interna das coxas',
    side: 'right',
  },
]

export function BodyComplaintsQuestion({
  question,
  value = [],
  onChange,
  error,
}: BodyComplaintsQuestionProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const linesRef = useRef<LeaderLine[]>([])
  const itemRefs = useRef(
    bodyComplaints.map(() => createRef<HTMLDivElement>()),
  )
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Sincronizar com o valor externo
  useEffect(() => {
    const newCheckedItems: Record<string, boolean> = {}
    value.forEach(item => {
      newCheckedItems[item] = true
    })
    setCheckedItems(newCheckedItems)
  }, [value])

  useEffect(() => {
    if (!scriptLoaded) return

    const LeaderLineCtor = (window as any).LeaderLine
    if (!LeaderLineCtor) {
      console.error('LeaderLine constructor not found on window object.')
      return
    }

    linesRef.current.forEach(line => line.remove())
    linesRef.current = []

    const drawLines = () => {
      const newLines: LeaderLine[] = []
      bodyComplaints.forEach((complaint, index) => {
        // Tratamento especial para íntimo - criar duas linhas conectadas
        if (complaint.id === 'intimo') {
          const startEl = document.getElementById('marker-intimo')
          const intermediateEl = document.getElementById('marker-intimo-intermediate')
          const endEl = itemRefs.current[index].current

          if (startEl && intermediateEl && endEl) {
            // Primeira linha: do marcador ao ponto intermediário
            const line1 = new LeaderLineCtor(startEl, intermediateEl, {
              color: 'rgba(107, 114, 128, 0.7)',
              size: 1.5,
              path: 'straight',
              startSocket: 'left',
              endSocket: 'right',
              startPlug: 'behind',
              endPlug: 'behind',
              dash: { animation: false, len: 8, gap: 4 },
            })
            
            // Segunda linha: do ponto intermediário ao checkbox
            const line2 = new LeaderLineCtor(intermediateEl, endEl, {
              color: 'rgba(107, 114, 128, 0.7)',
              size: 1.5,
              path: 'fluid',
              startSocket: 'left',
              endSocket: 'right',
              startPlug: 'behind',
              endPlug: 'behind',
              dash: { animation: false, len: 8, gap: 4 },
            })
            
            newLines.push(line1, line2)
          }
        } else if (complaint.id === 'celulite') {
          // Tratamento especial para celulite - criar duas linhas conectadas
          const startEl = document.getElementById('marker-celulite')
          const intermediateEl = document.getElementById('marker-celulite-intermediate')
          const endEl = itemRefs.current[index].current

          if (startEl && intermediateEl && endEl) {
            // Primeira linha: do marcador ao ponto intermediário
            const line1 = new LeaderLineCtor(startEl, intermediateEl, {
              color: 'rgba(107, 114, 128, 0.7)',
              size: 1.5,
              path: 'straight',
              startSocket: 'right',
              endSocket: 'left',
              startPlug: 'behind',
              endPlug: 'behind',
              dash: { animation: false, len: 8, gap: 4 },
            })
            
            // Segunda linha: do ponto intermediário ao checkbox
            const line2 = new LeaderLineCtor(intermediateEl, endEl, {
              color: 'rgba(107, 114, 128, 0.7)',
              size: 1.5,
              path: 'fluid',
              startSocket: 'right',
              endSocket: 'left',
              startPlug: 'behind',
              endPlug: 'behind',
              dash: { animation: false, len: 8, gap: 4 },
            })
            
            newLines.push(line1, line2)
          }
        } else {
          // Lógica normal para outras linhas
          const targetId = `marker-${complaint.id}`
          const startEl = document.getElementById(targetId)
          const endEl = itemRefs.current[index].current

          if (startEl && endEl) {
            const line = new LeaderLineCtor(startEl, endEl, {
              color: 'rgba(107, 114, 128, 0.7)',
              size: 1.5,
              path: 'fluid',
              // Para checkboxes da esquerda: sai do lado esquerdo do marcador
              // Para checkboxes da direita: sai do lado direito do marcador
              startSocket: complaint.side === 'left' ? 'left' : 'right',
              // Para checkboxes da esquerda: conecta no lado direito do checkbox
              // Para checkboxes da direita: conecta no lado esquerdo do checkbox
              endSocket: complaint.side === 'left' ? 'right' : 'left',
              startPlug: 'behind',
              endPlug: 'behind',
              dash: { animation: false, len: 8, gap: 4 },
            })
            newLines.push(line)
          }
        }
      })
      linesRef.current = newLines
    }

    const timeoutId = setTimeout(drawLines, 150)

    const handleResize = () => {
      linesRef.current.forEach(line => line.position())
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      linesRef.current.forEach(line => line.remove())
    }
  }, [scriptLoaded])

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newCheckedItems = { ...checkedItems, [id]: checked }
    setCheckedItems(newCheckedItems)
    
    // Converter para array de strings
    const selectedItems = Object.keys(newCheckedItems).filter(key => newCheckedItems[key])
    onChange(selectedItems)
  }

  const leftItems = bodyComplaints.filter(item => item.side === 'left')
  const rightItems = bodyComplaints.filter(item => item.side === 'right')

  return (
    <>
      <Script
        src="/scripts/leader-line.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{question.question_text}</Label>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 md:gap-x-8 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-y-5 justify-center">
            {leftItems.map(item => {
              const complaintIndex = bodyComplaints.findIndex(
                c => c.id === item.id,
              )
              return (
                <div
                  key={item.id}
                  id={`complaint-${item.id}`}
                  ref={itemRefs.current[complaintIndex]}
                  className="flex items-center justify-end"
                >
                  <label
                    htmlFor={item.id}
                    className="text-sm mr-4 font-medium text-gray-700 text-right cursor-pointer"
                  >
                    {item.text}
                  </label>
                  <Checkbox
                    id={item.id}
                    checked={!!checkedItems[item.id]}
                    onCheckedChange={checked =>
                      handleCheckboxChange(item.id, !!checked)
                    }
                    className="w-5 h-5 rounded-sm focus:ring-offset-0 focus:ring-2 focus:ring-offset-white"
                  />
                </div>
              )
            })}
          </div>

          {/* Center Column - SVG */}
          <div ref={svgContainerRef} className="w-[500px] md:w-[550px] mx-auto">
            <BodySVG />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-y-5 justify-center">
            {rightItems.map(item => {
              const complaintIndex = bodyComplaints.findIndex(
                c => c.id === item.id,
              )
              return (
                <div
                  key={item.id}
                  id={`complaint-${item.id}`}
                  ref={itemRefs.current[complaintIndex]}
                  className="flex items-center"
                >
                  <Checkbox
                    id={item.id}
                    checked={!!checkedItems[item.id]}
                    onCheckedChange={checked =>
                      handleCheckboxChange(item.id, !!checked)
                    }
                    className="w-5 h-5 rounded-sm focus:ring-offset-0 focus:ring-2 focus:ring-offset-white"
                  />
                  <label
                    htmlFor={item.id}
                    className="text-sm ml-4 font-medium text-gray-700 cursor-pointer"
                  >
                    {item.text}
                  </label>
                </div>
              )
            })}
          </div>
        </div>

        {value.length > 0 && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium mb-2">Queixas selecionadas:</h4>
            <p className="text-sm text-gray-600">
              {value.map(id => {
                const complaint = bodyComplaints.find(c => c.id === id)
                return complaint?.text
              }).filter(Boolean).join(', ')}
            </p>
          </div>
        )}
      </div>
    </>
  )
} 