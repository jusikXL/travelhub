import axios from 'axios';
import { OrganisationBasic } from '@/lib/types';

export default function getAllOrganisations() {
  return axios.get<OrganisationBasic[]>('/api/organisations');
}
