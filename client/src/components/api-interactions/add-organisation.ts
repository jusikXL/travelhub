import axios from 'axios';
import { OrganisationFull } from '@/lib/types';

export type AddOrganisation = Pick<
  OrganisationFull,
  'address' | 'owner' | 'title' | 'subtitle' | 'contacts' | 'image' | 'description'
>;

export default function addOrganisation(organisation: AddOrganisation) {
  return axios.post('/api/organisations/add_organisation', organisation);
}
