import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()
        const requestOptions ={
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password})
        }
        fetch("http://localhost:8000/auth/login", requestOptions)
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
                navigate('/dashboard')
            })
        .catch(error => {
            setError(error.message)
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
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                        </label>
                        <button className="w-full bg-green-600 text-white rounded px-4 py-2.5 text-sm hover:bg-green-700">Entrar</button>
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