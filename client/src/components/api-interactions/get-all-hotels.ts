import axios from 'axios';
import { HotelBasic } from '@/lib/types';

export default function getAllHotels() {
  return axios.get<HotelBasic[]>('/api/hotels');
}
