import React from 'react'

// Tipos para regiões corporais
export type BodyRegion =
  | 'papada'
  | 'pescoco'
  | 'colo'
  | 'mama'
  | 'abdomen'
  | 'umbigo'
  | 'intimo'
  | 'maos'
  | 'coxa'
  | 'joelho'
  | 'braco'
  | 'costas'
  | 'flancos'
  | 'culote'
  | 'celulite'
  | 'gluteos'
  | 'bananinha'
  | 'regiao-interna-coxas'

export interface BodySVGProps {
  selectedRegion?: BodyRegion | null
  onSelectRegion?: (region: BodyRegion) => void
  className?: string
}

// SVG do corpo com regiões interativas
export const BodySVG: React.FC<BodySVGProps> = ({
  selectedRegion,
  onSelectRegion,
  className = '',
}) => {
  // Função para determinar cor de preenchimento
  const getFill = (region: BodyRegion) =>
    selectedRegion === region ? '#60a5fa' : '#e5e7eb'
  const regionOpacity = 0 // Regiões invisíveis, apenas marcadores visíveis

  return (
    <svg
      id="body-svg"
      viewBox="0 0 500 550"
      className={className}
      width="100%"
      height="auto"
      style={{ maxWidth: 550, display: 'block', margin: '0 auto' }}
    >
      {/* Imagem de fundo do corpo */}
      <image
        href="/imagem-corpo.png"
        x="0"
        y="0"
        width="500"
        height="550"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Marcadores Corporais (círculos cinza uniformes) */}
      {/* Lado Esquerdo - Vista Frontal */}
      <circle id="marker-papada" cx="150" cy="70" r="2" fill="#a1a1aa" />
      <circle id="marker-pescoco" cx="140" cy="80" r="2" fill="#a1a1aa" />
      <circle id="marker-colo" cx="160" cy="110" r="2" fill="#a1a1aa" />
      <circle id="marker-mama" cx="140" cy="125" r="2" fill="#a1a1aa" />
      <circle id="marker-abdomen" cx="150" cy="170" r="2" fill="#a1a1aa" />
      <circle id="marker-umbigo" cx="165" cy="185" r="2" fill="#a1a1aa" />
      <circle id="marker-intimo" cx="160" cy="235" r="2" fill="#a1a1aa" />
      <circle id="marker-intimo-intermediate" cx="120" cy="235" r="1" fill="transparent" />
      <circle id="marker-maos" cx="110" cy="260" r="2" fill="#a1a1aa" />
      <circle id="marker-coxa" cx="125" cy="285" r="2" fill="#a1a1aa" />
      <circle id="marker-joelho" cx="120" cy="330" r="2" fill="#a1a1aa" />
      
      {/* Lado Direito - Vista Traseira */}
      <circle id="marker-braco" cx="405" cy="135" r="2" fill="#a1a1aa" />
      <circle id="marker-costas" cx="355" cy="150" r="2" fill="#a1a1aa" />
      <circle id="marker-flancos" cx="380" cy="185" r="2" fill="#a1a1aa" />
      <circle id="marker-culote" cx="385" cy="205" r="2" fill="#a1a1aa" />
      <circle id="marker-celulite" cx="320" cy="220" r="2" fill="#a1a1aa" />
      <circle id="marker-celulite-intermediate" cx="370" cy="220" r="1" fill="transparent" />
      <circle id="marker-gluteos" cx="375" cy="235" r="2" fill="#a1a1aa" />
      <circle id="marker-bananinha" cx="380" cy="245" r="2" fill="#a1a1aa" />
      <circle id="marker-regiao-interna-coxas" cx="365" cy="280" r="2" fill="#a1a1aa" />
    </svg>
  )
} 