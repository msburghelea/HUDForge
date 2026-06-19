import { useNavigate } from 'react-router-dom'

function Download() {
    const navigate = useNavigate()
    const agentToken = localStorage.getItem('agent_token') || 'Inicia sesión para ver tu token'

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="text-lg font-semibold">HUDForge</span>
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-gray-900">Volver al panel</button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-xl font-semibold mb-1">Descarga el agente</h1>
                <p className="text-sm text-gray-500 mb-8">El agente es un programa que se ejecuta en tu PC y envía métricas en tiempo real a HUDForge.</p>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                    <h2 className="text-sm font-medium text-gray-700 mb-3">1. Descarga el agente</h2>
                    <a href="https://github.com/msburghelea/HUDForge/releases/tag/v1.0.0" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white rounded px-4 py-2 text-sm hover:bg-green-700">Descargar HUDForge Agent (.exe)</a>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                    <h2 className="text-sm font-medium text-gray-700 mb-3">2. Ejecuta el agente y pega tu token</h2>
                    <p className="text-sm text-gray-600 mb-4">Haz doble click en <code className="bg-gray-100 text-gray-700 rounded px-1.5 py-0.5 text-xs">HUDForge.exe</code>. La primera vez te pedirá tu Agent Token: pégalo y pulsa Enter. El agente lo guardará y empezará a enviar métricas automáticamente cada 5 segundos.</p>
                    <p className="text-sm text-gray-600 mb-2">Este es tu token único, no lo compartas con nadie:</p>
                    <pre className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded p-4 overflow-x-auto">{agentToken}</pre>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="text-sm font-medium text-gray-700 mb-3">3. Configura tus alertas</h2>
                    <p className="text-sm text-gray-600">Ve a <strong className="font-medium text-gray-900">Ajustes</strong> para configurar los umbrales de CPU, memoria y disco, y conecta tu bot de Telegram para recibir notificaciones.</p>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => navigate('/settings')} className="bg-green-600 text-white rounded px-4 py-2.5 text-sm hover:bg-green-700">Ir a Ajustes</button>
                    <button onClick={() => navigate('/dashboard')} className="border border-gray-300 text-gray-700 rounded px-4 py-2.5 text-sm hover:bg-gray-100">Volver al panel</button>
                </div>
            </main>
        </div>
    )
}
export default Download