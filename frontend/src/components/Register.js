import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/users/', { username, email, password });
            alert('تم إنشاء المستخدم بنجاح!');
        } catch (error) {
            console.error('Error registering:', error);
            alert('خطأ في إنشاء المستخدم.');
        }
    };

    return (
        <div>
            <h1>تسجيل مستخدم جديد</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    اسم المستخدم:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    البريد الإلكتروني:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    كلمة المرور:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">تسجيل</button>
            </form>
        </div>
    );
}

export default Register;
