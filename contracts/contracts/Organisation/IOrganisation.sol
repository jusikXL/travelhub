// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AHotel} from "../Hotel/AHotel.sol";

interface IOrganisation {
    event HotelCreated(address indexed hotelAddress);
    event RevenueCollected(
        address indexed destination,
        uint256 amount,
        uint256 fee
    );
    event HotelRemoved(address indexed hotelAddress);

    error InvalidHotel(address hotelAddress);

    function createHotel(
        address hotelOwner
    ) external returns (address hotelAddress);

    function collectRevenue(address destination) external;

    function removeHotel(address hotelAddress) external;
}
