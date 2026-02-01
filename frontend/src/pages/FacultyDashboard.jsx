import React from 'react'
import { Check, X, FileText } from 'lucide-react'

export default function FacultyDashboard() {
    const [registrations, setRegistrations] = React.useState([])

    React.useEffect(() => {
        fetchPending()
    }, [])

    const fetchPending = () => {
        fetch('http://localhost:5000/api/registrations/pending', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => setRegistrations(data || []))
            .catch(err => console.error(err))
    }

    const handleVerify = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:5000/api/registrations/${id}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                alert(`Registration ${status}`)
                fetchPending() // Refresh list
            }
        } catch (err) {
            alert('Operation failed')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="card">
                <h3>Pending Verifications</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Review student eligibility and approve registration forms.</p>

                {registrations.length === 0 ? <p>No pending registrations.</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(reg => (
                                <tr key={reg.id}>
                                    <td>{reg.student_name}</td>
                                    <td>{reg.code} - {reg.subject_name}</td>
                                    <td><span className="badge badge-pending">{reg.status}</span></td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn-primary flex items-center gap-1"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                onClick={() => handleVerify(reg.id, 'Approved')}
                                            >
                                                <Check size={14} /> Approve
                                            </button>
                                            <button
                                                className="btn-outline flex items-center gap-1"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--error)' }}
                                                onClick={() => handleVerify(reg.id, 'Rejected')}
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
