from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String)  # 'user' or 'doctor'
    avatar = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pets = relationship("Pet", back_populates="owner")
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)
    appointments = relationship("Appointment", back_populates="user")
    lost_found_posts = relationship("LostFoundPost", back_populates="owner")

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    clinic = Column(String)
    specialization = Column(String)
    license_number = Column(String)
    experience = Column(String)
    fee = Column(Integer)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    address = Column(Text)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    available = Column(Boolean, default=True)
    approved = Column(Boolean, default=False)

    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor")

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    species = Column(String)
    breed = Column(String)
    age = Column(Integer)
    weight = Column(String)
    image = Column(String, nullable=True)
    health = Column(Text, nullable=True)
    gender = Column(String, nullable=True)
    ready_to_meet = Column(Boolean, default=False)
    bio = Column(Text, nullable=True)

    owner = relationship("User", back_populates="pets")
    appointments = relationship("Appointment", back_populates="pet")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctor_profiles.id"))
    pet_id = Column(Integer, ForeignKey("pets.id"))
    date = Column(String)
    time = Column(String)
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="appointments")
    doctor = relationship("DoctorProfile", back_populates="appointments")
    pet = relationship("Pet", back_populates="appointments")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    pet_type = Column(String)
    price = Column(Integer)
    original_price = Column(Integer)
    image = Column(String)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    in_stock = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

class LostFoundPost(Base):
    __tablename__ = "lost_found_posts"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)  # 'lost' or 'found'
    pet_name = Column(String)
    species = Column(String)
    breed = Column(String)
    color = Column(String)
    last_seen = Column(String)
    date = Column(String)
    description = Column(Text)
    image = Column(String)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    status = Column(String, default="active")  # active, resolved

    owner = relationship("User", back_populates="lost_found_posts")
