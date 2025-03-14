import React, { useState } from 'react';
import axios from 'axios';

function Evaluations() {
    const [evaluation, setEvaluation] = useState({
        member_id: '',
        week_start_date: '',
        attendance_score: 0,
        punctuality_score: 0,
        appearance_score: 0,
        cleanliness_score: 0,
        notebook_and_pen_score: 0,  // إضافة هذا الحقل
        task_performance_score: 0,  // إضافة هذا الحقل
        weekly_followup_score: 0,   // إضافة هذا الحقل
        response_to_call_score: 0,  // إضافة هذا الحقل
        activity_and_initiative_score: 0,  // إضافة هذا الحقل
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvaluation({ ...evaluation, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/evaluations/', evaluation);
            alert('تم تسجيل التقييم بنجاح!');
            setEvaluation({
                member_id: '',
                week_start_date: '',
                attendance_score: 0,
                punctuality_score: 0,
                appearance_score: 0,
                cleanliness_score: 0,
                notebook_and_pen_score: 0,  // إعادة تعيين الحقل
                task_performance_score: 0,  // إعادة تعيين الحقل
                weekly_followup_score: 0,   // إعادة تعيين الحقل
                response_to_call_score: 0,  // إعادة تعيين الحقل
                activity_and_initiative_score: 0,  // إعادة تعيين الحقل
                notes: ''
            });
        } catch (error) {
            console.error('Error recording evaluation:', error);
        }
    };

    return (
        <div>
            <h1>تسجيل التقييمات الأسبوعية</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    معرف العضو:
                    <input type="number" name="member_id" placeholder="معرف العضو" value={evaluation.member_id} onChange={handleInputChange} required />
                </label>
                <label>
                    تاريخ بداية الأسبوع:
                    <input type="date" name="week_start_date" value={evaluation.week_start_date} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة الحضور:
                    <input type="number" name="attendance_score" placeholder="درجة الحضور" value={evaluation.attendance_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة الالتزام بالموعد:
                    <input type="number" name="punctuality_score" placeholder="درجة الالتزام بالموعد" value={evaluation.punctuality_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة الهندام:
                    <input type="number" name="appearance_score" placeholder="درجة الهندام" value={evaluation.appearance_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة النظافة:
                    <input type="number" name="cleanliness_score" placeholder="درجة النظافة" value={evaluation.cleanliness_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة إحضار المذكرة والقلم:
                    <input type="number" name="notebook_and_pen_score" placeholder="درجة إحضار المذكرة والقلم" value={evaluation.notebook_and_pen_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة أداء المهمة:
                    <input type="number" name="task_performance_score" placeholder="درجة أداء المهمة" value={evaluation.task_performance_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة جدول المتابعة الأسبوعي:
                    <input type="number" name="weekly_followup_score" placeholder="درجة جدول المتابعة الأسبوعي" value={evaluation.weekly_followup_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة تلبية النداء:
                    <input type="number" name="response_to_call_score" placeholder="درجة تلبية النداء" value={evaluation.response_to_call_score} onChange={handleInputChange} required />
                </label>
                <label>
                    درجة النشاط والمبادرة:
                    <input type="number" name="activity_and_initiative_score" placeholder="درجة النشاط والمبادرة" value={evaluation.activity_and_initiative_score} onChange={handleInputChange} required />
                </label>
                <label>
                    ملاحظات:
                    <textarea name="notes" placeholder="ملاحظات" value={evaluation.notes} onChange={handleInputChange} />
                </label>
                <button type="submit">تسجيل</button>
            </form>
        </div>
    );
}

export default Evaluations;
