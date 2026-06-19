import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState('');
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()
        setError('')
        setLoading(true)
        const requestOptions ={
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password})
        }
        fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, requestOptions)
        .then(response=> {
            if (!response.ok){
                throw new Error('Credenciales incorrectas')
            }
            return response.json()
        })
        .then(data => {
                localStorage.setItem('agent_token', data.agent_token)
                localStorage.setItem('token', data.access_token)
                localStorage.setItem('user_id', data.user_id)
                const onboardedKey = `onboarded_${data.user_id}`
                if (!localStorage.getItem(onboardedKey)) {
                    localStorage.setItem(onboardedKey, 'true')
                    navigate('/descargar')
                } else {
                    navigate('/dashboard')
                }
            })
        .catch(error => {
            setError(error.message)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <a href="/" className="block text-center text-lg font-semibold mb-6">HUDForge</a>
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <h1 className="text-xl font-semibold mb-1">Iniciar sesión</h1>
                    <p className="text-sm text-gray-500 mb-6">Introduce tus credenciales para entrar.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="block text-sm text-gray-600 mb-1.5">Usuario</span>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                        </label>
                        <label className="block">
                            <span className="block text-sm text-gray-600 mb-1.5">Contraseña</span>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 pr-16 text-sm focus:outline-none focus:border-green-600" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700">
                                    {showPassword ? 'Ocultar' : 'Ver'}
                                </button>
                            </div>
                        </label>
                        <button disabled={loading} className="w-full bg-green-600 text-white rounded px-4 py-2.5 text-sm hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading && <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </form>
                </div>
                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿No tienes cuenta? <a href="/register" className="text-green-600 hover:text-green-700">Crear cuenta</a>
                </p>
            </div>
        </div>

    )
   
}
export default Login;