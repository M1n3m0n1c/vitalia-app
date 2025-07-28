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
  console.log('Body: Componente montado/remontado')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const linesRef = useRef<LeaderLine[]>([])
  const itemRefs = useRef(
    bodyComplaints.map(() => createRef<HTMLDivElement>()),
  )
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      console.log('Body: Componente desmontado, limpando linhas')
      linesRef.current.forEach(line => {
        try {
          line.remove()
        } catch (e) {
          // Ignorar erros de cleanup
        }
      })
      linesRef.current = []
    }
  }, [])

  // Sincronizar com o valor externo
  useEffect(() => {
    const newCheckedItems: Record<string, boolean> = {}
    value.forEach(item => {
      newCheckedItems[item] = true
    })
    setCheckedItems(newCheckedItems)
  }, [value])

  // Verificar se o script já está carregado na inicialização
  useEffect(() => {
    const checkScript = () => {
      if ((window as any).LeaderLine && !scriptLoaded) {
        console.log('Body: LeaderLine detectado, marcando como carregado')
        setScriptLoaded(true)
      }
    }
    
    // Verificar imediatamente
    checkScript()
    
    // Verificar novamente após um pequeno delay caso o script esteja carregando
    const timeoutId = setTimeout(checkScript, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!scriptLoaded) {
      console.log('Body: Script não carregado ainda, aguardando...')
      return
    }

    const LeaderLineCtor = (window as any).LeaderLine
    if (!LeaderLineCtor) {
      console.error('Body: LeaderLine constructor not found on window object.')
      return
    }

    console.log('Body: Iniciando desenho das linhas...')

    linesRef.current.forEach(line => line.remove())
    linesRef.current = []

    const drawLines = () => {
      console.log('Body: Função drawLines executando...')
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
      console.log(`Body: ${newLines.length} linhas criadas`)
    }

    const timeoutId = setTimeout(drawLines, 300)

    const handleResize = () => {
      linesRef.current.forEach(line => line.position())
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      linesRef.current.forEach(line => {
        try {
          line.remove()
        } catch (e) {
          // Ignorar erros de cleanup se o elemento já foi removido
        }
      })
      linesRef.current = []
    }
  }, [scriptLoaded])

  const handleCheckboxChange = (id: string, checked: boolean) => {
    console.log('Body Checkbox change:', { id, checked, currentCheckedItems: checkedItems })
    
    const newCheckedItems = { ...checkedItems, [id]: checked }
    setCheckedItems(newCheckedItems)
    
    // Converter para array de strings
    const selectedItems = Object.keys(newCheckedItems).filter(key => newCheckedItems[key])
    console.log('Body Selected items:', selectedItems)
    
    onChange(selectedItems)
  }

  const leftItems = bodyComplaints.filter(item => item.side === 'left')
  const rightItems = bodyComplaints.filter(item => item.side === 'right')

  return (
    <>
      <Script
        src="/scripts/leader-line.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Body: Script LeaderLine carregado via onLoad')
          setScriptLoaded(true)
        }}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{question.question_text}</Label>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2 sm:gap-x-4 lg:gap-x-8 min-w-[600px] max-w-4xl mx-auto">
            {/* Left Column */}
            <div className="flex flex-col gap-y-3 sm:gap-y-4 lg:gap-y-5 justify-center">
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
                      className="text-xs sm:text-sm mr-2 sm:mr-4 font-medium text-gray-700 text-right cursor-pointer leading-tight"
                    >
                      {item.text}
                    </label>
                    <Checkbox
                      id={item.id}
                      checked={!!checkedItems[item.id]}
                      onCheckedChange={checked =>
                        handleCheckboxChange(item.id, !!checked)
                      }
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm focus:ring-offset-0 focus:ring-2 focus:ring-offset-white"
                    />
                  </div>
                )
              })}
            </div>

            {/* Center Column - SVG */}
            <div ref={svgContainerRef} className="w-[280px] sm:w-[350px] lg:w-[450px] mx-auto flex-shrink-0">
              <BodySVG />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-y-3 sm:gap-y-4 lg:gap-y-5 justify-center">
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
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm focus:ring-offset-0 focus:ring-2 focus:ring-offset-white"
                    />
                    <label
                      htmlFor={item.id}
                      className="text-xs sm:text-sm ml-2 sm:ml-4 font-medium text-gray-700 cursor-pointer leading-tight"
                    >
                      {item.text}
                    </label>
                  </div>
                )
              })}
            </div>
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