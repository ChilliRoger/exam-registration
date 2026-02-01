import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import bcrypt from 'bcryptjs'

const db = new sqlite3.Database('./database.sqlite')
const run = promisify(db.run.bind(db))
const get = promisify(db.get.bind(db))
const all = promisify(db.all.bind(db))

export async function initDb() {
    await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'faculty', 'admin')) NOT NULL
    )
  `)

    await run(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      credits INTEGER NOT NULL,
      faculty_id INTEGER,
      FOREIGN KEY(faculty_id) REFERENCES users(id)
    )
  `)

    await run(`
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      hall TEXT NOT NULL,
      slot TEXT NOT NULL,
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )
  `)

    await run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      exam_id INTEGER NOT NULL,
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
      payment_status TEXT DEFAULT 'Paid',
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(exam_id) REFERENCES exams(id)
    )
  `)

    // Seed initial data
    const subjectCount = await get('SELECT COUNT(*) as count FROM subjects')
    if (subjectCount.count === 0) {
        await run(`INSERT INTO subjects (code, name, credits) VALUES 
      ('CS401', 'Software Engineering', 4),
      ('CS402', 'Database Management', 4),
      ('CS403', 'Computer Networks', 3)`)

        await run(`INSERT INTO exams (subject_id, date, hall, slot) VALUES 
      (1, '2026-05-15', 'Hall A', 'Morning'),
      (2, '2026-05-18', 'Hall B', 'Afternoon')`)
    }

    // Seed test user accounts
    const userCount = await get('SELECT COUNT(*) as count FROM users')
    if (userCount.count === 0) {
        // Hash passwords (using bcrypt with 10 salt rounds)
        const studentPassword = await bcrypt.hash('student123', 10)
        const facultyPassword = await bcrypt.hash('faculty123', 10)
        const adminPassword = await bcrypt.hash('admin123', 10)

        await run(`INSERT INTO users (name, email, password, role) VALUES 
      ('Test Student', 'student@university.edu', ?, 'student'),
      ('Test Faculty', 'faculty@university.edu', ?, 'faculty'),
      ('Test Admin', 'admin@university.edu', ?, 'admin')`,
            [studentPassword, facultyPassword, adminPassword]
        )

        console.log('✓ Test accounts created:')
        console.log('  - Student: student@university.edu / student123')
        console.log('  - Faculty: faculty@university.edu / faculty123')
        console.log('  - Admin: admin@university.edu / admin123')
    }

    console.log('✓ Database initialized successfully.')
}

export default { db, run, get, all }
