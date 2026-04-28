from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Pet Schemas
class PetBase(BaseModel):
    name: str
    species: str
    breed: str
    age: int
    gender: str
    image_url: Optional[str] = None

class PetCreate(PetBase):
    pass

class Pet(PetBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    pet_id: int
    doctor_id: int
    date: datetime
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    status: str

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

# LostPet Schemas
class LostPetBase(BaseModel):
    pet_id: int
    last_seen_location: str
    contact_info: str
    description: str

class LostPetCreate(LostPetBase):
    pass

class LostPet(LostPetBase):
    id: int
    status: str

    class Config:
        from_attributes = True
