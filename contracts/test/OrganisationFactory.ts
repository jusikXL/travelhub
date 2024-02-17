import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("OrganisationFactory", function () {
  async function deployHotelFixture() {
    const [owner, organisationOwner, ...otherAccounts] =
      await ethers.getSigners();

    const Stablecoin = await ethers.getContractFactory("Stablecoin");
    const stablecoin = await Stablecoin.deploy();


    const OrganisationFactory = await ethers.getContractFactory(
      "AOrganisationFactory"
    );
    const organisationFactory = await OrganisationFactory.deploy(
      owner.address,
      await stablecoin.getAddress()
    );

    return {
      owner,
      organisationOwner,
      otherAccounts,
      stablecoin,
      organisationFactory,
    };
  }

  describe("Deployment", function () {
    it("should set the owner and stablecoin", async function () {
      const { organisationFactory, owner, stablecoin } = await loadFixture(
        deployHotelFixture
      );

      expect(await organisationFactory.stablecoin()).to.equal(
        await stablecoin.getAddress()
      );
      expect(await organisationFactory.owner()).to.equal(owner.address);
    });
  });

  describe("Organisation", function () {
    it("should create an organisationFactory", async function () {
      const { organisationFactory, organisationOwner } = await loadFixture(
        deployHotelFixture
      );

      await expect(
        organisationFactory.createOrganisation(organisationOwner.address)
      ).to.emit(organisationFactory, "OrganisationCreated");
    });

    it("should collect fees", async function () {
      const { organisationFactory, stablecoin, otherAccounts } =
        await loadFixture(deployHotelFixture);

      stablecoin.mint(
        await organisationFactory.getAddress(),
        ethers.parseEther("100")
      );
      const destination = otherAccounts[0].address;

      await expect(organisationFactory.collectFees(destination))
        .to.emit(organisationFactory, "FeesCollected")
        .withArgs(destination, ethers.parseEther("100"))
        .to.emit(stablecoin, "Transfer")
        .withArgs(
          organisationFactory.getAddress(),
          destination,
          ethers.parseEther("100")
        );
    });
  });
});
