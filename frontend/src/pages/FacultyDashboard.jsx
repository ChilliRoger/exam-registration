import React, { useState, useEffect } from 'react'
import { Check, X, FileText } from 'lucide-react'

const API_URL = 'http://localhost:5000'

export default function FacultyDashboard() {
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(null)

    useEffect(() => {
        fetchPending()
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

    return (
        <div className="flex flex-col gap-6">
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

            <div className="card">
                <h3>Exam Reports</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Generate and download examination reports.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <button className="btn-outline flex flex-col items-center gap-2 p-6">
                        <FileText size={32} color="var(--text-muted)" />
                        <span>Attendance Sheet</span>
                    </button>
                    <button className="btn-outline flex flex-col items-center gap-2 p-6">
                        <FileText size={32} color="var(--text-muted)" />
                        <span>Registration Summary</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
