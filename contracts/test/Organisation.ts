import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Organisation", function () {
  async function deployHotelFixture() {
    const [owner, hotelOwner, ...otherAccounts] = await ethers.getSigners();

    const Stablecoin = await ethers.getContractFactory("Stablecoin");
    const stablecoin = await Stablecoin.deploy();

    const Organisation = await ethers.getContractFactory("AOrganisation");
    const organisation = await Organisation.deploy(
      owner.address,
      await stablecoin.getAddress()
    );

    return { owner, hotelOwner, otherAccounts, stablecoin, organisation };
  }

  describe("Deployment", function () {
    it("should set the organisation factory and stablecoin", async function () {
      const { organisation, owner, stablecoin } = await loadFixture(
        deployHotelFixture
      );

      expect(await organisation.stablecoin()).to.equal(
        await stablecoin.getAddress()
      );
      expect(await organisation.organisationFactory()).to.equal(owner.address);
      expect(await organisation.owner()).to.equal(owner.address);
    });
  });

  describe("Hotel", function () {
    it("should create a hotel", async function () {
      const { organisation, hotelOwner } = await loadFixture(
        deployHotelFixture
      );

      await expect(organisation.createHotel(hotelOwner.address)).to.emit(
        organisation,
        "HotelCreated"
      );
    });
  });

  describe("Revenue", function () {
    it("should collect revenue less fee", async function () {
      const { organisation, stablecoin, otherAccounts } = await loadFixture(
        deployHotelFixture
      );

      stablecoin.mint(
        await organisation.getAddress(),
        ethers.parseEther("100")
      );
      const destination = otherAccounts[0].address;

      await expect(organisation.collectRevenue(destination))
        .to.emit(organisation, "RevenueCollected")
        .withArgs(destination, ethers.parseEther("100"), ethers.parseEther("5"))
        .to.emit(stablecoin, "Transfer")
        .withArgs(
          organisation.getAddress(),
          destination,
          ethers.parseEther("95")
        )
        .to.emit(stablecoin, "Transfer")
        .withArgs(
          organisation.getAddress(),
          await organisation.organisationFactory(),
          ethers.parseEther("5")
        );
    });
  });
});
