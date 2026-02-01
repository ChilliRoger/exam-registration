import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

function App() {
    const [user, setUser] = useState(null)

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const handleLogin = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const Layout = ({ children }) => (
        <div className="app-container">
            <Sidebar role={user?.role} />
            <div className="main-content">
                <Navbar user={user} onLogout={handleLogout} />
                <div style={{ marginTop: '1rem' }}>
                    {children}
                </div>
            </div>
        </div>
    )

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login onLogin={handleLogin} />
                } />
                <Route path="/signup" element={
                    user ? <Navigate to={`/${user.role}/dashboard`} /> : <Signup />
                } />

                <Route path="/student/*" element={
                    user?.role === 'student' ? <Layout><StudentDashboard /></Layout> : <Navigate to="/login" />
                } />

                <Route path="/faculty/*" element={
                    user?.role === 'faculty' ? <Layout><FacultyDashboard /></Layout> : <Navigate to="/login" />
                } />

                <Route path="/admin/*" element={
                    user?.role === 'admin' ? <Layout><AdminDashboard /></Layout> : <Navigate to="/login" />
                } />

                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

export default App
