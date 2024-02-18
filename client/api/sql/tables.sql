    CREATE TABLE bookings (
        booking_id NUMERIC(78, 0) NOT NULL,
        hotel CHAR(42) NOT NULL,
        room_id NUMERIC(10, 0) NOT NULL,
        guest CHAR(42) NOT NULL,
        check_in BIGINT NOT NULL,
        check_out BIGINT NOT NULL,
        cancellation_deadline BIGINT NOT NULL,
        price NUMERIC(78, 0) NOT NULL,
        past_booking_id NUMERIC(78, 0) NOT NULL,
        next_booking_id NUMERIC(78, 0) NOT NULL,

        PRIMARY KEY (booking_id, hotel)
    );

    CREATE TABLE rooms (
        hotel CHAR(42) NOT NULL,
        id NUMERIC(78, 0) NOT NULL,
        price NUMERIC(78, 0) NOT NULL,
        image VARCHAR(1000) NOT NULL,
        description VARCHAR(5000) NOT NULL,

        PRIMARY KEY (hotel, id)
    );

    CREATE TABLE hotel_contracts (
        address CHAR(42) PRIMARY KEY,
        latest_block_number  NUMERIC(78, 0) NOT NULL,
        owner VARCHAR(42) NOT NULL
    );

    CREATE TABLE hotels_metadata (
        address CHAR(42) PRIMARY KEY,
        owner VARCHAR(42) NOT NULL,
        title VARCHAR(100) NOT NULL,
        contacts VARCHAR(100) NOT NULL,
        subtitle VARCHAR(100) NOT NULL,
        image VARCHAR(1000) NOT NULL,
        description VARCHAR(5000) NOT NULL,
        city VARCHAR(100) NOT NULL,
        organisation CHAR(42) NOT NULL,
        useful_info VARCHAR(300) NOT NULL,
        location VARCHAR(500) NOT NULL,
        cancellation_delay BIGINT NOT NULL

    );

    CREATE TABLE organisation_contracts (
        address CHAR(42) PRIMARY KEY,
        latest_block_number  NUMERIC(78, 0) NOT NULL,
        owner VARCHAR(42) NOT NULL
    );

    CREATE TABLE organisations_metadata (
        address CHAR(42) PRIMARY KEY,
        owner VARCHAR(42) NOT NULL,
        title VARCHAR(100) NOT NULL,
        contacts VARCHAR(100) NOT NULL,
        subtitle VARCHAR(100) NOT NULL,
        image VARCHAR(1000) NOT NULL,
        description VARCHAR(5000) NOT NULL
    );

    CREATE TABLE organisation_factories (
        address CHAR(42) PRIMARY KEY,
        latest_block_number  NUMERIC(78, 0) NOT NULL,
        owner VARCHAR(42) NOT NULL
    );


