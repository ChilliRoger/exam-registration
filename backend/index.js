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

// Routes
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        )
        res.status(201).json({ message: 'User created' })
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email])
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET)
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } })
})

// Exam Routes
app.get('/api/subjects', async (req, res) => {
    const subjects = await db.all('SELECT * FROM subjects')
    res.json(subjects)
})

app.post('/api/register', authenticate, async (req, res) => {
    const { exam_id } = req.body
    try {
        await db.run(
            'INSERT INTO registrations (student_id, exam_id) VALUES (?, ?)',
            [req.user.id, exam_id]
        )
        res.status(201).json({ message: 'Registered successfully' })
    } catch (err) {
        res.status(400).json({ error: 'Registration failed' })
    }
})

// Student: Get My Registrations
app.get('/api/registrations/my', authenticate, async (req, res) => {
    try {
        const registrations = await db.all(`
            SELECT r.id, s.code, s.name, e.date, r.status 
            FROM registrations r 
            JOIN exams e ON r.exam_id = e.id 
            JOIN subjects s ON e.subject_id = s.id 
            WHERE r.student_id = ?
        `, [req.user.id])
        res.json(registrations)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch registrations' })
    }
})

// Faculty: Get Pending Registrations
app.get('/api/registrations/pending', authenticate, async (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' })
    }
    const pending = await db.all(`
        SELECT r.id, u.name as student_name, s.code, s.name as subject_name, r.status 
        FROM registrations r 
        JOIN users u ON r.student_id = u.id 
        JOIN exams e ON r.exam_id = e.id 
        JOIN subjects s ON e.subject_id = s.id 
        WHERE r.status = 'Pending'
    `)
    res.json(pending)
})

// Faculty: Verify Registration
app.post('/api/registrations/:id/verify', authenticate, async (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' })
    }
    const { status } = req.body // 'Approved' or 'Rejected'
    await db.run('UPDATE registrations SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ message: `Registration ${status}` })
})

// Admin: Get All Exams
app.get('/api/exams', async (req, res) => {
    const exams = await db.all(`
        SELECT e.id, s.code, s.name as subject_name, e.date, e.hall, e.slot 
        FROM exams e 
        JOIN subjects s ON e.subject_id = s.id
    `)
    res.json(exams)
})

// Admin: Create Exam Schedule
app.post('/api/exams', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' })
    const { subject_id, date, hall, slot } = req.body
    try {
        await db.run(
            'INSERT INTO exams (subject_id, date, hall, slot) VALUES (?, ?, ?, ?)',
            [subject_id, date, hall, slot]
        )
        res.status(201).json({ message: 'Exam scheduled' })
    } catch (err) {
        res.status(400).json({ error: 'Failed to schedule exam' })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
