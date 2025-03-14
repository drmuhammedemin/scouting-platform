import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login/', { username, password });
            setToken(response.data.access_token);
        } catch (error) {
            console.error('Error logging in:', error);
            alert('خطأ في تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.');
        }
    };

    return (
        <div>
            <h1>تسجيل الدخول</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    اسم المستخدم:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    كلمة المرور:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">تسجيل الدخول</button>
            </form>
        </div>
    );
}

export default Login;
