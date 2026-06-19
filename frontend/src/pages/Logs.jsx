import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logs() {
    const [logs, setLogs] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filter, setFilter] = useState('')
    const navigate = useNavigate()

    function fetchLogs(currentPage, currentFilter) {
        const token = localStorage.getItem('token')
        let url = `${import.meta.env.VITE_BACKEND_URL}/logs/logs?page=${currentPage}`
        if (currentFilter) url += `&type=${currentFilter}`

        fetch(url, {
            headers: { 'authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            setLogs(data.logs)
            setTotalPages(data.pages)
        })
    }

    useEffect(() => {
        fetchLogs(page, filter)
    }, [page, filter])

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="text-lg font-semibold">HUDForge</span>
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-gray-900">Volver al panel</button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-xl font-semibold mb-6">Registro de eventos</h1>

                <div className="flex gap-2 mb-6">
                    <button onClick={() => setFilter('')} className={`px-3 py-1.5 text-sm rounded ${filter === '' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Todos</button>
                    <button onClick={() => setFilter('INFO')} className={`px-3 py-1.5 text-sm rounded ${filter === 'INFO' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Info</button>
                    <button onClick={() => setFilter('ALERT')} className={`px-3 py-1.5 text-sm rounded ${filter === 'ALERT' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Alertas</button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                                <th className="px-4 py-3 font-medium">Fecha</th>
                                <th className="px-4 py-3 font-medium">Tipo</th>
                                <th className="px-4 py-3 font-medium">Mensaje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-gray-400">No hay eventos</td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block text-xs rounded px-2 py-0.5 ${log.type === 'ALERT' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{log.type}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{log.message}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center gap-4 mt-6 text-sm">
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent">Anterior</button>
                    <span className="text-gray-500">Página {page} de {totalPages}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent">Siguiente</button>
                </div>
            </main>
        </div>
    )
}
export default Logs