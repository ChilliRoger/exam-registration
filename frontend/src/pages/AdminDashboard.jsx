import React from 'react'
import { Plus, Settings, Users, Calendar } from 'lucide-react'

export default function AdminDashboard() {
    const [exams, setExams] = React.useState([])
    const [showForm, setShowForm] = React.useState(false)
    const [subjects, setSubjects] = React.useState([])
    const [formData, setFormData] = React.useState({ subject_id: '', date: '', hall: '', slot: '' })

    React.useEffect(() => {
        fetchExams()
        fetchSubjects()
    }, [])

    const fetchExams = () => {
        fetch('http://localhost:5000/api/exams')
            .then(res => res.json())
            .then(data => setExams(data))
    }

    const fetchSubjects = () => {
        fetch('http://localhost:5000/api/subjects')
            .then(res => res.json())
            .then(data => setSubjects(data))
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:5000/api/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                alert('Exam scheduled successfully')
                setShowForm(false)
                fetchExams()
            }
        } catch (err) {
            alert('Failed to schedule exam')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="card flex items-center justify-between">
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Exams Scheduled</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{exams.length}</div>
                    </div>
                    <Calendar color="var(--accent)" size={32} />
                </div>
            </div>

            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h3>Exam Schedule Management</h3>
                    <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
                        <Plus size={18} /> {showForm ? 'Cancel' : 'Add New Schedule'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreate} className="flex flex-col gap-4" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius)' }}>
                        <div className="flex gap-4">
                            <select
                                required
                                value={formData.subject_id}
                                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                            </select>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Hall Allocation (e.g. Hall A)"
                                required
                                value={formData.hall}
                                onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                            />
                            <select
                                required
                                value={formData.slot}
                                onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                            >
                                <option value="">Select Slot</option>
                                <option value="Morning">Morning (9:00 AM - 12:00 PM)</option>
                                <option value="Afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Schedule</button>
                    </form>
                )}

                <table>
                    <thead>
                        <tr>
                            <th>Exam Code</th>
                            <th>Subject Name</th>
                            <th>Date</th>
                            <th>Hall Allocation</th>
                            <th>Slot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map(exam => (
                            <tr key={exam.id}>
                                <td>{exam.code}</td>
                                <td>{exam.subject_name}</td>
                                <td>{exam.date}</td>
                                <td>{exam.hall}</td>
                                <td>{exam.slot}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3>System Configuration</h3>
                <div className="flex gap-4" style={{ marginTop: '1rem' }}>
                    <button className="btn-outline flex items-center gap-2">
                        <Settings size={18} /> Database Backup
                    </button>
                    <button className="btn-outline flex items-center gap-2">
                        <Users size={18} /> Manage Faculty Roles
                    </button>
                </div>
            </div>
        </div>
    )
}
