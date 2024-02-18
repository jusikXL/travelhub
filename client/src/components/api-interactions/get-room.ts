import axios from 'axios';
import { RoomFull } from '@/lib/types';

export default function getRoom(hotelAddress: `0x${string}`, roomId: string) {
  return axios.get<RoomFull>(`/api/hotels/${hotelAddress}/${roomId}`);
}
