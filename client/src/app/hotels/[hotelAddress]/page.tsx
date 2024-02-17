import HotelPage from './hotel';

export default function Hotel({ params: { hotelAddress } }: { params: { hotelAddress: `0x${string}` } }) {
  return <HotelPage hotelAddress={hotelAddress} />;
}
