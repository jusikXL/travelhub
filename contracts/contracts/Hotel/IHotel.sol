// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHotel {
    struct Booking {
        uint256 roomId;
        address guest;
        uint128 checkInDate;
        uint128 checkOutDate;
        uint256 cancellationDeadline;
        uint256 price;
        uint256 pastBookingId;
        uint256 nextBookingId;
        bool revenueCollected;
    }
    error InvalidDates(uint128 checkInDate, uint128 checkOutDate);
    error BookingOverlap(
        uint128 providedCheckInDate,
        uint128 providedCheckOutDate,
        uint128 pastCheckOutDate,
        uint128 nextCheckInDate
    );
    error InvalidRoomId(uint256 roomId);
    error InvalidBookingId(uint256 bookingId);
    error RoomAlreadyExists(uint256 roomId);
    error InsufficientPrice(uint256 providedPrice, uint256 minPrice);
    error UnauthorizedBookingCancellation(address operator, address guest);
    error CancellationDeadlineReached(
        uint256 bookingId,
        uint256 cancellationDeadline
    );
    error CancellationDeadlineNotReached(
        uint256 bookingId,
        uint256 cancellationDeadline
    );
    error NoBookingsToCollect();
    error RevenueAlreadyCollected(uint256 bookingId);
    event BookingCreated(
        uint256 indexed bookingId,
        uint256 indexed roomId,
        address indexed guest,
        uint128 checkInDate,
        uint128 checkOutDate,
        uint256 cancellationDeadline,
        uint256 price,
        uint256 pastBookingId,
        uint256 nextBookingId
    );
    event RoomCreated(
        uint256 indexed roomId,
        uint256 price,
        uint256 initialBookingId
    );
    event BookingCancelled(uint256 indexed bookingId, address operator);
    event RevenueCollected(uint256[] indexed bookingIds);
    event CancellationDelayUpdated(uint256 indexed newDelay);
    event RoomRemoved(uint256 indexed roomId);
    event RoomPriceChanged(uint256 indexed roomId, uint256 newPrice);

    function updateCancellationDelay(uint256 newDelay) external;

    function addRoom(
        uint256 roomId,
        uint256 price
    ) external returns (uint256 initialBookingId);

    function book(
        uint256 roomId,
        uint128 checkInDate,
        uint128 checkOutDate,
        uint256 pastBookingId,
        uint256 nextBookingId
    ) external returns (uint256 newBookingId);

    function cancelBooking(uint256 bookingId) external;

    function collectRevenue(uint256[] calldata bookingIds) external;

    function hashBooking(
        uint256 roomId,
        uint128 checkInDate,
        uint128 checkOutDate
    ) external pure returns (uint256 bookingId);

    function removeRoom(uint256 roomId) external;

    function changeRoomPrice(uint256 roomId, uint256 newPrice) external;
}
