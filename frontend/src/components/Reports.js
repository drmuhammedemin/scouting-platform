import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const response = await axios.get('http://localhost:8000/evaluations/');
                setEvaluations(response.data);
            } catch (error) {
                console.error('Error fetching evaluations:', error);
            }
        };

        fetchEvaluations();
    }, []);

    return (
        <div>
            <h1>تقارير التقييمات</h1>
            <table>
                <thead>
                    <tr>
                        <th>معرف العضو</th>
                        <th>تاريخ بداية الأسبوع</th>
                        <th>درجة الحضور</th>
                        <th>درجة الالتزام بالموعد</th>
                        <th>درجة الهندام</th>
                        <th>درجة النظافة</th>
                        <th>درجة إحضار المذكرة والقلم</th>
                        <th>درجة أداء المهمة</th>
                        <th>درجة جدول المتابعة الأسبوعي</th>
                        <th>درجة تلبية النداء</th>
                        <th>درجة النشاط والمبادرة</th>
                        <th>ملاحظات</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.map(evaluation => (
                        <tr key={evaluation.id}>
                            <td>{evaluation.member_id}</td>
                            <td>{evaluation.week_start_date}</td>
                            <td>{evaluation.attendance_score}</td>
                            <td>{evaluation.punctuality_score}</td>
                            <td>{evaluation.appearance_score}</td>
                            <td>{evaluation.cleanliness_score}</td>
                            <td>{evaluation.notebook_and_pen_score}</td>
                            <td>{evaluation.task_performance_score}</td>
                            <td>{evaluation.weekly_followup_score}</td>
                            <td>{evaluation.response_to_call_score}</td>
                            <td>{evaluation.activity_and_initiative_score}</td>
                            <td>{evaluation.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reports;