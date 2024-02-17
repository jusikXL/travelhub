// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Hotel} from "./Hotel.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AHotel is Hotel {
    constructor(
        address initialOwner,
        IERC20 stablecoin,
        uint256 cancellationDelay
    ) Hotel(initialOwner, stablecoin, cancellationDelay) {}
}
