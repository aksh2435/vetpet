from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    role: str = "user"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None

class User(UserBase):
    id: int
    role: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Doctor Schemas
class DoctorProfileBase(BaseModel):
    clinic: str
    specialization: str
    license_number: str
    experience: str
    fee: int
    address: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class DoctorProfileCreate(DoctorProfileBase):
    pass

class DoctorProfile(DoctorProfileBase):
    id: int
    user_id: int
    rating: float
    reviews_count: int
    available: bool
    approved: bool

    class Config:
        from_attributes = True

class DoctorResponse(User):
    doctor_profile: Optional[DoctorProfile] = None

# Pet Schemas
class PetBase(BaseModel):
    name: str
    species: str
    breed: str
    age: int
    weight: str
    image: Optional[str] = None
    health: Optional[str] = None
    gender: Optional[str] = None
    ready_to_meet: bool = False
    bio: Optional[str] = None

class PetCreate(PetBase):
    pass

class Pet(PetBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    doctor_id: int
    pet_id: int
    date: str
    time: str
    reason: str

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str
    pet_type: str
    price: int
    original_price: int
    image: str
    description: Optional[str] = None

class Product(ProductBase):
    id: int
    rating: float
    reviews_count: int
    in_stock: bool

    class Config:
        from_attributes = True

# LostFound Schemas
class LostFoundPostBase(BaseModel):
    type: str
    pet_name: str
    species: str
    breed: str
    color: str
    last_seen: str
    date: str
    description: str
    image: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class LostFoundPostCreate(LostFoundPostBase):
    pass

class LostFoundPost(LostFoundPostBase):
    id: int
    owner_id: int
    status: str

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
