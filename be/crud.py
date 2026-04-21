from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Pet CRUD
def get_pets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Pet).offset(skip).limit(limit).all()

def get_user_pets(db: Session, user_id: int):
    return db.query(models.Pet).filter(models.Pet.owner_id == user_id).all()

def create_pet(db: Session, pet: schemas.PetCreate, user_id: int):
    db_pet = models.Pet(**pet.dict(), owner_id=user_id)
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet

# Doctor CRUD
def get_doctors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DoctorProfile).offset(skip).limit(limit).all()

def create_doctor_profile(db: Session, profile: schemas.DoctorProfileCreate, user_id: int):
    db_profile = models.DoctorProfile(**profile.dict(), user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# Appointment CRUD
def create_appointment(db: Session, appointment: schemas.AppointmentCreate, user_id: int):
    db_app = models.Appointment(**appointment.dict(), user_id=user_id)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

def get_user_appointments(db: Session, user_id: int):
    return db.query(models.Appointment).filter(models.Appointment.user_id == user_id).all()

def get_doctor_appointments(db: Session, doctor_id: int):
    return db.query(models.Appointment).filter(models.Appointment.doctor_id == doctor_id).all()

# Product CRUD
def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductBase):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# LostFound CRUD
def get_lost_found_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LostFoundPost).offset(skip).limit(limit).all()

def create_lost_found_post(db: Session, post: schemas.LostFoundPostCreate, user_id: int):
    db_post = models.LostFoundPost(**post.dict(), owner_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
