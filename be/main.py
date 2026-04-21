from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta

from . import models, schemas, crud, database
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VetPet API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, specify FE URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to VetPet API"}

# --- AUTH ENDPOINTS ---

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login")
def login(user_credentials: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user_credentials.email)
    if not db_user or not crud.verify_password(user_credentials.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # In a real app, you'd return a JWT token here
    # For simplicity in this demo, we'll return user info
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "role": db_user.role,
        "avatar": db_user.avatar,
        "access_token": "fake-jwt-token-for-demo",
        "token_type": "bearer"
    }

# --- USER ENDPOINTS ---

@app.get("/users/me", response_model=schemas.User)
def get_current_user_profile(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- PET ENDPOINTS ---

@app.post("/pets/", response_model=schemas.Pet)
def create_pet(pet: schemas.PetCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_pet(db=db, pet=pet, user_id=user_id)

@app.get("/pets/", response_model=List[schemas.Pet])
def get_all_pets(db: Session = Depends(get_db)):
    return crud.get_pets(db)

@app.get("/users/{user_id}/pets", response_model=List[schemas.Pet])
def get_user_pets(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_pets(db, user_id=user_id)

# --- DOCTOR ENDPOINTS ---

@app.get("/doctors/", response_model=List[schemas.DoctorProfile])
def get_doctors(db: Session = Depends(get_db)):
    return crud.get_doctors(db)

@app.post("/doctors/profile", response_model=schemas.DoctorProfile)
def create_doc_profile(profile: schemas.DoctorProfileCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_doctor_profile(db=db, profile=profile, user_id=user_id)

# --- APPOINTMENT ENDPOINTS ---

@app.post("/appointments/", response_model=schemas.Appointment)
def book_appointment(appointment: schemas.AppointmentCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_appointment(db=db, appointment=appointment, user_id=user_id)

@app.get("/users/{user_id}/appointments", response_model=List[schemas.Appointment])
def list_user_appointments(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_appointments(db, user_id=user_id)

# --- SHOP ENDPOINTS ---

@app.get("/products/", response_model=List[schemas.Product])
def list_products(db: Session = Depends(get_db)):
    return crud.get_products(db)

@app.post("/products/", response_model=schemas.Product)
def add_product(product: schemas.ProductBase, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

# --- LOST & FOUND ENDPOINTS ---

@app.get("/lost-found/", response_model=List[schemas.LostFoundPost])
def list_lost_found(db: Session = Depends(get_db)):
    return crud.get_lost_found_posts(db)

@app.post("/lost-found/", response_model=schemas.LostFoundPost)
def create_lost_found(post: schemas.LostFoundPostCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_lost_found_post(db=db, post=post, user_id=user_id)
