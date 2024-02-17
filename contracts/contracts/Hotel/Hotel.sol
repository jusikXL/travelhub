// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IHotel} from "./IHotel.sol";

abstract contract Hotel is IHotel, Ownable {
    address public immutable organisation;
    IERC20 public immutable stablecoin;
    uint256 public cancellationDelay;

    mapping(uint256 bookingId => Booking) public bookings;
    mapping(uint256 roomId => uint256 price) public prices;

    constructor(
        address _initialOwner,
        IERC20 _stablecoin,
        uint256 _cancellationDelay
    ) Ownable(_initialOwner) {
        organisation = msg.sender;
        stablecoin = _stablecoin;
        cancellationDelay = _cancellationDelay;
    }

    function updateCancellationDelay(
        uint256 newDelay
    ) public virtual override onlyOwner {
        cancellationDelay = newDelay;
        emit CancellationDelayUpdated(newDelay);
    }

    function addRoom(
        uint256 roomId,
        uint256 price
    ) public virtual override onlyOwner returns (uint256 initialBookingId) {
        if (price < 5 ether) {
            revert InsufficientPrice(price, 5 ether);
        }
        if (prices[roomId] != 0) {
            revert RoomAlreadyExists(roomId);
        }
        prices[roomId] = price;
        initialBookingId = hashBooking(roomId, 0, 0);
        bookings[initialBookingId] = Booking(
            roomId,
            msg.sender,
            0,
            0,
            0,
            0,
            initialBookingId,
            initialBookingId,
            false
        );

        emit RoomCreated(roomId, price, initialBookingId);
    }

    function removeRoom(uint256 roomId) public virtual override onlyOwner {
        if (prices[roomId] == 0) {
            revert InvalidRoomId(roomId);
        }
        prices[roomId] = 0;
        _cancelBooking(hashBooking(roomId, 0, 0));
        emit RoomRemoved(roomId);
    }

    function changeRoomPrice(
        uint256 roomId,
        uint256 newPrice
    ) public virtual override onlyOwner {
        if (prices[roomId] == 0) {
            revert InvalidRoomId(roomId);
        }
        if (newPrice < 5 ether || newPrice == prices[roomId]) {
            revert InsufficientPrice(newPrice, 5 ether);
        }
        prices[roomId] = newPrice;
        emit RoomPriceChanged(roomId, newPrice);
    }

    function _validateBooking(
        uint256 roomId,
        uint128 checkInDate,
        uint128 checkOutDate,
        uint256 pastBookingId,
        uint256 nextBookingId
    ) private view {
        if (prices[roomId] == 0) {
            // check if room exists
            revert InvalidRoomId(roomId);
        }
        if (
            checkInDate < block.timestamp ||
            checkInDate >= checkOutDate ||
            (checkOutDate - checkInDate) % 1 days != 0
        ) {
            // Check in date > now
            // Check out date > check in date
            // The duration is not a whole number of days
            revert InvalidDates(checkInDate, checkOutDate);
        }
        Booking storage pastBooking = bookings[pastBookingId];
        if (pastBooking.roomId != roomId) {
            // check that past booking exists
            revert InvalidBookingId(pastBookingId);
        }
        if (pastBooking.nextBookingId != nextBookingId) {
            // check that next booking coincides with provided one
            revert InvalidBookingId(nextBookingId);
        }
        Booking storage nextBooking = bookings[nextBookingId];
        if (
            // check for booking overlap
            !(checkInDate >= pastBooking.checkOutDate &&
                (nextBookingId == hashBooking(roomId, 0, 0) ||
                    checkOutDate <= nextBooking.checkInDate))
        ) {
            revert BookingOverlap(
                checkInDate,
                checkOutDate,
                pastBooking.checkOutDate,
                nextBooking.checkInDate
            );
        }
    }

    function book(
        uint256 roomId,
        uint128 checkInDate,
        uint128 checkOutDate,
        uint256 pastBookingId,
        uint256 nextBookingId
    ) public virtual override returns (uint256 newBookingId) {
        _validateBooking(
            roomId,
            checkInDate,
            checkOutDate,
            pastBookingId,
            nextBookingId
        );

        address guest = msg.sender;
        uint256 nights = (checkOutDate - checkInDate) / 1 days;
        uint256 totalPrice = prices[roomId] * nights;

        newBookingId = hashBooking(roomId, checkInDate, checkOutDate);
        bookings[newBookingId] = Booking(
            roomId,
            guest,
            checkInDate,
            checkOutDate,
            checkInDate - cancellationDelay,
            totalPrice,
            pastBookingId,
            nextBookingId,
            false
        );
        bookings[pastBookingId].nextBookingId = newBookingId;
        bookings[nextBookingId].pastBookingId = newBookingId;
        emit BookingCreated(
            newBookingId,
            roomId,
            guest,
            checkInDate,
            checkOutDate,
            checkInDate - cancellationDelay,
            totalPrice,
            pastBookingId,
            nextBookingId
        );

        stablecoin.transferFrom(guest, address(this), totalPrice);
    }

    function cancelBooking(uint256 bookingId) public virtual override {
        Booking storage booking = bookings[bookingId];
        address operator = msg.sender;
        if (booking.guest != operator && owner() != operator) {
            // only guest or admin can cancel the booking
            revert UnauthorizedBookingCancellation(operator, booking.guest);
        }
        if (booking.price == 0) {
            // booking does not exist or initial
            revert InvalidBookingId(bookingId);
        }
        if (block.timestamp >= booking.cancellationDeadline) {
            revert CancellationDeadlineReached(
                bookingId,
                booking.cancellationDeadline
            );
        }
        emit BookingCancelled(bookingId, operator);
        stablecoin.transfer(booking.guest, booking.price);
        _cancelBooking(bookingId);
    }

    function _cancelBooking(uint256 bookingId) private {
        Booking storage booking = bookings[bookingId];
        bookings[booking.pastBookingId].nextBookingId = booking.nextBookingId;
        bookings[booking.nextBookingId].pastBookingId = booking.pastBookingId;
        delete bookings[bookingId];
    }

    function collectRevenue(uint256[] calldata bookingIds) public onlyOwner {
        if (bookingIds.length == 0) {
            revert NoBookingsToCollect();
        }
        uint256 amount;
        for (uint256 i = 0; i < bookingIds.length; ++i) {
            uint256 bookingId = bookingIds[i];
            Booking storage booking = bookings[bookingId];
            if (booking.price == 0) {
                revert InvalidBookingId(bookingId);
            }
            if (block.timestamp < booking.cancellationDeadline) {
                revert CancellationDeadlineNotReached(
                    bookingId,
                    booking.cancellationDeadline
                );
            }
            if (booking.revenueCollected) {
                revert RevenueAlreadyCollected(bookingId);
            }
            bookings[bookingId].revenueCollected = true;
            amount += bookings[bookingId].price;
        }
        emit RevenueCollected(bookingIds);
        stablecoin.transfer(organisation, amount);
    }

    function hashBooking(
        uint256 roomId,
        uint128 checkInDate,
        uint128 checkOutDate
    ) public pure virtual override returns (uint256 bookingId) {
        return
            uint256(
                keccak256(abi.encodePacked(roomId, checkInDate, checkOutDate))
            );
    }
}
