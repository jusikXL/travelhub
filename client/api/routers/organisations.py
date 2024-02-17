from sqlalchemy import exc
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select, update

from ..database import get_session
from ..database.models import OrganisationMetadata, HotelMetadata
from .commune import OrganisationFull, HotelBasic, OrganisationBasic, HotelFull

router = APIRouter()

@router.get("/")
def get_all_organisations(
    session: Session = Depends(get_session),
) -> list[OrganisationBasic]:
    try:
        organisations = session.exec(select(OrganisationMetadata)).all()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="No Organisations Found",
        )

    # Convert organisations to OrganisationBasic model
    organisations_list = [
        OrganisationBasic(
            title=organisation.title,
            address=organisation.address,
            subtitle=organisation.subtitle,
            image=organisation.image,
        )
        for organisation in organisations
    ]

    return organisations_list
