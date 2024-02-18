import axios from 'axios';
import { Booking } from '@/lib/types';

export default function getUserBookings(userAddress: `0x${string}`) {
  return axios.get<Booking[]>(`/api/bookings/user/${userAddress}`);
}
