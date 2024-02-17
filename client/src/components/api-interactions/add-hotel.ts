import axios from 'axios';
import { HotelFull } from '@/lib/types';

export type AddHotel = Pick<
  HotelFull,
  'address' | 'owner' | 'title' | 'contacts' | 'subtitle' | 'image' | 'description' | 'city' | 'location'
> & { useful_info: string; cancellation_delay: number; organisation: `0x${string}` };

export default function addHotel(organisationAddress: `0x${string}`, hotel: AddHotel) {
  return axios.post(`/api/organisations/${organisationAddress}/add_hotel`, hotel);
}
