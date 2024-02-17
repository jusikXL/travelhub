import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const CANCELLATION_DELAY = 0n;
const ROOM_ID = 1n;
const ROOM_PRICE = ethers.parseEther("5"); // 5$
const DAY = 60n * 60n * 24n;

describe("Hotel", function () {
  async function deployHotelFixture() {
    const [owner, user, ...otherAccounts] = await ethers.getSigners();

    const Stablecoin = await ethers.getContractFactory("Stablecoin");
    const stablecoin = await Stablecoin.deploy();

    const Hotel = await ethers.getContractFactory("AHotel");
    const hotel = await Hotel.deploy(
      owner.address,
      await stablecoin.getAddress(),
      CANCELLATION_DELAY
    );

    return { owner, user, otherAccounts, stablecoin, hotel };
  }

  async function addRoomFixture() {
    const { owner, user, otherAccounts, stablecoin, hotel } = await loadFixture(
      deployHotelFixture
    );

    await hotel.addRoom(ROOM_ID, ROOM_PRICE);

    return { owner, user, otherAccounts, stablecoin, hotel };
  }

  async function getPresetBookings() {
    const { hotel } = await loadFixture(deployHotelFixture);
    const initialBookingId = await hotel.hashBooking(ROOM_ID, 0n, 0n);

    const CHECKINDATE1 = BigInt(await time.latest()) + 1000n * DAY;
    const CHECKOUTDATE1 = CHECKINDATE1 + 2n * DAY;
    const bookingId1 = await hotel.hashBooking(
      ROOM_ID,
      CHECKINDATE1,
      CHECKOUTDATE1
    );

    const CHECKINDATE2 = CHECKOUTDATE1 + DAY;
    const CHECKOUTDATE2 = CHECKINDATE2 + 3n * DAY;
    const bookingId2 = await hotel.hashBooking(
      ROOM_ID,
      CHECKINDATE2,
      CHECKOUTDATE2
    );

    const CHECKINDATE3 = CHECKOUTDATE2 + 5n * DAY;
    const CHECKOUTDATE3 = CHECKINDATE3 + DAY;
    const bookingId3 = await hotel.hashBooking(
      ROOM_ID,
      CHECKINDATE3,
      CHECKOUTDATE3
    );

    const BOOKINGS = {
      noroom: {
        roomId: ROOM_ID,
        checkInDate: CHECKINDATE1,
        checkOutDate: CHECKOUTDATE1,
        pastBookingId: initialBookingId,
        nextBookingId: initialBookingId,
      },
      invalidDates: [
        {
          // check in date < now
          roomId: ROOM_ID,
          checkInDate: 123n,
          checkOutDate: CHECKOUTDATE1,
          pastBookingId: initialBookingId,
          nextBookingId: initialBookingId,
        },
        {
          // check out date < check in date
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1,
          checkOutDate: 123n,
          pastBookingId: initialBookingId,
          nextBookingId: initialBookingId,
        },
        {
          // booking duration is not day divisible
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1,
          checkOutDate: CHECKINDATE1 + 5n,
          pastBookingId: initialBookingId,
          nextBookingId: initialBookingId,
        },
      ],
      invalidNeighboringBookings: [
        {
          // past booking does not exist
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1,
          checkOutDate: CHECKOUTDATE1,
          pastBookingId: 0n,
          nextBookingId: initialBookingId,
        },
        {
          // next booking does not exist
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1,
          checkOutDate: CHECKOUTDATE1,
          pastBookingId: initialBookingId,
          nextBookingId: 0n,
        },
        {
          // past booking does not exist
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1,
          checkOutDate: CHECKOUTDATE1,
          pastBookingId: 123n,
          nextBookingId: initialBookingId,
        },
        {
          // next booking does not exist
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1,
          checkOutDate: CHECKOUTDATE1,
          pastBookingId: initialBookingId,
          nextBookingId: 123n,
        },
      ],
      overlappingBookings: [
        // []↓[↓][]
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKINDATE2 + DAY,
          pastBookingId: initialBookingId,
          nextBookingId: bookingId1,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKINDATE2 + DAY,
          pastBookingId: bookingId1,
          nextBookingId: bookingId2,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKINDATE2 + DAY,
          pastBookingId: bookingId2,
          nextBookingId: bookingId3,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKINDATE2 + DAY,
          pastBookingId: bookingId3,
          nextBookingId: initialBookingId,
        },
        // []↓[]↓[]
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: initialBookingId,
          nextBookingId: bookingId1,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: bookingId1,
          nextBookingId: bookingId2,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: bookingId2,
          nextBookingId: bookingId3,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE1,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: bookingId3,
          nextBookingId: initialBookingId,
        },
        // [][↓]↓[]
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: initialBookingId,
          nextBookingId: bookingId1,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: bookingId1,
          nextBookingId: bookingId2,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: bookingId2,
          nextBookingId: bookingId3,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + DAY,
          pastBookingId: bookingId3,
          nextBookingId: initialBookingId,
        },
        // [][↓]↓[]
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + 2n * DAY,
          pastBookingId: initialBookingId,
          nextBookingId: bookingId1,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + 2n * DAY,
          pastBookingId: bookingId1,
          nextBookingId: bookingId2,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + 2n * DAY,
          pastBookingId: bookingId2,
          nextBookingId: bookingId3,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2 + DAY,
          checkOutDate: CHECKOUTDATE2 + 2n * DAY,
          pastBookingId: bookingId3,
          nextBookingId: initialBookingId,
        },
        // [][][↓]↓
        {
          roomId: ROOM_ID,
          checkInDate: CHECKOUTDATE3 - DAY,
          checkOutDate: CHECKOUTDATE3 + DAY,
          pastBookingId: bookingId3,
          nextBookingId: initialBookingId,
        },
        // ↓[↓][][]
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1 - DAY,
          checkOutDate: CHECKINDATE1 + DAY,
          pastBookingId: initialBookingId,
          nextBookingId: bookingId1,
        },
      ],
      valid: [
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE1,
          checkOutDate: CHECKOUTDATE1,
          pastBookingId: initialBookingId,
          nextBookingId: initialBookingId,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE2,
          checkOutDate: CHECKOUTDATE2,
          pastBookingId: bookingId1,
          nextBookingId: initialBookingId,
        },
        {
          roomId: ROOM_ID,
          checkInDate: CHECKINDATE3,
          checkOutDate: CHECKOUTDATE3,
          pastBookingId: bookingId2,
          nextBookingId: initialBookingId,
        },
      ],
    };

    return { BOOKINGS, initialBookingId, bookingId1, bookingId2, bookingId3 };
  }

  async function bookFixture() {
    const { BOOKINGS } = await loadFixture(getPresetBookings);
    const { hotel, user, stablecoin, otherAccounts, owner } = await loadFixture(
      addRoomFixture
    );

    for (const booking of BOOKINGS.valid) {
      const {
        roomId,
        checkInDate,
        checkOutDate,
        pastBookingId,
        nextBookingId,
      } = booking;

      const totalPrice =
        ((checkOutDate - checkInDate) / DAY) * (await hotel.prices(roomId));
      await stablecoin.mint(user.address, totalPrice);
      await stablecoin
        .connect(user)
        .approve(await hotel.getAddress(), totalPrice);

      await hotel
        .connect(user)
        .book(roomId, checkInDate, checkOutDate, pastBookingId, nextBookingId);
    }

    return { hotel, user, stablecoin, otherAccounts, owner };
  }

  describe("Deployment", function () {
    it("should set the organisation, owner and stablecoin", async function () {
      const { hotel, owner, stablecoin } = await loadFixture(
        deployHotelFixture
      );

      expect(await hotel.organisation()).to.equal(owner.address);
      expect(await hotel.owner()).to.equal(owner.address);
      expect(await hotel.stablecoin()).to.equal(await stablecoin.getAddress());
    });
  });

  describe("Cancellation delay", function () {
    describe("Deployment", function () {
      it("should set the right cancellation delay on deployment", async function () {
        const { hotel } = await loadFixture(deployHotelFixture);

        expect(await hotel.cancellationDelay()).to.equal(CANCELLATION_DELAY);
      });
    });

    context("access", function () {
      it("should not allow non-owner to update cancellation delay", async function () {
        const { user, hotel } = await loadFixture(deployHotelFixture);

        await expect(
          hotel.connect(user).updateCancellationDelay(123n)
        ).to.be.reverted;
      });
    });

    context("success", function () {
      it("should allow owner to update metadata", async function () {
        const { hotel } = await loadFixture(deployHotelFixture);

        await expect(hotel.updateCancellationDelay(123n))
          .to.emit(hotel, "CancellationDelayUpdated")
          .withArgs(123n);

        expect(await hotel.cancellationDelay()).to.equal(123n);
      });
    });
  });

  describe("Room", function () {
    describe("Room addition", function () {
      context("access", function () {
        it("should not allow non-owner to add a room", async function () {
          const { hotel, user } = await loadFixture(deployHotelFixture);

          await expect(
            hotel.connect(user).addRoom(ROOM_ID, ROOM_PRICE)
          ).to.be.reverted;
        });
      });

      context("validation", function () {
        it("should not allow to create a room with price less $5", async function () {
          const { hotel } = await loadFixture(deployHotelFixture);

          await expect(hotel.addRoom(ROOM_ID, ethers.parseEther("0")))
            .to.be.revertedWithCustomError(hotel, "InsufficientPrice")
            .withArgs(ethers.parseEther("0"), ethers.parseEther("5"));

          await expect(hotel.addRoom(ROOM_ID, ethers.parseEther("4.9")))
            .to.be.revertedWithCustomError(hotel, "InsufficientPrice")
            .withArgs(ethers.parseEther("4.9"), ethers.parseEther("5"));
        });

        it("should not allow owner to recreate the room", async function () {
          const { hotel } = await loadFixture(addRoomFixture);

          await expect(hotel.addRoom(ROOM_ID, ROOM_PRICE))
            .to.be.revertedWithCustomError(hotel, "RoomAlreadyExists")
            .withArgs(ROOM_ID);
        });
      });

      context("success", function () {
        it("should allow owner to create a room", async function () {
          const { hotel, owner } = await loadFixture(deployHotelFixture);

          const initialBookingId = await hotel.hashBooking(ROOM_ID, 0n, 0n);

          await expect(hotel.addRoom(ROOM_ID, ROOM_PRICE))
            .to.emit(hotel, "RoomCreated")
            .withArgs(ROOM_ID, ROOM_PRICE, initialBookingId);

          expect(await hotel.prices(ROOM_ID)).to.equal(ROOM_PRICE);

          const expectedInitialBooking = [
            ROOM_ID,
            owner.address,
            0n,
            0n,
            0n,
            0n,
            initialBookingId,
            initialBookingId,
            false,
          ];

          const result = await hotel.bookings(initialBookingId);

          expect(expectedInitialBooking).to.deep.equal([...result]);
        });
      });
    });

    describe("Room removal", function () {
      context("access", function () {
        it("should not allow non-owner to remove the room", async function () {
          const { hotel, user } = await loadFixture(addRoomFixture);

          await expect(hotel.connect(user).removeRoom(ROOM_ID)).to.be.reverted;
        });
      });

      context("validation", function () {
        it("should not allow to remove unexisting room", async function () {
          const { hotel } = await loadFixture(addRoomFixture);

          await expect(hotel.removeRoom(123n))
            .to.be.revertedWithCustomError(hotel, "InvalidRoomId")
            .withArgs(123n);
        });
      });

      context("success", function () {
        it("should allow owner to remove the room", async function () {
          const { hotel } = await loadFixture(addRoomFixture);

          const initialBookingId = await hotel.hashBooking(ROOM_ID, 0n, 0n);

          await expect(hotel.removeRoom(ROOM_ID))
            .to.emit(hotel, "RoomRemoved")
            .withArgs(ROOM_ID)
            .to.not.emit(hotel, "BookingCancelled");

          expect(await hotel.prices(ROOM_ID)).to.equal(0n);

          const result = await hotel.bookings(initialBookingId);
          expect(result[0]).to.equal(0n);
        });

        it("should not allow to book the removed room", async function () {
          const { BOOKINGS, bookingId3, initialBookingId } = await loadFixture(
            getPresetBookings
          );
          const { hotel } = await loadFixture(bookFixture);

          const {
            roomId,
            checkInDate,
            checkOutDate,
            pastBookingId,
            nextBookingId,
          } = {
            roomId: ROOM_ID,
            checkInDate: BOOKINGS.valid[2].checkOutDate + DAY,
            checkOutDate: BOOKINGS.valid[2].checkOutDate + 4n * DAY,
            pastBookingId: bookingId3,
            nextBookingId: initialBookingId,
          };

          await hotel.removeRoom(ROOM_ID);

          await expect(
            hotel.book(
              roomId,
              checkInDate,
              checkOutDate,
              pastBookingId,
              nextBookingId
            )
          ).to.be.reverted;
        });
      });
    });

    describe("Room price change", function () {
      context("access", function () {
        it("should not allow to change the price of unexisting room", async function () {
          const { hotel } = await loadFixture(deployHotelFixture);

          await expect(hotel.changeRoomPrice(ROOM_ID, ROOM_PRICE))
            .to.be.revertedWithCustomError(hotel, "InvalidRoomId")
            .withArgs(ROOM_ID);
        });
      });

      context("validation", function () {
        it("should not allow to change to invalid room price", async function () {
          const { hotel } = await loadFixture(addRoomFixture);

          await expect(hotel.changeRoomPrice(ROOM_ID, ROOM_PRICE))
            .to.be.revertedWithCustomError(hotel, "InsufficientPrice")
            .withArgs(ROOM_PRICE, ethers.parseEther("5"));

          await expect(hotel.changeRoomPrice(ROOM_ID, ethers.parseEther("3")))
            .to.be.revertedWithCustomError(hotel, "InsufficientPrice")
            .withArgs(ethers.parseEther("3"), ethers.parseEther("5"));
        });
      });

      context("success", function () {
        it("should allow owner to change the room price", async function () {
          const { hotel } = await loadFixture(addRoomFixture);

          const NEW_PRICE = ethers.parseEther("5.1");

          expect(await hotel.changeRoomPrice(ROOM_ID, NEW_PRICE))
            .to.emit(hotel, "RoomPriceChanged")
            .withArgs(ROOM_ID, NEW_PRICE);

          expect(await hotel.prices(ROOM_ID)).to.equal(NEW_PRICE);
        });
      });
    });
  });

  describe("Booking", function () {
    describe("Booking", function () {
      describe("Book", function () {
        context("validation", function () {
          it("cannot book unexisting room", async function () {
            const { BOOKINGS } = await loadFixture(getPresetBookings);
            const { hotel, user } = await loadFixture(deployHotelFixture);
            const {
              roomId,
              checkInDate,
              checkOutDate,
              pastBookingId,
              nextBookingId,
            } = BOOKINGS.noroom;

            await expect(
              hotel
                .connect(user)
                .book(
                  roomId,
                  checkInDate,
                  checkOutDate,
                  pastBookingId,
                  nextBookingId
                )
            )
              .to.be.revertedWithCustomError(hotel, "InvalidRoomId")
              .withArgs(roomId);
          });

          it("cannot book for invalid dates", async function () {
            const { BOOKINGS } = await loadFixture(getPresetBookings);
            const { hotel, user } = await loadFixture(addRoomFixture);
            for (const booking of BOOKINGS.invalidDates) {
              const {
                roomId,
                checkInDate,
                checkOutDate,
                pastBookingId,
                nextBookingId,
              } = booking;

              await expect(
                hotel
                  .connect(user)
                  .book(
                    roomId,
                    checkInDate,
                    checkOutDate,
                    pastBookingId,
                    nextBookingId
                  )
              )
                .to.be.revertedWithCustomError(hotel, "InvalidDates")
                .withArgs(checkInDate, checkOutDate);
            }
          });

          it("cannot book between invalid neighboring bookings", async function () {
            const { BOOKINGS } = await loadFixture(getPresetBookings);
            const { hotel, user } = await loadFixture(addRoomFixture);
            for (const booking of BOOKINGS.invalidNeighboringBookings) {
              const {
                roomId,
                checkInDate,
                checkOutDate,
                pastBookingId,
                nextBookingId,
              } = booking;

              await expect(
                hotel
                  .connect(user)
                  .book(
                    roomId,
                    checkInDate,
                    checkOutDate,
                    pastBookingId,
                    nextBookingId
                  )
              ).to.be.revertedWithCustomError(hotel, "InvalidBookingId");
            }
          });

          it("cannot book overlapping other bookings", async function () {
            const { BOOKINGS } = await loadFixture(getPresetBookings);
            const { hotel, stablecoin, user } = await loadFixture(bookFixture);
            for (const booking of BOOKINGS.overlappingBookings) {
              const {
                roomId,
                checkInDate,
                checkOutDate,
                pastBookingId,
                nextBookingId,
              } = booking;

              await expect(
                hotel
                  .connect(user)
                  .book(
                    roomId,
                    checkInDate,
                    checkOutDate,
                    pastBookingId,
                    nextBookingId
                  )
              ).to.be.revertedWithCustomError(hotel, "BookingOverlap");
            }
          });
        });

        context("success", function () {
          it("with multiple bookings for a room", async function () {
            const { BOOKINGS } = await loadFixture(getPresetBookings);
            const { hotel, user, stablecoin } = await loadFixture(
              addRoomFixture
            );

            for (const booking of BOOKINGS.valid) {
              const {
                roomId,
                checkInDate,
                checkOutDate,
                pastBookingId,
                nextBookingId,
              } = booking;

              const newBookingId = await hotel.hashBooking(
                roomId,
                checkInDate,
                checkOutDate
              );
              const totalPrice =
                ((checkOutDate - checkInDate) / DAY) *
                (await hotel.prices(roomId));
              await stablecoin.mint(user.address, totalPrice);
              await stablecoin
                .connect(user)
                .approve(await hotel.getAddress(), totalPrice);
              const cancellationDeadline =
                checkInDate - (await hotel.cancellationDelay());

              await expect(
                hotel
                  .connect(user)
                  .book(
                    roomId,
                    checkInDate,
                    checkOutDate,
                    pastBookingId,
                    nextBookingId
                  )
              )
                .to.emit(hotel, "BookingCreated")
                .withArgs(
                  newBookingId,
                  roomId,
                  user.address,
                  checkInDate,
                  checkOutDate,
                  cancellationDeadline,
                  totalPrice,
                  pastBookingId,
                  nextBookingId
                );

              expect(await hotel.bookings(newBookingId)).to.deep.equal([
                roomId,
                user.address,
                checkInDate,
                checkOutDate,
                cancellationDeadline,
                totalPrice,
                pastBookingId,
                nextBookingId,
                false,
              ]);

              expect(
                (await hotel.bookings(pastBookingId)).nextBookingId
              ).to.equal(newBookingId);
              expect(
                (await hotel.bookings(nextBookingId)).pastBookingId
              ).to.equal(newBookingId);
            }
          });
        });
      });

      describe("Cancel booking", function () {
        context("access", function () {
          it("should not allow non-guest or non-owner to cancel booking", async function () {
            const { bookingId1 } = await loadFixture(getPresetBookings);
            const { hotel, otherAccounts, user } = await loadFixture(
              bookFixture
            );

            await expect(
              hotel.connect(otherAccounts[0]).cancelBooking(bookingId1)
            )
              .to.be.revertedWithCustomError(
                hotel,
                "UnauthorizedBookingCancellation"
              )
              .withArgs(otherAccounts[0].address, user.address);
          });
        });

        context("validation", function () {
          it("should not allow to remove non-existing booking", async function () {
            const { hotel } = await loadFixture(bookFixture);

            await expect(hotel.cancelBooking(123n))
              .to.be.revertedWithCustomError(hotel, "InvalidBookingId")
              .withArgs(123n);
          });

          it("should not allow to remove initial booking", async function () {
            const { initialBookingId } = await loadFixture(getPresetBookings);
            const { hotel } = await loadFixture(bookFixture);

            await expect(hotel.cancelBooking(initialBookingId))
              .to.be.revertedWithCustomError(hotel, "InvalidBookingId")
              .withArgs(initialBookingId);
          });
        });

        context("success", function () {
          it("should allow guest or owner to cancel booking", async function () {
            const { bookingId1, bookingId2, bookingId3 } = await loadFixture(
              getPresetBookings
            );
            const { hotel, otherAccounts, user, stablecoin } =
              await loadFixture(bookFixture);

            const price = (await hotel.bookings(bookingId2)).price;

            await expect(hotel.connect(user).cancelBooking(bookingId2))
              .to.emit(hotel, "BookingCancelled")
              .withArgs(bookingId2, user.address)
              .to.emit(stablecoin, "Transfer")
              .withArgs(await hotel.getAddress(), user.address, price);

            expect((await hotel.bookings(bookingId1)).nextBookingId).to.equal(
              bookingId3
            );
            expect((await hotel.bookings(bookingId3)).pastBookingId).to.equal(
              bookingId1
            );

            await expect(hotel.cancelBooking(bookingId1)).to.not.be.reverted;
          });
        });
      });
    });

    describe("Collect revenue", function () {
      context("access", function () {
        it("should not allow non-owner to collect revenue", async function () {
          const { hotel, user } = await loadFixture(bookFixture);

          await expect(
            hotel.connect(user).collectRevenue([123n])
          ).to.be.reverted;
        });
      });

      context("validation", function () {
        it("should not collect revenue if empty array of booking ids was provided", async function () {
          const { hotel } = await loadFixture(bookFixture);

          await expect(hotel.collectRevenue([])).to.be.revertedWithCustomError(
            hotel,
            "NoBookingsToCollect"
          );
        });

        it("should not collect revenue from invalid booking ids", async function () {
          const { initialBookingId } = await loadFixture(getPresetBookings);
          const { hotel } = await loadFixture(bookFixture);

          await expect(hotel.collectRevenue([123n]))
            .to.be.revertedWithCustomError(hotel, "InvalidBookingId")
            .withArgs(123n);

          await expect(hotel.collectRevenue([initialBookingId]))
            .to.be.revertedWithCustomError(hotel, "InvalidBookingId")
            .withArgs(initialBookingId);
        });

        it("should not collect revenue if cancellation deadline hasn't been reached yet", async function () {
          const { bookingId1 } = await loadFixture(getPresetBookings);
          const { hotel } = await loadFixture(bookFixture);

          await expect(
            hotel.collectRevenue([bookingId1])
          ).to.be.revertedWithCustomError(
            hotel,
            "CancellationDeadlineNotReached"
          );
        });

        it("should not collect revenue if it already was collected", async function () {
          const { bookingId1, bookingId2, bookingId3 } = await loadFixture(
            getPresetBookings
          );
          const { hotel } = await loadFixture(bookFixture);

          await time.increaseTo(
            (
              await hotel.bookings(bookingId3)
            ).cancellationDeadline
          );

          await hotel.collectRevenue([bookingId2, bookingId3]);

          await expect(hotel.collectRevenue([bookingId1, bookingId2]))
            .to.be.revertedWithCustomError(hotel, "RevenueAlreadyCollected")
            .withArgs(bookingId2);
        });
      });
    });

    context("success", function () {
      it("should collect revenue otherwise", async function () {
        const { bookingId1, bookingId2, bookingId3 } = await loadFixture(
          getPresetBookings
        );
        const { hotel, stablecoin, owner } = await loadFixture(bookFixture);

        await time.increaseTo(
          (
            await hotel.bookings(bookingId3)
          ).cancellationDeadline
        );

        const revenue =
          (await hotel.bookings(bookingId1)).price +
          (await hotel.bookings(bookingId2)).price +
          (await hotel.bookings(bookingId3)).price;

        await expect(hotel.collectRevenue([bookingId1, bookingId2, bookingId3]))
          .to.emit(hotel, "RevenueCollected")
          .to.emit(stablecoin, "Transfer")
          .withArgs(await hotel.getAddress(), owner.address, revenue);
      });
    });
  });
});
