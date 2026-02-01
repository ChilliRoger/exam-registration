import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react'

const API_URL = 'http://localhost:5000'

const Overview = () => {
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRegistrations()
    }, [])

    const fetchRegistrations = async () => {
        try {
            const res = await fetch(`${API_URL}/api/registrations/my`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            setRegistrations(data || [])
        } catch (err) {
            console.error('Failed to fetch registrations:', err)
        } finally {
            setLoading(false)
        }
    }

    const approvedCount = registrations.filter(r => r.status === 'Approved').length
    const pendingCount = registrations.filter(r => r.status === 'Pending').length

    return (
        <div className="flex flex-col gap-6">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="card flex items-center gap-4">
                    <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '12px' }}>
                        <CheckCircle color="#166534" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Registered Exams</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{registrations.length}</div>
                    </div>
                </div>

                <div className="card flex items-center gap-4">
                    <div style={{ padding: '0.75rem', backgroundColor: '#fef9c3', borderRadius: '12px' }}>
                        <Clock color="#854d0e" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending Approvals</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingCount}</div>
                    </div>
                </div>

                <div className="card flex items-center gap-4">
                    <div style={{ padding: '0.75rem', backgroundColor: '#e0e7ff', borderRadius: '12px' }}>
                        <Calendar color="#3730a3" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Approved Exams</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{approvedCount}</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>Active Registrations</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                ) : registrations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No registrations found. Register for exams from the Subject Selection page.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Exam Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(reg => (
                                <tr key={reg.id}>
                                    <td>{reg.code}</td>
                                    <td>{reg.name}</td>
                                    <td>{new Date(reg.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${reg.status === 'Approved' ? 'badge-success' :
                                                reg.status === 'Rejected' ? 'badge-error' :
                                                    'badge-pending'
                                            }`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

const Schedule = () => {
    const [schedule, setSchedule] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSchedule()
    }, [])

    const fetchSchedule = async () => {
        try {
            const res = await fetch(`${API_URL}/api/registrations/my`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            setSchedule(data.filter(r => r.status === 'Approved'))
        } catch (err) {
            console.error('Failed to fetch schedule:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card">
            <h3>My Exam Schedule</h3>
            {loading ? (
                <p>Loading...</p>
            ) : schedule.length === 0 ? (
                <p>No approved exams scheduled yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Hall</th>
                            <th>Time Slot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map(exam => (
                            <tr key={exam.id}>
                                <td>{exam.code} - {exam.name}</td>
                                <td>{new Date(exam.date).toLocaleDateString()}</td>
                                <td>{exam.hall}</td>
                                <td>{exam.slot}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

const SubjectSelection = () => {
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [registering, setRegistering] = useState(null)

    useEffect(() => {
        fetchSubjects()
    }, [])

    const fetchSubjects = async () => {
        try {
            const res = await fetch(`${API_URL}/api/subjects`)
            const data = await res.json()
            setSubjects(data)
        } catch (err) {
            console.error('Failed to fetch subjects:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (subjectId) => {
        setRegistering(subjectId)
        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ exam_id: subjectId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            alert('Registered successfully! Check your dashboard for status.')
        } catch (err) {
            alert(err.message)
        } finally {
            setRegistering(null)
        }
    }

    return (
        <div className="card">
            <h3>Subject Selection</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Select the subjects you wish to register for the upcoming semester examination.
            </p>

            {loading ? (
                <p>Loading subjects...</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {subjects.map(sub => (
                        <div
                            key={sub.id}
                            className="flex items-center justify-between p-4 border rounded-md"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <div className="flex-1">
                                <div style={{ fontWeight: '600' }}>{sub.code} - {sub.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Credits: {sub.credits}
                                </div>
                            </div>
                            <button
                                className="btn-primary"
                                onClick={() => handleRegister(sub.id)}
                                disabled={registering === sub.id}
                            >
                                {registering === sub.id ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function StudentDashboard() {
    return (
        <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="subjects" element={<SubjectSelection />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
    )
}
