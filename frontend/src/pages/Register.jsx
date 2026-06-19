import {use, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate()
    
    function handleSubmit(e){
        e.preventDefault()
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
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                        </label>
                        <label className="block">
                            <span className="block text-sm text-gray-600 mb-1.5">Confirmar contraseña</span>
                            <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                        </label>
                        <button className="w-full bg-green-600 text-white rounded px-4 py-2.5 text-sm hover:bg-green-700">Crear cuenta</button>
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