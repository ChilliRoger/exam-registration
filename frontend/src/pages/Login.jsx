import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, HelpCircle, X, BookOpen, GraduationCap, UserCheck, Shield } from 'lucide-react'

const API_URL = 'http://localhost:5000'

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showHelp, setShowHelp] = useState(false)
    const [showGuide, setShowGuide] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            localStorage.setItem('token', data.token)
            onLogin(data.user)
            navigate(`/${data.user.role}/dashboard`)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const testAccounts = [
        {
            role: 'Student',
            email: 'student@university.edu',
            password: 'student123',
            features: ['Register for exams', 'View exam schedule', 'Track registration status']
        },
        {
            role: 'Faculty',
            email: 'faculty@university.edu',
            password: 'faculty123',
            features: ['Verify student registrations', 'Approve/Reject requests', 'Generate reports']
        },
        {
            role: 'Admin',
            email: 'admin@university.edu',
            password: 'admin123',
            features: ['Create exam schedules', 'Manage subjects', 'System configuration'],
            note: 'Note: Admin account must be created manually in database first'
        }
    ]

    const fillTestAccount = (account) => {
        setEmail(account.email)
        setPassword(account.password)
        setShowHelp(false)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg)', position: 'relative' }}>

            {/* Guide Modal */}
            {showGuide && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#e0e7ff',
                                    color: 'var(--accent)'
                                }}>
                                    <BookOpen size={24} />
                                </div>
                                <h3 style={{ margin: 0 }}>System Guide</h3>
                            </div>
                            <button
                                onClick={() => setShowGuide(false)}
                                className="btn-outline"
                                style={{ padding: '0.5rem', border: 'none' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Welcome to the <strong>Exam Registration System</strong>. This platform streamlines the entire examination process,
                                from scheduling to student registration and faculty verification.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Student Section */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1.25rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{
                                    minWidth: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#dbeafe',
                                    color: '#2563eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Student Features</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        <li><strong>Browse Subjects:</strong> View available courses and credit details.</li>
                                        <li><strong>Exam Registration:</strong> Apply for upcoming exams with a single click.</li>
                                        <li><strong>Track Status:</strong> Monitor application status (Pending, Approved, Rejected).</li>
                                        <li><strong>View Schedule:</strong> Access approved exam dates, halls, and time slots.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Faculty Section */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1.25rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{
                                    minWidth: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#d1fae5',
                                    color: '#059669',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <UserCheck size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Teacher / Faculty Features</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        <li><strong>Verification Console:</strong> Review pending student registrations.</li>
                                        <li><strong>Decision Making:</strong> Approve eligible students or reject invalid applications.</li>
                                        <li><strong>Reports:</strong> Generate and download attendance sheets and summary reports (CSV).</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Admin Section */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1.25rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{
                                    minWidth: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f3e8ff',
                                    color: '#7e22ce',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Administrator Features</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        <li><strong>Exam Scheduling:</strong> Create new exam schedules with dates, halls, and slots.</li>
                                        <li><strong>System Overview:</strong> Monitor total students, exams, and pending actions.</li>
                                        <li><strong>Subject Management:</strong> Manage the curriculum database (add/edit subjects).</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Modal (Test Accounts) */}
            {showHelp && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Test Login Credentials</h3>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="btn-outline"
                                style={{ padding: '0.5rem', border: 'none' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            Use these sample accounts to test different user roles. Click on any account to auto-fill the login form.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {testAccounts.map((account, idx) => (
                                <div
                                    key={idx}
                                    className="card"
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: '#f8fafc',
                                        cursor: 'pointer',
                                        border: '2px solid var(--border)',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => fillTestAccount(account)}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                {account.role} Account
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                Click to auto-fill credentials
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '80px 1fr',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem',
                                        fontSize: '0.875rem'
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                        <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{account.email}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>Password:</span>
                                        <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{account.password}</span>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                            FEATURES:
                                        </div>
                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem' }}>
                                            {account.features.map((feature, i) => (
                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{feature}</li>
                                            ))}
                                        </ul>
                                        {account.note && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                padding: '0.5rem',
                                                backgroundColor: '#fef9c3',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                color: '#854d0e'
                                            }}>
                                                ⚠️ {account.note}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            backgroundColor: '#e0e7ff',
                            borderRadius: 'var(--radius)',
                            fontSize: '0.875rem'
                        }}>
                            <strong>💡 First Time User?</strong>
                            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text)' }}>
                                Create your own account by clicking "Create account" below the login form.
                                You can sign up as a Student or Faculty member.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Card */}
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                {/* Help Button */}
                <button
                    onClick={() => setShowHelp(true)}
                    className="btn-outline"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}
                >
                    <HelpCircle size={18} />
                    Test Accounts
                </button>

                {/* System Guide Button */}
                <button
                    onClick={() => setShowGuide(true)}
                    className="btn-outline"
                    style={{
                        position: 'absolute',
                        top: '3.5rem',
                        right: '1rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}
                >
                    <BookOpen size={18} />
                    System Guide
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'var(--accent)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <LogIn color="white" size={24} />
                    </div>
                    <h2>Sign In</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Access the Exam Registration System</p>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@university.edu"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: '1rem', padding: '0.75rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/signup">Create account</Link>
                </div>
            </div>

        </div>
    )
}
