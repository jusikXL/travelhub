import axios from 'axios';

type PastNext = {
  available: boolean;
  pastBookingId: string;
  nextBookingId: string;
};

export default function getPastNext(hotelAddress: `0x${string}`, roomId: string, checkIn: string, checkOut: string) {
  return axios.get<PastNext>(`/api/hotels/${hotelAddress}/${roomId}/past_next`, {
    params: {
      check_in_timestamp: checkIn,
      check_out_timestamp: checkOut,
    },
  });
}
