import React from 'react'
import { Home, BookOpen, Calendar, Users, LogOut, CheckSquare, Bell } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Sidebar({ role }) {
    const location = useLocation()

    const menuItems = {
        student: [
            { name: 'Dashboard', icon: Home, path: '/student/dashboard' },
            { name: 'Subject Selection', icon: BookOpen, path: '/student/subjects' },
            { name: 'Schedules', icon: Calendar, path: '/student/schedule' },
        ],
        faculty: [
            { name: 'Overview', icon: Home, path: '/faculty/dashboard' },
            { name: 'Verifications', icon: CheckSquare, path: '/faculty/verify' },
            { name: 'Reports', icon: Bell, path: '/faculty/reports' },
        ],
        admin: [
            { name: 'Admin Hub', icon: Home, path: '/admin/dashboard' },
            { name: 'Manage Exams', icon: Calendar, path: '/admin/exams' },
            { name: 'User Accounts', icon: Users, path: '/admin/users' },
        ]
    }

    const items = menuItems[role] || []

    return (
        <div className="sidebar">
            <div style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>ERS Portal</div>
            <nav>
                {items.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <item.icon size={18} />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export function Navbar({ user, onLogout }) {
    return (
        <div className="card flex justify-between items-center" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)' }}>
            <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Role: </span>
                <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
            <div className="flex items-center gap-4">
                <span style={{ fontSize: '0.875rem' }}>{user?.name}</span>
                <button className="btn-outline flex items-center gap-2" onClick={onLogout} style={{ padding: '0.4rem 0.75rem' }}>
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    )
}
