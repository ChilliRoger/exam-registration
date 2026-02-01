import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db, { initDb } from './database.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

app.use(cors())
app.use(express.json())

// Initialize Database
initDb().catch(console.error)

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    try {
        req.user = jwt.verify(token, JWT_SECRET)
        next()
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' })
    }
}

// ============ AUTH ROUTES ============
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        )
        res.status(201).json({ message: 'User created successfully' })
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email])
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
    res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
})

// ============ SUBJECT ROUTES ============
app.get('/api/subjects', async (req, res) => {
    try {
        const subjects = await db.all('SELECT * FROM subjects')
        res.json(subjects)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subjects' })
    }
})

// ============ REGISTRATION ROUTES ============
app.post('/api/register', authenticate, async (req, res) => {
    const { exam_id } = req.body

    if (!exam_id) {
        return res.status(400).json({ error: 'Exam ID is required' })
    }

    try {
        // Check if already registered
        const existing = await db.get(
            'SELECT * FROM registrations WHERE student_id = ? AND exam_id = ?',
            [req.user.id, exam_id]
        )

        if (existing) {
            return res.status(400).json({ error: 'Already registered for this exam' })
        }

        await db.run(
            'INSERT INTO registrations (student_id, exam_id) VALUES (?, ?)',
            [req.user.id, exam_id]
        )
        res.status(201).json({ message: 'Registered successfully' })
    } catch (err) {
        res.status(400).json({ error: 'Registration failed' })
    }
})

app.get('/api/registrations/my', authenticate, async (req, res) => {
    try {
        const registrations = await db.all(`
      SELECT r.id, s.code, s.name, e.date, e.hall, e.slot, r.status 
      FROM registrations r 
      JOIN exams e ON r.exam_id = e.id 
      JOIN subjects s ON e.subject_id = s.id 
      WHERE r.student_id = ?
      ORDER BY e.date ASC
    `, [req.user.id])
        res.json(registrations)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch registrations' })
    }
})

app.get('/api/registrations/pending', authenticate, async (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' })
    }

    try {
        const pending = await db.all(`
      SELECT r.id, u.name as student_name, u.email, s.code, s.name as subject_name, 
             e.date, r.status 
      FROM registrations r 
      JOIN users u ON r.student_id = u.id 
      JOIN exams e ON r.exam_id = e.id 
      JOIN subjects s ON e.subject_id = s.id 
      WHERE r.status = 'Pending'
      ORDER BY e.date ASC
    `)
        res.json(pending)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pending registrations' })
    }
})

app.post('/api/registrations/:id/verify', authenticate, async (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' })
    }

    const { status } = req.body

    if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
    }

    try {
        await db.run('UPDATE registrations SET status = ? WHERE id = ?', [status, req.params.id])
        res.json({ message: `Registration ${status.toLowerCase()}` })
    } catch (err) {
        res.status(500).json({ error: 'Failed to update registration' })
    }
})

// ============ EXAM ROUTES ============
app.get('/api/exams', async (req, res) => {
    try {
        const exams = await db.all(`
      SELECT e.id, s.code, s.name as subject_name, e.date, e.hall, e.slot 
      FROM exams e 
      JOIN subjects s ON e.subject_id = s.id
      ORDER BY e.date ASC
    `)
        res.json(exams)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch exams' })
    }
})

app.post('/api/exams', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' })
    }

    const { subject_id, date, hall, slot } = req.body

    if (!subject_id || !date || !hall || !slot) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        await db.run(
            'INSERT INTO exams (subject_id, date, hall, slot) VALUES (?, ?, ?, ?)',
            [subject_id, date, hall, slot]
        )
        res.status(201).json({ message: 'Exam scheduled successfully' })
    } catch (err) {
        res.status(400).json({ error: 'Failed to schedule exam' })
    }
})

// ============ STATS ROUTES ============
app.get('/api/stats', authenticate, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const totalStudents = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "student"')
            const totalExams = await db.get('SELECT COUNT(*) as count FROM exams')
            const pendingRegs = await db.get('SELECT COUNT(*) as count FROM registrations WHERE status = "Pending"')

            res.json({
                totalStudents: totalStudents.count,
                totalExams: totalExams.count,
                pendingRegistrations: pendingRegs.count
            })
        } else {
            res.status(403).json({ error: 'Access denied' })
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' })
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`)
})
