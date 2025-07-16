import React from 'react'

// Tipos para regiões faciais
export type FacialRegion =
  | 'testa'
  | 'sobrancelha-direita'
  | 'sobrancelha-esquerda'
  | 'olho-direito'
  | 'olho-esquerdo'
  | 'nariz'
  | 'bochecha-direita'
  | 'bochecha-esquerda'
  | 'lábio-superior'
  | 'lábio-inferior'
  | 'queixo'
  | 'mandíbula-direita'
  | 'mandíbula-esquerda'
  | 'maxilar-direito'
  | 'maxilar-esquerdo'

export interface FacialSVGProps {
  selectedRegion?: FacialRegion | null
  onSelectRegion?: (region: FacialRegion) => void
  className?: string
}

// SVG simplificado do rosto frontal com algumas regiões interativas
export const FacialSVG: React.FC<FacialSVGProps> = ({
  selectedRegion,
  onSelectRegion,
  className = '',
}) => {
  // Função para determinar cor de preenchimento
  const getFill = (region: FacialRegion) =>
    selectedRegion === region ? '#60a5fa' : '#e5e7eb'
  const regionOpacity = 0 // Alterado de 0.5 para 0 para tornar as regiões invisíveis

  return (
    <svg
      id="facial-svg" // Add an ID to the main SVG container as well
      viewBox="0 0 240 320"
      className={className}
      width="100%"
      height="auto"
      style={{ maxWidth: 320, display: 'block', margin: '0 auto' }}
    >
      {/* Imagem de fundo do rosto aumentada e centralizada */}
      <image
        href="/imagem-face.png"
        x="-30"
        y="-40"
        width="300"
        height="400"
        style={{ pointerEvents: 'none' }}
      />
      {/* Marcadores Cinza Uniformes (agora como círculos) */}
      <circle 
        id="marker-braveza" 
        cx="120" 
        cy="120" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-linhas-periorbitais" 
        cx="85" 
        cy="130" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-rugas-palpebra-inferior" 
        cx="90" 
        cy="152" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-lobulo-orelha" 
        cx="60" 
        cy="175" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-bigode-chines" 
        cx="90" 
        cy="190" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-rugas-marionete" 
        cx="98" 
        cy="208" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-sulco-mentolabial" 
        cx="120" 
        cy="215" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-celulite-queixo" 
        cx="120" 
        cy="232" 
        r="2" 
        fill="#a1a1aa" 
      />
      {/* Marcadores Direita */}
      <circle 
        id="marker-rugas-testa" 
        cx="120" 
        cy="100" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-pes-de-galinha" 
        cx="170" 
        cy="135" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-linha-nasal" 
        cx="120" 
        cy="150" 
        r="2" 
        fill="#a1a1aa" 
      />
      {/* Ponto intermediário para linha nasal (invisível) */}
      <circle 
        id="marker-linha-nasal-intermediate" 
        cx="165" 
        cy="150" 
        r="1" 
        fill="transparent" 
      />
      <circle 
        id="marker-cicatriz-acne" 
        cx="160" 
        cy="175" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-regiao-perioral" 
        cx="120" 
        cy="188" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-labios-superior" 
        cx="125" 
        cy="195" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-labios-inferior" 
        cx="125" 
        cy="205" 
        r="2" 
        fill="#a1a1aa" 
      />
      <circle 
        id="marker-mento" 
        cx="120" 
        cy="225" 
        r="2" 
        fill="#a1a1aa" 
      />
    </svg>
  )
} 