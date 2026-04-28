from sqlalchemy import Column, Integer, String, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String)  # "owner" or "doctor"
    phone = Column(String)
    is_active = Column(Boolean, default=True)

    pets = relationship("Pet", back_populates="owner")
    appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    species = Column(String)
    breed = Column(String)
    age = Column(Integer)
    gender = Column(String)
    image_url = Column(String, nullable=True)

    owner = relationship("User", back_populates="pets")
    appointments = relationship("Appointment", back_populates="pet")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="pending") # pending, confirmed, cancelled, completed
    notes = Column(String, nullable=True)

    pet = relationship("Pet", back_populates="appointments")
    doctor = relationship("User", back_populates="appointments", foreign_keys=[doctor_id])

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    price = Column(Float)
    stock = Column(Integer)
    image_url = Column(String, nullable=True)

class LostPet(Base):
    __tablename__ = "lost_pets"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"))
    last_seen_location = Column(String)
    contact_info = Column(String)
    status = Column(String, default="lost") # lost, found
    description = Column(String)
    
    pet = relationship("Pet")

class PetMatch(Base):
    __tablename__ = "pet_matches"

    id = Column(Integer, primary_key=True, index=True)
    pet1_id = Column(Integer, ForeignKey("pets.id"))
    pet2_id = Column(Integer, ForeignKey("pets.id"))
    status = Column(String) # pending, matched, rejected
