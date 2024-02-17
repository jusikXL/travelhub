import axios from 'axios';

export type AddRoom = {
  hotel: `0x${string}`;
  description: string;
  image: string;
  price: string;
  id: string;
};

export default function addRoom(hotelAddress: `0x${string}`, room: AddRoom) {
  return axios.post(`/api/hotels/${hotelAddress}/add_room`, room);
}
