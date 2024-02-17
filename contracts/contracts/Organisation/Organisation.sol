// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IOrganisation} from "./IOrganisation.sol";
import {AHotel} from "../Hotel/AHotel.sol";

abstract contract Organisation is IOrganisation, Ownable {
    address public immutable organisationFactory;
    IERC20 public immutable stablecoin;
    mapping(address => bool) public hotels;

    constructor(
        address _initialOwner,
        IERC20 _stablecoin
    ) Ownable(_initialOwner) {
        organisationFactory = msg.sender;
        stablecoin = _stablecoin;
    }

    function removeHotel(
        address hotelAddress
    ) public virtual override onlyOwner {
        if (hotels[hotelAddress] == false) {
            revert InvalidHotel(hotelAddress);
        }

        hotels[hotelAddress] = false;
        emit HotelRemoved(hotelAddress);
    }

    function createHotel(
        address hotelOwner
    ) public virtual override onlyOwner returns (address hotelAddress) {
        AHotel newHotel = new AHotel(hotelOwner, stablecoin, 1 days);
        hotelAddress = address(newHotel);

        hotels[hotelAddress] = true;
        emit HotelCreated(hotelAddress);
    }

    function collectRevenue(
        address destination
    ) public virtual override onlyOwner {
        uint256 amount = stablecoin.balanceOf(address(this));
        uint256 fee = amount > 100 ether ? (amount * 5) / 100 : 5 ether;

        emit RevenueCollected(destination, amount, fee);

        stablecoin.transfer(organisationFactory, fee);
        stablecoin.transfer(destination, amount - fee);
    }
}
