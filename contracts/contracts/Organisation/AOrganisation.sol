// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Organisation} from "./Organisation.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AOrganisation is Organisation {
    constructor(
        address initialOwner,
        IERC20 stablecoin
    ) Organisation(initialOwner, stablecoin) {}
}
