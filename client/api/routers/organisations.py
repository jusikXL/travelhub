from sqlalchemy import exc
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select, update

from ..database import get_session
from ..database.models import OrganisationMetadata, HotelMetadata
from .commune import OrganisationFull, HotelBasic, OrganisationBasic, HotelFull

router = APIRouter()


@router.post("/{address}/add_hotel")
def add_hotel(
    hotel: HotelMetadata, session: Session = Depends(get_session)
) -> HotelFull:
    try:
        # Check if the organization exists
        organisation = session.exec(
            select(OrganisationMetadata).where(
                OrganisationMetadata.address == hotel.organisation
            )
        ).first()
        if not organisation:
            raise HTTPException(status_code=404, detail="Organization not found")

        session.add(hotel)
        session.commit()

        # Retrieve the added hotel
        added_hotel = session.exec(
            select(HotelMetadata).where(HotelMetadata.address == hotel.address)
        ).first()

        # Convert hotel to HotelFull model
        hotel_full = HotelFull(
            title=added_hotel.title,
            subtitle=added_hotel.subtitle,
            city=added_hotel.city,
            location=added_hotel.location,
            image=added_hotel.image,
            address=added_hotel.address,
            owner=added_hotel.owner,
            contacts=added_hotel.contacts,
            cancellationDelay=str(added_hotel.cancellation_delay),
            organisation=OrganisationBasic(
                title=organisation.title,
                subtitle=organisation.subtitle,
                address=organisation.address,
                image=organisation.image,
            ),
            usefulInfo=added_hotel.useful_info,
            description=added_hotel.description,
            rooms=[],
        )

        return hotel_full

    except IntegrityError as e:
        raise HTTPException(
            status_code=500,
            detail="Hotel with provided address already exists",
        )


@router.get("/{address}")
def get_organisation(
    address: str, session: Session = Depends(get_session)
) -> OrganisationFull:
    try:
        organisation = session.exec(
            select(OrganisationMetadata).where(OrganisationMetadata.address == address)
        ).one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Organisation Not Found",
        )

    hotels = session.exec(
        select(HotelMetadata).where(HotelMetadata.organisation == address)
    ).all()

    # Convert hotels to HotelBasic model
    hotels_list = [
        HotelBasic(
            title=hotel.title,
            subtitle=hotel.subtitle,
            city=hotel.city,
            location=hotel.location,
            image=hotel.image,
            address=hotel.address,
        )
        for hotel in hotels
    ]

    return OrganisationFull(
        title=organisation.title,
        address=organisation.address,
        subtitle=organisation.subtitle,
        image=organisation.image,
        owner=organisation.owner,
        contacts=organisation.contacts,
        description=organisation.description,
        hotels=hotels_list,
    )


# @router.get("/{address}/hotels")
# def get_all_hotels(address: str, session: Session = Depends(get_session)) -> list[HotelBasic]:
#     try:
#         hotels = session.exec(select(HotelMetadata).where(HotelMetadata.organisation == address)).all()
#     except exc.NoResultFound:
#         raise HTTPException(
#             status_code=404,
#             detail="No Hotels Found",
#         )
#     # Convert hotels to HotelBasic model
#     hotels_list = [
#         HotelBasic(
#             title=hotel.title,
#             subtitle=hotel.subtitle,
#             city=hotel.city,
#             location=hotel.location,
#             image=hotel.image,
#             address=hotel.address
#         ) for hotel in hotels
#     ]
#
#     return hotels_list


@router.get("/user_organisations/{user_address}")
def get_user_organisations_by_address(
    user_address: str, session: Session = Depends(get_session)
) -> list[OrganisationBasic]:
    query = select(OrganisationMetadata).where(
        OrganisationMetadata.owner == user_address
    )
    try:
        organisations = session.exec(query).all()
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


@router.get("/")
def get_all_organisations(
    session: Session = Depends(get_session),
) -> list[OrganisationBasic]:
    try:
        organisations = session.exec(select(OrganisationMetadata)).all()
    except exc.NoResultFound:#👃
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


@router.post("/add_organisation")
def add_organisation(
    organisation: OrganisationMetadata, session: Session = Depends(get_session)
) -> OrganisationFull:
    try:

        session.add(organisation)
        session.commit()

        # Convert organization to OrganisationFull model
        organisation_full = OrganisationFull(
            title=organisation.title,
            address=organisation.address,
            subtitle=organisation.subtitle,
            image=organisation.image,
            owner=organisation.owner,
            contacts=organisation.contacts,
            description=organisation.description,
            hotels=[],
        )

        return organisation_full

    except IntegrityError as e:
        raise HTTPException(
            status_code=500,
            detail="Organisation with provided contract address already exists",
        )
