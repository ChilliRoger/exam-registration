import React from 'react'
import { Home, BookOpen, Calendar, Users, LogOut, CheckSquare, Bell } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ role }) => {
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

export default Sidebar
