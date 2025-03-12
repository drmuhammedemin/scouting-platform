import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Members() {
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState({
        name: '',
        birth_date: '',
        birth_place: '',
        nationality: '',
        national_id: '',
        address: '',
        phone_number: '',
        school: '',
        grade: '',
        class_: '',
        photo_url: ''
    });

    // جلب الأعضاء عند تحميل المكون
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/members/');
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/members/', newMember);
            fetchMembers(); // تحديث القائمة بعد الإضافة
            setNewMember({
                name: '',
                birth_date: '',
                birth_place: '',
                nationality: '',
                national_id: '',
                address: '',
                phone_number: '',
                school: '',
                grade: '',
                class_: '',
                photo_url: ''
            });
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    return (
        <div>
            <h1>إدارة الأعضاء</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="الاسم" value={newMember.name} onChange={handleInputChange} required />
                <input type="date" name="birth_date" placeholder="تاريخ الميلاد" value={newMember.birth_date} onChange={handleInputChange} required />
                <input type="text" name="birth_place" placeholder="مكان الميلاد" value={newMember.birth_place} onChange={handleInputChange} required />
                <input type="text" name="nationality" placeholder="الجنسية" value={newMember.nationality} onChange={handleInputChange} required />
                <input type="text" name="national_id" placeholder="الرقم الوطني" value={newMember.national_id} onChange={handleInputChange} required />
                <input type="text" name="address" placeholder="العنوان" value={newMember.address} onChange={handleInputChange} required />
                <input type="text" name="phone_number" placeholder="رقم الهاتف" value={newMember.phone_number} onChange={handleInputChange} required />
                <input type="text" name="school" placeholder="المدرسة" value={newMember.school} onChange={handleInputChange} required />
                <input type="text" name="grade" placeholder="الصف" value={newMember.grade} onChange={handleInputChange} required />
                <input type="text" name="class_" placeholder="الفصل" value={newMember.class_} onChange={handleInputChange} required />
                <input type="text" name="photo_url" placeholder="رابط الصورة" value={newMember.photo_url} onChange={handleInputChange} />
                <button type="submit">إضافة عضو</button>
            </form>

            <h2>قائمة الأعضاء</h2>
            <ul>
                {members.map(member => (
                    <li key={member.id}>
                        <strong>{member.name}</strong> - {member.national_id}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Members;
