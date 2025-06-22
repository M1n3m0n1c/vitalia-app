export default function Home() {
  return (
    <main className='from-medical-50 min-h-screen bg-gradient-to-br to-blue-50'>
      {/* Header */}
      <div className='container mx-auto px-4 py-16'>
        <div className='mb-16 text-center'>
          <h1 className='animate-fade-in mb-4 text-5xl font-bold text-gray-900'>
            MedCare
          </h1>
          <p className='text-medical-600 mb-2 text-xl font-medium'>
            Sistema Digital de Anamnese
          </p>
          <p className='mx-auto max-w-2xl text-gray-600'>
            Plataforma completa para gestão de anamnese digital, questionários
            médicos e CRM de pacientes
          </p>
        </div>

        {/* Status Badge */}
        <div className='mb-16 flex justify-center'>
          <div className='bg-warning-100 text-warning-800 rounded-full px-4 py-2 text-sm font-medium'>
            🚧 Sistema em desenvolvimento
          </div>
        </div>

        {/* Feature Cards */}
        <div className='mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div className='medical-card group p-6 transition-transform duration-200 hover:scale-105'>
            <div className='bg-medical-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
              <span className='text-2xl'>📋</span>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Questionários
            </h3>
            <p className='text-sm text-gray-600'>
              Sistema avançado de criação e gestão de questionários médicos com
              builder drag-and-drop
            </p>
          </div>

          <div className='medical-card group p-6 transition-transform duration-200 hover:scale-105'>
            <div className='bg-success-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
              <span className='text-2xl'>👥</span>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              CRM Pacientes
            </h3>
            <p className='text-sm text-gray-600'>
              Gestão completa de pacientes com histórico médico e documentos
              organizados
            </p>
          </div>

          <div className='medical-card group p-6 transition-transform duration-200 hover:scale-105'>
            <div className='bg-warning-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
              <span className='text-2xl'>📅</span>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>Agenda</h3>
            <p className='text-sm text-gray-600'>
              Sistema de agendamento inteligente com notificações e gestão de
              horários
            </p>
          </div>

          <div className='medical-card group p-6 transition-transform duration-200 hover:scale-105'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100'>
              <span className='text-2xl'>📊</span>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Análises
            </h3>
            <p className='text-sm text-gray-600'>
              Comparação temporal e análise detalhada de resultados com
              visualizações
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className='text-center'>
          <div className='medical-card mx-auto max-w-2xl p-8'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              Funcionalidades Especiais
            </h2>
            <div className='grid gap-4 text-left md:grid-cols-2'>
              <div className='flex items-start space-x-3'>
                <span className='text-medical-500 mt-1'>✓</span>
                <span className='text-sm text-gray-600'>
                  Formulário de queixas estéticas com SVG interativo
                </span>
              </div>
              <div className='flex items-start space-x-3'>
                <span className='text-medical-500 mt-1'>✓</span>
                <span className='text-sm text-gray-600'>
                  Banco de imagens médicas categorizadas
                </span>
              </div>
              <div className='flex items-start space-x-3'>
                <span className='text-medical-500 mt-1'>✓</span>
                <span className='text-sm text-gray-600'>
                  Comparação temporal de questionários
                </span>
              </div>
              <div className='flex items-start space-x-3'>
                <span className='text-medical-500 mt-1'>✓</span>
                <span className='text-sm text-gray-600'>
                  Anotações médicas com versionamento
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
