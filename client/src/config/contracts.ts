//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hotel
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const hotelAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'providedCheckInDate', internalType: 'uint128', type: 'uint128' },
      {
        name: 'providedCheckOutDate',
        internalType: 'uint128',
        type: 'uint128',
      },
      { name: 'pastCheckOutDate', internalType: 'uint128', type: 'uint128' },
      { name: 'nextCheckInDate', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'BookingOverlap',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bookingId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'cancellationDeadline',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'CancellationDeadlineNotReached',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bookingId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'cancellationDeadline',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'CancellationDeadlineReached',
  },
  {
    type: 'error',
    inputs: [
      { name: 'providedPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'minPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientPrice',
  },
  {
    type: 'error',
    inputs: [{ name: 'bookingId', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidBookingId',
  },
  {
    type: 'error',
    inputs: [
      { name: 'checkInDate', internalType: 'uint128', type: 'uint128' },
      { name: 'checkOutDate', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'InvalidDates',
  },
  {
    type: 'error',
    inputs: [{ name: 'roomId', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidRoomId',
  },
  { type: 'error', inputs: [], name: 'NoBookingsToCollect' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'bookingId', internalType: 'uint256', type: 'uint256' }],
    name: 'RevenueAlreadyCollected',
  },
  {
    type: 'error',
    inputs: [{ name: 'roomId', internalType: 'uint256', type: 'uint256' }],
    name: 'RoomAlreadyExists',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'guest', internalType: 'address', type: 'address' },
    ],
    name: 'UnauthorizedBookingCancellation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'bookingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BookingCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'bookingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'roomId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'guest',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'checkInDate',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'checkOutDate',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'cancellationDeadline',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pastBookingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'nextBookingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BookingCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'CancellationDelayUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'bookingIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: true,
      },
    ],
    name: 'RevenueCollected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'roomId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'initialBookingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RoomCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'roomId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'newPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RoomPriceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'roomId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RoomRemoved',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roomId', internalType: 'uint256', type: 'uint256' },
      { name: 'price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addRoom',
    outputs: [
      { name: 'initialBookingId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roomId', internalType: 'uint256', type: 'uint256' },
      { name: 'checkInDate', internalType: 'uint128', type: 'uint128' },
      { name: 'checkOutDate', internalType: 'uint128', type: 'uint128' },
      { name: 'pastBookingId', internalType: 'uint256', type: 'uint256' },
      { name: 'nextBookingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'book',
    outputs: [
      { name: 'newBookingId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'bookingId', internalType: 'uint256', type: 'uint256' }],
    name: 'bookings',
    outputs: [
      { name: 'roomId', internalType: 'uint256', type: 'uint256' },
      { name: 'guest', internalType: 'address', type: 'address' },
      { name: 'checkInDate', internalType: 'uint128', type: 'uint128' },
      { name: 'checkOutDate', internalType: 'uint128', type: 'uint128' },
      {
        name: 'cancellationDeadline',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'price', internalType: 'uint256', type: 'uint256' },
      { name: 'pastBookingId', internalType: 'uint256', type: 'uint256' },
      { name: 'nextBookingId', internalType: 'uint256', type: 'uint256' },
      { name: 'revenueCollected', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'bookingId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelBooking',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancellationDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roomId', internalType: 'uint256', type: 'uint256' },
      { name: 'newPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'changeRoomPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'bookingIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'collectRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roomId', internalType: 'uint256', type: 'uint256' },
      { name: 'checkInDate', internalType: 'uint128', type: 'uint128' },
      { name: 'checkOutDate', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'hashBooking',
    outputs: [{ name: 'bookingId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'organisation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roomId', internalType: 'uint256', type: 'uint256' }],
    name: 'prices',
    outputs: [{ name: 'price', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roomId', internalType: 'uint256', type: 'uint256' }],
    name: 'removeRoom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stablecoin',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newDelay', internalType: 'uint256', type: 'uint256' }],
    name: 'updateCancellationDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Organisation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const organisationAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'hotelAddress', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidHotel',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hotelAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'HotelCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hotelAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'HotelRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'destination',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'RevenueCollected',
  },
  {
    type: 'function',
    inputs: [{ name: 'destination', internalType: 'address', type: 'address' }],
    name: 'collectRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'hotelOwner', internalType: 'address', type: 'address' }],
    name: 'createHotel',
    outputs: [
      { name: 'hotelAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'hotels',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'organisationFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hotelAddress', internalType: 'address', type: 'address' },
    ],
    name: 'removeHotel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stablecoin',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OrganisationFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const organisationFactoryAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'organisationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidOrganisation',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'destination',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'FeesCollected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'organisationAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OrganisationCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'organisationAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OrganisationRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [{ name: 'destination', internalType: 'address', type: 'address' }],
    name: 'collectFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'organisationOwner', internalType: 'address', type: 'address' },
    ],
    name: 'createOrganisation',
    outputs: [
      { name: 'organisationAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'organisations',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'organisationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'removeOrganisation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stablecoin',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

export const organisationFactoryAddress =
  '0x042c5bF7C2174941C550D93bd2F388f453AF07B2' as const

export const organisationFactoryConfig = {
  address: organisationFactoryAddress,
  abi: organisationFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Stablecoin
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stablecoinAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

export const stablecoinAddress =
  '0x518200E9F53BdEB9343170E960332AB5F48b0cFA' as const

export const stablecoinConfig = {
  address: stablecoinAddress,
  abi: stablecoinAbi,
} as const
