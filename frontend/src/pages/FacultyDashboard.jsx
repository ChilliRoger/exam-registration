import React, { useState, useEffect } from 'react'
import { Check, X, FileText, Activity } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

export default function FacultyDashboard() {
    const location = useLocation()
    const path = location.pathname
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(null)

    useEffect(() => {
        fetchPending()
        const interval = setInterval(fetchPending, 5000)
        return () => clearInterval(interval)
    }, [])

    const fetchPending = async () => {
        try {
            const res = await fetch(`${API_URL}/api/registrations/pending`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            setRegistrations(data || [])
        } catch (err) {
            console.error('Failed to fetch pending registrations:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (id, status) => {
        setProcessing(id)
        try {
            const res = await fetch(`${API_URL}/api/registrations/${id}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Verification failed')
            }

            alert(`Registration ${status.toLowerCase()} successfully!`)
            fetchPending() // Refresh list
        } catch (err) {
            alert(err.message)
        } finally {
            setProcessing(null)
        }
    }

    const handleDownloadReport = async (type) => {
        try {
            const status = type === 'attendance' ? 'Approved' : ''
            const res = await fetch(`${API_URL}/api/registrations${status ? `?status=${status}` : ''}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()

            if (!data || data.length === 0) {
                alert('No data available for report')
                return
            }

            // Generate CSV
            const headers = ['Student Name', 'Email', 'Subject Code', 'Subject Name', 'Exam Date', 'Hall', 'Slot', 'Status']
            const csvContent = [
                headers.join(','),
                ...data.map(row => [
                    `"${row.student_name}"`,
                    `"${row.email}"`,
                    `"${row.code}"`,
                    `"${row.subject_name}"`,
                    row.date,
                    `"${row.hall}"`,
                    row.slot,
                    row.status
                ].join(','))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error(err)
            alert('Failed to generate report')
        }
    }

    const renderOverview = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card flex items-center justify-between">
                <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending Actions</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{registrations.length}</div>
                </div>
                <Activity color="var(--accent)" size={32} />
            </div>
            <div className="card">
                <h3>Welcome, Faculty</h3>
                <p style={{ color: 'var(--text-muted)' }}>Select an option from the sidebar to manage students.</p>
            </div>
        </div>
    )

    const renderVerify = () => (
        <div className="card">
            <h3>Pending Verifications</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Review student eligibility and approve registration forms.
            </p>

            {loading ? (
                <p>Loading...</p>
            ) : registrations.length === 0 ? (
                <p>No pending registrations at this time.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Exam Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map(reg => (
                            <tr key={reg.id}>
                                <td>{reg.student_name}</td>
                                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reg.email}</td>
                                <td>{reg.code} - {reg.subject_name}</td>
                                <td>{new Date(reg.date).toLocaleDateString()}</td>
                                <td><span className="badge badge-pending">{reg.status}</span></td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn-primary flex items-center gap-1"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                            onClick={() => handleVerify(reg.id, 'Approved')}
                                            disabled={processing === reg.id}
                                        >
                                            <Check size={14} /> Approve
                                        </button>
                                        <button
                                            className="btn-outline flex items-center gap-1"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--error)' }}
                                            onClick={() => handleVerify(reg.id, 'Rejected')}
                                            disabled={processing === reg.id}
                                        >
                                            <X size={14} /> Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )

    const renderReports = () => (
        <div className="card">
            <h3>Exam Reports</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Generate and download examination reports.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <button
                    className="btn-outline flex flex-col items-center gap-2 p-6"
                    onClick={() => handleDownloadReport('attendance')}
                >
                    <FileText size={32} color="var(--text-muted)" />
                    <span>Attendance Sheet</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Approved Only)</span>
                </button>
                <button
                    className="btn-outline flex flex-col items-center gap-2 p-6"
                    onClick={() => handleDownloadReport('summary')}
                >
                    <FileText size={32} color="var(--text-muted)" />
                    <span>Registration Summary</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(All Students)</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-6">
            {path.includes('dashboard') && renderOverview()}
            {path.includes('verify') && renderVerify()}
            {path.includes('reports') && renderReports()}
        </div>
    )
}
