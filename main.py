from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # استيراد StaticFiles
from passlib.context import CryptContext
import os
import jwt
import sqlalchemy

# تحميل المتغيرات من ملف .env
load_dotenv()

# إنشاء اتصال بقاعدة البيانات
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# تعريف النماذج
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

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
    evaluations = relationship("Evaluation", back_populates="member")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)

    member = relationship("Member", back_populates="attendance")

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    week_start_date = Column(Date, nullable=False)
    attendance_score = Column(Integer)
    punctuality_score = Column(Integer)
    appearance_score = Column(Integer)
    cleanliness_score = Column(Integer)
    notebook_and_pen_score = Column(Integer)
    task_performance_score = Column(Integer)
    weekly_followup_score = Column(Integer)
    response_to_call_score = Column(Integer)
    activity_and_initiative_score = Column(Integer)
    notes = Column(String)

    member = relationship("Member", back_populates="evaluations")

# إنشاء الجداول في قاعدة البيانات
Base.metadata.create_all(bind=engine)

# تعريف نماذج Pydantic لإدخال البيانات
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

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

class EvaluationCreate(BaseModel):
    member_id: int
    week_start_date: date
    attendance_score: int
    punctuality_score: int
    appearance_score: int
    cleanliness_score: int
    notebook_and_pen_score: int
    task_performance_score: int
    weekly_followup_score: int
    response_to_call_score: int
    activity_and_initiative_score: int
    notes: Optional[str] = None

# إعدادات أمان
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

def get_user(db, username: str):
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# إنشاء تطبيق FastAPI
app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="frontend/public"), name="static")

# إضافة CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # يسمح بجميع المصادر
    allow_credentials=True,
    allow_methods=["*"],  # يسمح بجميع الطرق
    allow_headers=["*"],  # يسمح بجميع العناوين
)

# نقاط النهاية
@app.post("/users/")
def create_user(user: UserCreate):
    db = SessionLocal()
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except sqlalchemy.exc.IntegrityError as e:
        db.rollback()
        if "unique constraint" in str(e.orig):
            raise HTTPException(status_code=400, detail="Email already exists")
        raise HTTPException(status_code=400, detail="Error creating user")
    finally:
        db.close()
    
    return db_user

@app.post("/login/")
def login(user: UserLogin):
    db = SessionLocal()
    db_user = authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.username})
    db.close()
    return {"access_token": access_token, "token_type": "bearer"}

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

@app.get("/members/")
def get_members():
    db = SessionLocal()
    members = db.query(Member).all()
    db.close()
    return members

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

@app.post("/evaluations/")
def create_evaluation(evaluation: EvaluationCreate):
    db = SessionLocal()
    db_evaluation = Evaluation(**evaluation.dict())
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    db.close()
    return db_evaluation

@app.get("/evaluations/")
def get_evaluations():
    db = SessionLocal()
    evaluations = db.query(Evaluation).all()
    db.close()
    return evaluations

@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("frontend/public/index.html") as f:
        return HTMLResponse(content=f.read())
