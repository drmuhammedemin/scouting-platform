import React, { useState } from 'react';
import axios from 'axios';

function Attendance() {
    const [attendance, setAttendance] = useState({
        member_id: '',
        date: '',
        status: 'present'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAttendance({ ...attendance, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/attendance/', attendance);
            alert('تم تسجيل الحضور بنجاح!');
            setAttendance({
                member_id: '',
                date: '',
                status: 'present'
            });
        } catch (error) {
            console.error('Error recording attendance:', error);
        }
    };

    return (
        <div>
            <h1>تسجيل الحضور والغياب</h1>
            <form onSubmit={handleSubmit}>
                <input type="number" name="member_id" placeholder="معرف العضو" value={attendance.member_id} onChange={handleInputChange} required />
                <input type="date" name="date" value={attendance.date} onChange={handleInputChange} required />
                <select name="status" value={attendance.status} onChange={handleInputChange}>
                    <option value="present">حاضر</option>
                    <option value="absent">غائب</option>
                </select>
                <button type="submit">تسجيل</button>
            </form>
        </div>
    );
}

export default Attendance;
