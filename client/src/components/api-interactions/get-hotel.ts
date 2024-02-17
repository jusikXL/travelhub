import axios from 'axios';
import { HotelFull } from '@/lib/types';

export default function getHotel(hotelAddress: `0x${string}`) {
  return axios.get<HotelFull>(`/api/hotels/${hotelAddress}`);
}
