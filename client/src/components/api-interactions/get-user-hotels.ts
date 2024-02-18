import axios from 'axios';
import { HotelBasic } from '@/lib/types';

export default function getUserHotels(userAddress: `0x${string}`) {
  return axios.get<HotelBasic[]>(`/api/hotels/user_hotels/${userAddress}`);
}
