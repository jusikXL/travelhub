import axios from 'axios';
import { OrganisationBasic } from '@/lib/types';

export default function getUserOrganisations(userAddress: `0x${string}`) {
  return axios.get<OrganisationBasic[]>(`/api/organisations/user_organisations/${userAddress}`);
}
