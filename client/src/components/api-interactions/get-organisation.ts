import axios from 'axios';
import { OrganisationFull } from '@/lib/types';

export default function getOrganisation(organisationAddress: `0x${string}`) {
  return axios.get<OrganisationFull>(`/api/organisations/${organisationAddress}`);
}
