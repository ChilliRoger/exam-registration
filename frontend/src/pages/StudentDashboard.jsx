import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react'

const API_URL = 'http://localhost:5000'

const Overview = () => {
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        fetchRegistrations()
        const interval = setInterval(fetchRegistrations, 5000)
        return () => clearInterval(interval)
    }, [])

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

    useEffect(() => {
        fetchSchedule()
        const interval = setInterval(fetchSchedule, 5000)
        return () => clearInterval(interval)
    }, [])

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
    const [exams, setExams] = useState([])
    const [myRegistrations, setMyRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [registering, setRegistering] = useState(null)

    const fetchData = async () => {
        try {
            const [examsRes, regRes] = await Promise.all([
                fetch(`${API_URL}/api/exams`),
                fetch(`${API_URL}/api/registrations/my`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
            ])
            const examsData = await examsRes.json()
            const regData = await regRes.json()
            setExams(examsData || [])
            setMyRegistrations(regData || [])
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleRegister = async (examId) => {
        setRegistering(examId)
        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ exam_id: examId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            // Success: Refresh data immediately
            await fetchData()
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
                Register for available exams for the upcoming semester.
            </p>

            {loading ? (
                <p>Loading available exams...</p>
            ) : exams.length === 0 ? (
                <p>No exams available for registration at this time.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {exams.map(exam => {
                        const isRegistered = myRegistrations.some(r => r.exam_id === exam.id)
                        return (
                            <div
                                key={exam.id}
                                className="flex items-center justify-between p-4 border rounded-md"
                                style={{ borderColor: 'var(--border)' }}
                            >
                                <div className="flex-1">
                                    <div style={{ fontWeight: '600' }}>{exam.code} - {exam.subject_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Date: {new Date(exam.date).toLocaleDateString()} | Slot: {exam.slot}
                                    </div>
                                </div>
                                <button
                                    className={isRegistered ? "btn-outline" : "btn-primary"}
                                    onClick={() => handleRegister(exam.id)}
                                    disabled={isRegistered || registering === exam.id}
                                    style={isRegistered ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                                >
                                    {isRegistered ? 'Registered' : registering === exam.id ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

import Profile from './Profile'

export default function StudentDashboard() {
    return (
        <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="subjects" element={<SubjectSelection />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
    )
}
