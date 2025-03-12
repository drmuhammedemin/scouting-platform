from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
import os

# تحميل المتغيرات من ملف .env
load_dotenv()

# إنشاء اتصال بقاعدة البيانات
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# تعريف النماذج
Base = declarative_base()

class Member(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    birth_date = Column(String)
    birth_place = Column(String)
    nationality = Column(String)
    national_id = Column(String, unique=True)
    address = Column(String)
    phone_number = Column(String)
    school = Column(String)
    grade = Column(String)
    class_ = Column(String)
    photo_url = Column(String, nullable=True)

    attendance = relationship("Attendance", back_populates="member")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)

    member = relationship("Member", back_populates="attendance")

# إنشاء الجداول في قاعدة البيانات
Base.metadata.create_all(bind=engine)

# تعريف نماذج Pydantic لإدخال البيانات
class MemberCreate(BaseModel):
    name: str
    birth_date: str
    birth_place: str
    nationality: str
    national_id: str
    address: str
    phone_number: str
    school: str
    grade: str
    class_: str
    photo_url: Optional[str] = None

class AttendanceCreate(BaseModel):
    member_id: int
    date: date
    status: str

# إنشاء تطبيق FastAPI
app = FastAPI()

# إضافة CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # يسمح بجميع المصادر
    allow_credentials=True,
    allow_methods=["*"],  # يسمح بجميع الطرق
    allow_headers=["*"],  # يسمح بجميع العناوين
)

# نقاط النهاية
@app.post("/members/")
def create_member(member: MemberCreate):
    db = SessionLocal()
    db_member = Member(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    db.close()
    return db_member

@app.get("/members/{member_id}")
def read_member(member_id: int):
    db = SessionLocal()
    member = db.query(Member).filter(Member.id == member_id).first()
    db.close()
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@app.post("/attendance/")
def create_attendance(attendance: AttendanceCreate):
    db = SessionLocal()
    db_attendance = Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    db.close()
    return db_attendance

@app.get("/attendance/")
def get_attendance():
    db = SessionLocal()
    attendance_data = db.query(Attendance).all()
    db.close()
    return attendance_data
