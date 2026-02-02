import React, { useState, useEffect } from 'react'
import { Plus, Calendar, Users, Settings, BookOpen, Trash } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Profile from './Profile'

const API_URL = 'http://localhost:5000'

export default function AdminDashboard() {
    const location = useLocation()
    const path = location.pathname

    // Data States
    const [exams, setExams] = useState([])
    const [subjects, setSubjects] = useState([])
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState({ totalStudents: 0, totalExams: 0, pendingRegistrations: 0 })

    // UI States
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [showSubjectForm, setShowSubjectForm] = useState(false)

    // Form Data
    const [formData, setFormData] = useState({
        subject_id: '',
        date: '',
        hall: '',
        slot: ''
    })
    const [subjectFormData, setSubjectFormData] = useState({
        code: '',
        name: '',
        credits: ''
    })

    useEffect(() => {
        const fetchData = async (isBackground = false) => {
            if (!isBackground) setLoading(true)

            if (path.includes('dashboard')) {
                await fetchStats()
            } else if (path.includes('exams')) {
                await Promise.all([fetchExams(), fetchSubjects()])
            } else if (path.includes('users')) {
                await fetchUsers()
            }

            if (!isBackground) setLoading(false)
        }

        fetchData(false)
        const interval = setInterval(() => fetchData(true), 5000)
        return () => clearInterval(interval)
    }, [path])

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stats`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            setStats(data)
        } catch (err) { console.error(err) }
    }

    const fetchExams = async () => {
        try {
            const res = await fetch(`${API_URL}/api/exams`)
            const data = await res.json()
            setExams(data)
        } catch (err) { console.error(err) }
    }

    const fetchSubjects = async () => {
        try {
            const res = await fetch(`${API_URL}/api/subjects`)
            const data = await res.json()
            setSubjects(data)
        } catch (err) { console.error(err) }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            setUsers(data)
        } catch (err) { console.error(err) }
    }

    const handleCreateExam = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}/api/exams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            alert('Exam scheduled successfully!')
            setShowForm(false)
            setFormData({ subject_id: '', date: '', hall: '', slot: '' })
            fetchExams()
        } catch (err) { alert(err.message) }
        finally { setSubmitting(false) }
    }

    const handleCreateSubject = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}/api/subjects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(subjectFormData)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            alert('Subject added successfully!')
            setShowSubjectForm(false)
            setSubjectFormData({ code: '', name: '', credits: '' })
            fetchSubjects()
        } catch (err) { alert(err.message) }
        finally { setSubmitting(false) }
    }

    const renderDashboard = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card flex items-center justify-between">
                <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Students</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalStudents}</div>
                </div>
                <Users color="var(--accent)" size={32} />
            </div>
            <div className="card flex items-center justify-between">
                <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Exams Scheduled</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalExams}</div>
                </div>
                <Calendar color="var(--accent)" size={32} />
            </div>
            <div className="card flex items-center justify-between">
                <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending Verifications</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pendingRegistrations}</div>
                </div>
                <Settings color="var(--accent)" size={32} />
            </div>
        </div>
    )

    const renderExams = () => (
        <div className="flex flex-col gap-6">
            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h3>Exam Schedule Management</h3>
                    <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
                        <Plus size={18} /> {showForm ? 'Cancel' : 'Add New Schedule'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreateExam} className="flex flex-col gap-4" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius)' }}>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Subject</label>
                                <select required value={formData.subject_id} onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })} disabled={submitting}>
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Exam Date</label>
                                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} disabled={submitting} min={new Date().toISOString().split('T')[0]} />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Hall Allocation</label>
                                <input type="text" placeholder="e.g., Hall A" required value={formData.hall} onChange={(e) => setFormData({ ...formData, hall: e.target.value })} disabled={submitting} />
                            </div>
                            <div className="flex-1">
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Time Slot</label>
                                <select required value={formData.slot} onChange={(e) => setFormData({ ...formData, slot: e.target.value })} disabled={submitting}>
                                    <option value="">Select Slot</option>
                                    <option value="Morning">Morning (9:00 AM - 12:00 PM)</option>
                                    <option value="Afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={submitting}>{submitting ? 'Saving...' : 'Save Schedule'}</button>
                    </form>
                )}

                {loading ? <p>Loading...</p> : exams.length === 0 ? <p>No exams scheduled.</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Exam Code</th>
                                <th>Subject Name</th>
                                <th>Date</th>
                                <th>Hall</th>
                                <th>Slot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.code}</td>
                                    <td>{exam.subject_name}</td>
                                    <td>{new Date(exam.date).toLocaleDateString()}</td>
                                    <td>{exam.hall}</td>
                                    <td>{exam.slot}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h3>Subject Management</h3>
                    <button className="btn-outline flex items-center gap-2" onClick={() => setShowSubjectForm(!showSubjectForm)}>
                        <BookOpen size={18} /> {showSubjectForm ? 'Cancel' : 'Add New Subject'}
                    </button>
                </div>

                {showSubjectForm && (
                    <form onSubmit={handleCreateSubject} className="flex flex-col gap-4" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius)' }}>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Code</label>
                                <input type="text" placeholder="e.g. CS401" required value={subjectFormData.code} onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value })} disabled={submitting} />
                            </div>
                            <div className="flex-1">
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Name</label>
                                <input type="text" placeholder="e.g. AI" required value={subjectFormData.name} onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })} disabled={submitting} />
                            </div>
                            <div style={{ width: '100px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Credits</label>
                                <input type="number" min="1" max="10" required value={subjectFormData.credits} onChange={(e) => setSubjectFormData({ ...subjectFormData, credits: e.target.value })} disabled={submitting} />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={submitting}>{submitting ? 'Saving...' : 'Add Subject'}</button>
                    </form>
                )}

                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map(sub => (
                            <tr key={sub.id}>
                                <td style={{ fontWeight: '500' }}>{sub.code}</td>
                                <td>{sub.name}</td>
                                <td>{sub.credits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    const renderUsers = () => (
        <div className="card">
            <h3>User Accounts</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Manage system users and roles.</p>
            {loading ? <p>Loading users...</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td style={{ fontWeight: '500' }}>{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className={`badge ${u.role === 'admin' ? 'badge-approved' : 'badge-pending'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )

    return (
        <div className="flex flex-col gap-6">
            {path.includes('dashboard') && renderDashboard()}
            {path.includes('exams') && renderExams()}
            {path.includes('users') && renderUsers()}
            {path.includes('profile') && <Profile />}
        </div>
    )
}
