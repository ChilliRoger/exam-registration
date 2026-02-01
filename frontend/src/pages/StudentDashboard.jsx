import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react'

const Overview = () => {
    const [registrations, setRegistrations] = React.useState([])

    React.useEffect(() => {
        fetch('http://localhost:5000/api/registrations/my', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => setRegistrations(data || []))
            .catch(err => console.error(err))
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
                {registrations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No registrations found.</p>
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
                                    <td>{reg.date}</td>
                                    <td>
                                        <span className={`badge ${reg.status === 'Approved' ? 'badge-success' : reg.status === 'Rejected' ? 'badge-error' : 'badge-pending'}`}>
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
    const [schedule, setSchedule] = React.useState([])

    React.useEffect(() => {
        fetch('http://localhost:5000/api/registrations/my', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => setSchedule(data.filter(r => r.status === 'Approved')))
    }, [])

    return (
        <div className="card">
            <h3>My Exam Schedule</h3>
            {schedule.length === 0 ? <p>No approved exams schedule available.</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Hall Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map(exam => (
                            <tr key={exam.id}>
                                <td>{exam.code} - {exam.name}</td>
                                <td>{exam.date}</td>
                                <td>Check Hall Allocation on Notice Board (or contact Admin)</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

const SubjectSelection = () => {
    const [subjects, setSubjects] = React.useState([])

    React.useEffect(() => {
        fetch('http://localhost:5000/api/subjects')
            .then(res => res.json())
            .then(data => setSubjects(data))
    }, [])

    const handleRegister = async (examId) => {
        try {
            const res = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ exam_id: examId })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            alert('Registered Successfully!')
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <div className="card">
            <h3>Subject Selection</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select the subjects you wish to register for the upcoming semester examination.</p>
            <div className="flex flex-col gap-4">
                {subjects.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-4 border rounded-md" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex-1">
                            <div style={{ fontWeight: '600' }}>{sub.code} - {sub.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Credits: {sub.credits}</div>
                        </div>
                        <button className="btn-primary" onClick={() => handleRegister(sub.id)}>Register</button>
                    </div>
                ))}
            </div>
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
