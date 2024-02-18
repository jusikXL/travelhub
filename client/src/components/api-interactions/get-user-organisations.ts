import axios from 'axios';
import { OrganisationBasic } from '@/lib/types';

export default function getUserOrganisations(userAddress: `0x${string}`) {
  return axios.get<OrganisationBasic[]>(`/api/hotels/user_organisations/${userAddress}`);
}
