import {use, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()
        setError('')
        if (password.length < 8) {
            setError('La contraseña debe tener mínimo 8 caracteres')
            return
        }
        if (!password.match(/[A-Z]/)) {
            setError('La contraseña debe tener al menos una mayúscula')
            return
        }
        if (!password.match(/[0-9]/)) {
            setError('La contraseña debe tener al menos un número')
            return
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return  
        }

        setLoading(true)
        const requestOptions={
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password})
        }
        fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, requestOptions)
       .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.detail)
                })
            }
            return response.json()
        })
        .then(data => {
            localStorage.setItem('agent_token', data.agent_token)
            navigate('/login')
        })
        .catch(error => {
            setError(error.message)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-sm">
                <a href="/" className="block text-center text-lg font-semibold mb-6">HUDForge</a>
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <h1 className="text-xl font-semibold mb-1">Crear cuenta</h1>
                    <p className="text-sm text-gray-500 mb-6">Rellena el formulario para empezar.</p>
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
                        <label className="block">
                            <span className="block text-sm text-gray-600 mb-1.5">Confirmar contraseña</span>
                            <div className="relative">
                                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 pr-16 text-sm focus:outline-none focus:border-green-600" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700">
                                    {showConfirmPassword ? 'Ocultar' : 'Ver'}
                                </button>
                            </div>
                        </label>
                        <button disabled={loading} className="w-full bg-green-600 text-white rounded px-4 py-2.5 text-sm hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading && <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </form>
                </div>
                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿Ya tienes cuenta? <a href="/login" className="text-green-600 hover:text-green-700">Iniciar sesión</a>
                </p>
            </div>
        </div>
    )
}
export default Register;