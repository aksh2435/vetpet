from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

import models, schemas
from database import engine, get_db, Base

# Create tables
Base.metadata.create_all(bind=engine)

SECRET_KEY = os.getenv("SECRET_KEY", "vetpet-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

app = FastAPI(title="VetPet API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth helpers ──────────────────────────────────────────────
def verify_password(plain, hashed): return pwd_context.verify(plain, hashed)
def hash_password(password): return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None: raise credentials_exception
    return user

# ── Auth routes ───────────────────────────────────────────────
@app.post("/api/auth/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role,
        phone=user_in.phone,
        hashed_password=hash_password(user_in.password),
    )
    db.add(user); db.commit(); db.refresh(user)
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# ── Pet routes ────────────────────────────────────────────────
@app.get("/api/pets", response_model=List[schemas.Pet])
def get_pets(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Pet).filter(models.Pet.owner_id == current_user.id).all()

@app.post("/api/pets", response_model=schemas.Pet)
def create_pet(pet_in: schemas.PetCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = models.Pet(**pet_in.dict(), owner_id=current_user.id)
    db.add(pet); db.commit(); db.refresh(pet)
    return pet

@app.put("/api/pets/{pet_id}", response_model=schemas.Pet)
def update_pet(pet_id: int, pet_in: schemas.PetCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id, models.Pet.owner_id == current_user.id).first()
    if not pet: raise HTTPException(status_code=404, detail="Pet not found")
    for k, v in pet_in.dict().items(): setattr(pet, k, v)
    db.commit(); db.refresh(pet)
    return pet

@app.delete("/api/pets/{pet_id}")
def delete_pet(pet_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id, models.Pet.owner_id == current_user.id).first()
    if not pet: raise HTTPException(status_code=404, detail="Pet not found")
    db.delete(pet); db.commit()
    return {"message": "Pet deleted"}

# ── Appointment routes ────────────────────────────────────────
@app.get("/api/appointments", response_model=List[schemas.Appointment])
def get_appointments(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "doctor":
        return db.query(models.Appointment).filter(models.Appointment.doctor_id == current_user.id).all()
    pets = db.query(models.Pet).filter(models.Pet.owner_id == current_user.id).all()
    pet_ids = [p.id for p in pets]
    return db.query(models.Appointment).filter(models.Appointment.pet_id.in_(pet_ids)).all()

@app.post("/api/appointments", response_model=schemas.Appointment)
def create_appointment(appt_in: schemas.AppointmentCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    appt = models.Appointment(**appt_in.dict())
    db.add(appt); db.commit(); db.refresh(appt)
    return appt

@app.put("/api/appointments/{appt_id}/status")
def update_appointment_status(appt_id: int, status: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    appt = db.query(models.Appointment).filter(models.Appointment.id == appt_id).first()
    if not appt: raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = status; db.commit()
    return {"message": "Status updated"}

# ── Doctors list ──────────────────────────────────────────────
@app.get("/api/doctors", response_model=List[schemas.User])
def get_doctors(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "doctor").all()

# ── Products ──────────────────────────────────────────────────
@app.get("/api/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

# ── Lost & Found ──────────────────────────────────────────────
@app.get("/api/lost-pets", response_model=List[schemas.LostPet])
def get_lost_pets(db: Session = Depends(get_db)):
    return db.query(models.LostPet).all()

@app.post("/api/lost-pets", response_model=schemas.LostPet)
def report_lost_pet(lost_in: schemas.LostPetCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    lost = models.LostPet(**lost_in.dict())
    db.add(lost); db.commit(); db.refresh(lost)
    return lost

# ── Health check ──────────────────────────────────────────────
@app.get("/api/health")
def health(): return {"status": "ok"}
