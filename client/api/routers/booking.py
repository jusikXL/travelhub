from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import NoResultFound
from sqlmodel import Session, select, and_

from ..database import get_session
from ..database.models import Booking, HotelMetadata, Room
from .commune import BookingBasic

router = APIRouter()