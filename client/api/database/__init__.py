from sqlmodel import create_engine, Session
from ..config import DATABASE_URL

engine = create_engine(
    url=DATABASE_URL, echo=False, pool_pre_ping=True, pool_recycle=300
)


def get_session():
    with Session(engine) as session:
        yield session
