"use client"

import React, { useState, useEffect, useRef, createRef } from 'react'
import Script from 'next/script'
import { FacialSVG } from '@/components/facial/FacialSVG'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type LeaderLine from 'leader-line'
import type { Question } from '@/types/questionnaire'

interface FacialComplaintsQuestionProps {
  question: Question
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

const facialComplaints = [
  // Coluna Esquerda (ordenada de cima para baixo visualmente)
  {
    id: 'braveza',
    region: 'sobrancelha-esquerda',
    text: 'Braveza',
    side: 'left',
  },
  {
    id: 'linhas-periorbitais',
    region: 'olho-esquerdo',
    text: 'Linhas periorbitais',
    side: 'left',
  },
  {
    id: 'rugas-palpebra-inferior',
    region: 'olho-esquerdo',
    text: 'Rugas pálpebra inferior',
    side: 'left',
  },
  {
    id: 'lobulo-orelha',
    region: 'mandíbula-esquerda',
    text: 'Lóbulo orelha',
    side: 'left',
  },
  {
    id: 'bigode-chines',
    region: 'bochecha-esquerda',
    text: 'Bigode chinês',
    side: 'left',
  },
  {
    id: 'rugas-marionete',
    region: 'mandíbula-esquerda',
    text: 'Rugas marionete',
    side: 'left',
  },
  {
    id: 'sulco-mentolabial',
    region: 'queixo',
    text: 'Sulco mentolabial',
    side: 'left',
  },
  {
    id: 'celulite-queixo',
    region: 'queixo',
    text: 'Celulite de queixo',
    side: 'left',
  },
  // Coluna Direita (ordenada de cima para baixo visualmente)
  {
    id: 'rugas-testa',
    region: 'testa',
    text: 'Rugas na testa',
    side: 'right',
  },
  {
    id: 'pes-de-galinha',
    region: 'olho-direito',
    text: 'Pés de galinha',
    side: 'right',
  },
  {
    id: 'linha-nasal',
    region: 'nariz',
    text: 'Linha nasal',
    side: 'right',
  },
  {
    id: 'cicatriz-acne',
    region: 'bochecha-direita',
    text: 'Cicatriz de acne',
    side: 'right',
  },
  {
    id: 'regiao-perioral',
    region: 'lábio-superior',
    text: 'Região perioral',
    side: 'right',
  },
  {
    id: 'labios-superior',
    region: 'lábio-superior',
    text: 'Lábio superior',
    side: 'right',
  },
  {
    id: 'labios-inferior',
    region: 'lábio-inferior',
    text: 'Lábio inferior',
    side: 'right',
  },
  {
    id: 'mento',
    region: 'queixo',
    text: 'Mento',
    side: 'right',
  },
]

export function FacialComplaintsQuestion({
  question,
  value = [],
  onChange,
  error,
}: FacialComplaintsQuestionProps) {
  console.log('Facial: Componente montado/remontado')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const linesRef = useRef<LeaderLine[]>([])
  const itemRefs = useRef(
    facialComplaints.map(() => createRef<HTMLDivElement>()),
  )
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      console.log('Facial: Componente desmontado, limpando linhas')
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
        console.log('Facial: LeaderLine detectado, marcando como carregado')
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
      console.log('Facial: Script não carregado ainda, aguardando...')
      return
    }

    const LeaderLineCtor = (window as any).LeaderLine
    if (!LeaderLineCtor) {
      console.error('Facial: LeaderLine constructor not found on window object.')
      return
    }

    console.log('Facial: Iniciando desenho das linhas...')

    linesRef.current.forEach(line => line.remove())
    linesRef.current = []

    const drawLines = () => {
      console.log('Facial: Função drawLines executando...')
      const newLines: LeaderLine[] = []
      facialComplaints.forEach((complaint, index) => {
        // Tratamento especial para linha nasal - criar duas linhas conectadas
        if (complaint.id === 'linha-nasal') {
          const startEl = document.getElementById('marker-linha-nasal')
          const intermediateEl = document.getElementById('marker-linha-nasal-intermediate')
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
      console.log(`Facial: ${newLines.length} linhas criadas`)
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
    console.log('Checkbox change:', { id, checked, currentCheckedItems: checkedItems })
    
    const newCheckedItems = { ...checkedItems, [id]: checked }
    setCheckedItems(newCheckedItems)
    
    // Converter para array de strings
    const selectedItems = Object.keys(newCheckedItems).filter(key => newCheckedItems[key])
    console.log('Selected items:', selectedItems)
    
    onChange(selectedItems)
  }

  const leftItems = facialComplaints.filter(item => item.side === 'left')
  const rightItems = facialComplaints.filter(item => item.side === 'right')

  return (
    <>
      <Script
        src="/scripts/leader-line.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Facial: Script LeaderLine carregado via onLoad')
          setScriptLoaded(true)
        }}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{question.question_text}</Label>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2 sm:gap-x-4 lg:gap-x-8 min-w-[500px] max-w-3xl mx-auto">
            {/* Left Column */}
            <div className="flex flex-col gap-y-3 sm:gap-y-4 lg:gap-y-5 justify-center">
              {leftItems.map(item => {
                const complaintIndex = facialComplaints.findIndex(
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
            <div ref={svgContainerRef} className="w-[200px] sm:w-[250px] lg:w-[300px] mx-auto flex-shrink-0">
              <FacialSVG />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-y-3 sm:gap-y-4 lg:gap-y-5 justify-center">
              {rightItems.map(item => {
                const complaintIndex = facialComplaints.findIndex(
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
                const complaint = facialComplaints.find(c => c.id === id)
                return complaint?.text
              }).filter(Boolean).join(', ')}
            </p>
          </div>
        )}
      </div>
    </>
  )
} 