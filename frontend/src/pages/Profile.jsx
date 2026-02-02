import React, { useState, useEffect } from 'react'
import { User, Mail, Upload, Save, Building, Hash, Calendar, Camera } from 'lucide-react'

const API_URL = 'http://localhost:5000'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [preview, setPreview] = useState(null)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/api/profile`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            setUser(data)
            setFormData({ ...data, profile_photo: null })
            if (data.profile_photo) {
                setPreview(`${API_URL}${data.profile_photo}`)
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, profile_photo: file })
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdating(true)

        const data = new FormData()
        data.append('name', formData.name || '')
        data.append('email', formData.email || '')

        if (formData.profile_photo instanceof File) {
            data.append('profile_photo', formData.profile_photo)
        }

        if (user.role === 'student') {
            data.append('register_no', formData.register_no || '')
            data.append('department', formData.department || '')
            data.append('year', formData.year || '')
        } else if (user.role === 'faculty') {
            data.append('department', formData.department || '')
            data.append('staff_id', formData.staff_id || '')
        } else if (user.role === 'admin') {
            data.append('staff_id', formData.staff_id || '')
        }

        try {
            const res = await fetch(`${API_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: data
            })

            if (!res.ok) throw new Error('Failed to update profile')

            alert('Profile updated successfully!')
            fetchProfile()
        } catch (err) {
            alert('Failed to update profile')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading profile...</p>
    if (!user) return <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--error)' }}>Error loading profile.</p>

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-banner"></div>

                <form onSubmit={handleSubmit}>
                    {/* Header Section */}
                    <div className="profile-header">
                        <div className="profile-avatar-container">
                            <div className="profile-avatar-wrapper">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="profile-avatar-img" />
                                ) : (
                                    <User size={64} color="#cbd5e1" />
                                )}
                            </div>
                            <label className="profile-upload-label" title="Change Photo">
                                <Camera size={18} />
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                        <h2 style={{ marginBottom: '0.25rem' }}>{user.name}</h2>
                        <span className="badge badge-pending" style={{ textTransform: 'capitalize' }}>
                            {user.role} Account
                        </span>
                    </div>

                    {/* Personal Info */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <User size={20} color="var(--accent)" />
                            Personal Information
                        </h3>
                        <div className="form-grid">
                            <div className="input-wrapper">
                                <label className="input-label">Full Name</label>
                                <div className="input-field-container">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        className="input-with-icon"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <label className="input-label">Email Address</label>
                                <div className="input-field-container">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="input-with-icon"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role Specific Info */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <Building size={20} color="var(--accent)" />
                            {user.role === 'student' ? 'Academic Details' : 'Professional Details'}
                        </h3>

                        <div className="form-grid">
                            {user.role === 'student' && (
                                <>
                                    <div className="input-wrapper">
                                        <label className="input-label">Register Number</label>
                                        <div className="input-field-container">
                                            <Hash size={18} className="input-icon" />
                                            <input
                                                type="text"
                                                name="register_no"
                                                value={formData.register_no || ''}
                                                onChange={handleChange}
                                                className="input-with-icon"
                                                placeholder="Reg No."
                                            />
                                        </div>
                                    </div>
                                    <div className="input-wrapper">
                                        <label className="input-label">Year of Study</label>
                                        <div className="input-field-container">
                                            <Calendar size={18} className="input-icon" />
                                            <input
                                                type="text"
                                                name="year"
                                                value={formData.year || ''}
                                                onChange={handleChange}
                                                className="input-with-icon"
                                                placeholder="e.g. 3rd Year"
                                            />
                                        </div>
                                    </div>
                                    <div className="input-wrapper" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Department</label>
                                        <div className="input-field-container">
                                            <Building size={18} className="input-icon" />
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department || ''}
                                                onChange={handleChange}
                                                className="input-with-icon"
                                                placeholder="Department Name"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {user.role === 'faculty' && (
                                <>
                                    <div className="input-wrapper">
                                        <label className="input-label">Staff ID</label>
                                        <div className="input-field-container">
                                            <Hash size={18} className="input-icon" />
                                            <input
                                                type="text"
                                                name="staff_id"
                                                value={formData.staff_id || ''}
                                                onChange={handleChange}
                                                className="input-with-icon"
                                                placeholder="Staff ID"
                                            />
                                        </div>
                                    </div>
                                    <div className="input-wrapper">
                                        <label className="input-label">Department</label>
                                        <div className="input-field-container">
                                            <Building size={18} className="input-icon" />
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department || ''}
                                                onChange={handleChange}
                                                className="input-with-icon"
                                                placeholder="Department Name"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {user.role === 'admin' && (
                                <div className="input-wrapper">
                                    <label className="input-label">Admin ID</label>
                                    <div className="input-field-container">
                                        <Hash size={18} className="input-icon" />
                                        <input
                                            type="text"
                                            name="staff_id"
                                            value={formData.staff_id || ''}
                                            onChange={handleChange}
                                            className="input-with-icon"
                                            placeholder="Admin ID"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="save-btn-container">
                        <button type="submit" className="btn-primary" disabled={updating} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} />
                            {updating ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
