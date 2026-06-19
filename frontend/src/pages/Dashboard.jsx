import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard() {
    const user_id = localStorage.getItem('user_id')
    const cacheKey = `metrics_${user_id}`

    const [metrics, setMetrics] = useState(() => {
        const cached = localStorage.getItem(`metrics_${localStorage.getItem('user_id')}`)
        return cached ? JSON.parse(cached) : null
    })
    const [history, setHistory] = useState([])
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('connecting')
    const [slow, setSlow] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        let active = true
        let ws
        let slowTimer
        let reconnectTimer

        function connect() {
            if (!active) return
            setStatus('connecting')
            slowTimer = setTimeout(() => { if (active) setSlow(true) }, 6000)
            ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/metrics/ws/${user_id}`)

            ws.onmessage = (event) => {
                if (!active) return
                const data = JSON.parse(event.data)
                clearTimeout(slowTimer)
                setSlow(false)
                setStatus('online')
                setMetrics(data)
                localStorage.setItem(cacheKey, JSON.stringify(data))
                setHistory(prev => {
                    const point = {
                        time: new Date().toLocaleTimeString(),
                        cpu: data.cpu,
                        ram: data.ram
                    }
                    return [...prev, point].slice(-30)
                })
            }

            ws.onerror = () => { if (active) setStatus('error') }

            ws.onclose = () => {
                if (!active) return
                setStatus('error')
                clearTimeout(slowTimer)
                reconnectTimer = setTimeout(connect, 3000)
            }
        }

        connect()

        return () => {
            active = false
            clearTimeout(slowTimer)
            clearTimeout(reconnectTimer)
            if (ws) ws.close()
        }
    }, [])

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        navigate('/login')
    }

    function barColor(value) {
        if (value >= 85) return 'bg-red-500'
        if (value >= 60) return 'bg-amber-500'
        return 'bg-green-600'
    }

    function textColor(value) {
        if (value >= 85) return 'text-red-600'
        if (value >= 60) return 'text-amber-600'
        return 'text-green-600'
    }

    const hasData = metrics !== null
    const processCounts = (metrics?.processes || []).reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1
        return acc
    }, {})
    const processes = Object.entries(processCounts)
        .map(([name, count]) => ({ name, count }))
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.count - a.count)

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">HUDForge</span>
                        {status === 'online' && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                En línea
                            </span>
                        )}
                        {status === 'connecting' && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                                Conectando...
                            </span>
                        )}
                        {status === 'error' && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Sin conexión
                            </span>
                        )}
                    </div>
                    <nav className="flex items-center gap-1 text-sm">
                        <button onClick={() => navigate('/settings')} className="px-3 py-1.5 text-gray-600 rounded hover:bg-gray-100 hover:text-gray-900">Ajustes</button>
                        <button onClick={() => navigate('/logs')} className="px-3 py-1.5 text-gray-600 rounded hover:bg-gray-100 hover:text-gray-900">Logs</button>
                        <button onClick={() => navigate('/descargar')} className="px-3 py-1.5 text-gray-600 rounded hover:bg-gray-100 hover:text-gray-900">Agente</button>
                        <button onClick={handleLogout} className="px-3 py-1.5 ml-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-100 hover:text-gray-900">Salir</button>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

                {status !== 'online' && (
                    <div className="mb-6 px-4 py-3 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
                        {hasData ? (
                            status === 'error'
                                ? 'Sin conexión con el servidor. Mostrando los últimos datos disponibles e intentando reconectar...'
                                : 'Reconectando... Mostrando los últimos datos disponibles.'
                        ) : status === 'error' ? (
                            'No se pudo conectar con el agente. Comprueba que esté en ejecución. Reintentando automáticamente...'
                        ) : (
                            <>
                                Esperando datos del agente...
                                {slow && ' Está tardando más de lo normal, comprueba que el agente esté en ejecución.'}
                            </>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-baseline justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">CPU</span>
                            <span className={`font-semibold ${hasData ? `text-3xl ${textColor(metrics.cpu)}` : 'text-base text-gray-400'}`}>{hasData ? `${metrics.cpu}%` : 'Sin datos'}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded">
                            <div className={`h-2 rounded ${hasData ? barColor(metrics.cpu) : ''}`} style={{ width: hasData ? `${metrics.cpu}%` : '0%' }}></div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-baseline justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Memoria</span>
                            <span className={`font-semibold ${hasData ? `text-3xl ${textColor(metrics.ram)}` : 'text-base text-gray-400'}`}>{hasData ? `${metrics.ram}%` : 'Sin datos'}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded">
                            <div className={`h-2 rounded ${hasData ? barColor(metrics.ram) : ''}`} style={{ width: hasData ? `${metrics.ram}%` : '0%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-medium text-gray-500">Uso en el tiempo</h2>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-green-600"></span>
                                CPU
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                Memoria
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#e5e7eb" minTickGap={40} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#e5e7eb" />
                                <Tooltip
                                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                                    formatter={(value, name) => [`${value}%`, name === 'cpu' ? 'CPU' : 'Memoria']}
                                />
                                <Line type="monotone" dataKey="cpu" stroke="#16a34a" strokeWidth={2} dot={false} isAnimationActive={false} />
                                <Line type="monotone" dataKey="ram" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-sm font-medium text-gray-500 mb-5">Disco</h2>
                    {hasData ? (
                        <div className="space-y-5">
                            {Object.entries(metrics.disk).map(([mountpoint, usage]) => (
                                <div key={mountpoint}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-gray-700">{mountpoint}</span>
                                        <span className={textColor(usage)}>{usage}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded">
                                        <div className={`h-2 rounded ${barColor(usage)}`} style={{ width: `${usage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Sin datos todavía</p>
                    )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-sm font-medium text-gray-500">Procesos</h2>
                            <span className="text-xs text-gray-400">
                                {processes.length} únicos · {metrics?.processes.length || 0} en total
                            </span>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filtrar procesos"
                            className="text-sm border border-gray-200 rounded px-3 py-1.5 w-56 focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-x-2 px-3 pb-2 text-xs font-medium text-gray-400 border-b border-gray-100">
                        <span className="col-span-2">Nombre</span>
                        <span className="text-right">Instancias</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {processes.length === 0 ? (
                            <p className="text-sm text-gray-400 py-4 px-3">Sin resultados</p>
                        ) : (
                            processes.map((process) => (
                                <div key={process.name} className="grid grid-cols-3 gap-x-2 items-center px-3 py-2.5 text-sm hover:bg-gray-50">
                                    <span className="col-span-2 text-gray-700 truncate">{process.name}</span>
                                    <span className="text-right">
                                        <span className="inline-block min-w-8 text-xs text-gray-600 bg-gray-100 rounded px-2 py-0.5">{process.count}</span>
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Dashboard
