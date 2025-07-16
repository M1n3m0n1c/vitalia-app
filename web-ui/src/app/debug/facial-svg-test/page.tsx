"use client"

import React, { useState, useEffect, useRef, createRef } from 'react'
import Script from 'next/script'
import { FacialSVG } from '@/components/facial/FacialSVG'
import { Checkbox } from '@/components/ui/checkbox'
import type LeaderLine from 'leader-line'

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

export default function FacialSVGTestPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const linesRef = useRef<LeaderLine[]>([])
  const itemRefs = useRef(
    facialComplaints.map(() => createRef<HTMLDivElement>()),
  )
  const svgContainerRef = useRef<HTMLDivElement>(null)

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
    setCheckedItems(prev => ({ ...prev, [id]: checked }))
  }

  const leftItems = facialComplaints.filter(item => item.side === 'left')
  const rightItems = facialComplaints.filter(item => item.side === 'right')
  const selectedComplaints = facialComplaints
    .filter(item => checkedItems[item.id])
    .map(item => item.text)

  return (
    <>
      <Script
        src="/scripts/leader-line.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Queixas Estéticas Faciais
        </h1>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 md:gap-x-8 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-y-5 justify-center">
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
                    className="text-md mr-4 font-medium text-gray-700 text-right cursor-pointer"
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
          <div ref={svgContainerRef} className="w-[300px] md:w-[320px] mx-auto">
            <FacialSVG />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-y-5 justify-center">
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
                    className="w-5 h-5 rounded-sm focus:ring-offset-0 focus:ring-2 focus:ring-offset-white"
                  />
                  <label
                    htmlFor={item.id}
                    className="text-md ml-4 font-medium text-gray-700 cursor-pointer"
                  >
                    {item.text}
                  </label>
                </div>
              )
            })}
          </div>
      </div>

        {selectedComplaints.length > 0 && (
          <div className="mt-12 max-w-3xl mx-auto text-center p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Você selecionou:</h2>
            <p className="text-gray-600 mt-2">
              {selectedComplaints.join(', ')}
      </p>
    </div>
        )}
      </div>
    </>
  )
} 