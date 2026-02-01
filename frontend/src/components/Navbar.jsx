import React from 'react'
import { LogOut } from 'lucide-react'

const Navbar = ({ user, onLogout }) => {
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

export default Navbar
