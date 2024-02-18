from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import organisations, hotels, booking

app = FastAPI()

# Sasha (‿ˠ‿)╭ᑎ╮𓀐

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=["*"],
)

app.include_router(organisations.router, prefix="/api/organisations", tags=["organisations"])
app.include_router(hotels.router, prefix="/api/hotels", tags=["hotels"])
app.include_router(booking.router, prefix="/api/bookings", tags=["bookings"])


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}
