import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Settings() {
    const [cpuMin, setCpuMin] = useState('')
    const [cpuMax, setCpuMax] = useState('')
    const [ramMin, setRamMin] = useState('')
    const [ramMax, setRamMax] = useState('')
    const [diskMin, setDiskMin] = useState('')
    const [diskMax, setDiskMax] = useState('')
    const [telegramChatId, setTelegramChatId] = useState('')
    const [telegramToken, setTelegramToken] = useState('')
    const [agentTimeout, setAgentTimeout] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/settings/settings`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                setCpuMin(data.cpu_threshold_min ?? '')
                setCpuMax(data.cpu_threshold_max ?? '')
                setRamMin(data.ram_threshold_min ?? '')
                setRamMax(data.ram_threshold_max ?? '')
                setDiskMin(data.disk_threshold_min ?? '')
                setDiskMax(data.disk_threshold_max ?? '')
                setTelegramChatId(data.telegram_chat_id ?? '')
                setTelegramToken(data.telegram_token_id ?? '')
                setAgentTimeout(data.agent_timeout ?? '')
            }
        })
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        if (!cpuMin || !cpuMax || !ramMin || !ramMax || !diskMin || !diskMax || !agentTimeout) {
            setError('Por favor rellena todos los campos obligatorios (*)')
            return
        }
        const token = localStorage.getItem('token')
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                cpu_threshold_min: parseFloat(cpuMin),
                cpu_threshold_max: parseFloat(cpuMax),
                ram_threshold_min: parseFloat(ramMin),
                ram_threshold_max: parseFloat(ramMax),
                disk_threshold_min: parseFloat(diskMin),
                disk_threshold_max: parseFloat(diskMax),
                telegram_chat_id: telegramChatId || null,
                telegram_token_id: telegramToken || null,
                agent_timeout: parseFloat(agentTimeout)
            })
        }
        fetch(`${import.meta.env.VITE_BACKEND_URL}/settings/settings`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al guardar la configuración')
                }
                return response.json()
            })
            .then(() => {
                setSuccess('Configuración guardada correctamente')
                setError('')
            })
            .catch(error => {
                setError(error.message)
                setSuccess('')
            })
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="text-lg font-semibold">HUDForge</span>
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-gray-900">Volver al panel</button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-xl font-semibold mb-1">Ajustes</h1>
                <p className="text-sm text-gray-500 mb-6">Los campos marcados con * son obligatorios.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-4">CPU *</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Mínimo</span>
                                <input type="number" value={cpuMin} onChange={(e) => setCpuMin(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Máximo</span>
                                <input type="number" value={cpuMax} onChange={(e) => setCpuMax(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-4">Memoria *</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Mínimo</span>
                                <input type="number" value={ramMin} onChange={(e) => setRamMin(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Máximo</span>
                                <input type="number" value={ramMax} onChange={(e) => setRamMax(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-4">Disco *</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Mínimo</span>
                                <input type="number" value={diskMin} onChange={(e) => setDiskMin(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Máximo</span>
                                <input type="number" value={diskMax} onChange={(e) => setDiskMax(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-4">Telegram <span className="text-gray-400 font-normal">(opcional)</span></h2>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Chat ID</span>
                                <input type="text" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                            <label className="block">
                                <span className="block text-sm text-gray-600 mb-1.5">Bot Token</span>
                                <input type="text" value={telegramToken} onChange={(e) => setTelegramToken(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-4">Agente *</h2>
                        <label className="block">
                            <span className="block text-sm text-gray-600 mb-1.5">Timeout (segundos)</span>
                            <input type="number" value={agentTimeout} onChange={(e) => setAgentTimeout(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                        </label>
                    </div>

                    <div className="flex items-center gap-4">
                        <button type="submit" className="bg-green-600 text-white rounded px-6 py-2.5 text-sm hover:bg-green-700">Guardar</button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {success && <p className="text-sm text-green-600">{success}</p>}
                    </div>
                </form>
            </main>
        </div>
    )
}
export default Settings