// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOrganisationFactory {
    event OrganisationCreated(address indexed organisationAddress);
    event FeesCollected(address indexed destination, uint256 indexed amount);
    event OrganisationRemoved(address indexed organisationAddress);

    error InvalidOrganisation(address organisationAddress);

    function createOrganisation(
        address organisationOwner
    ) external returns (address organisationAddress);

    function removeOrganisation(address organisationAddress) external;

    function collectFees(address destination) external;
}
