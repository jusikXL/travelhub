// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {AOrganisation} from "../Organisation/AOrganisation.sol";
import {IOrganisationFactory} from "./IOrganisationFactory.sol";

abstract contract OrganisationFactory is IOrganisationFactory, Ownable {
    IERC20 public immutable stablecoin;

    mapping(address => bool) public organisations;

    constructor(
        address _initialOwner,
        IERC20 _stablecoin
    ) Ownable(_initialOwner) {
        stablecoin = IERC20(_stablecoin);
    }

    function createOrganisation(
        address organisationOwner
    ) public virtual override returns (address organisationAddress) {
        AOrganisation newOrganisation = new AOrganisation(
            organisationOwner,
            stablecoin
        );
        organisationAddress = address(newOrganisation);

        organisations[organisationAddress] = true;
        emit OrganisationCreated(organisationAddress);
    }

    function removeOrganisation(
        address organisationAddress
    ) public virtual override onlyOwner {
        if (organisations[organisationAddress] == false) {
            revert InvalidOrganisation(organisationAddress);
        }

        organisations[organisationAddress] = false;

        emit OrganisationRemoved(organisationAddress);
    }

    function collectFees(
        address destination
    ) public virtual override onlyOwner {
        uint256 amount = stablecoin.balanceOf(address(this));

        emit FeesCollected(destination, amount);

        stablecoin.transfer(destination, amount);
    }
}