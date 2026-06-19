import {BrowserRouter, Routes, Route} from "react-router-dom";
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Settings from "./pages/Settings";
import Logs from "./pages/Logs";
import Download from "./pages/Download";
function App(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={
                <PublicRoute>
                <Login />
                </PublicRoute>
                } />
            <Route path="/register" element={
                <PublicRoute>
                <Register />
                </PublicRoute>
                } />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
                } />
            <Route path="/settings" element={
                <ProtectedRoute>
                    <Settings/>
                </ProtectedRoute>
            }></Route>
            <Route path="/logs" element={
                <ProtectedRoute>
                    <Logs/>
                </ProtectedRoute>
            }>
            </Route>
            <Route path="/descargar" element={
                <ProtectedRoute>
                    <Download/>
                </ProtectedRoute>
            }>
            </Route>
        </Routes>
        </BrowserRouter>
    )
}
export default App;