import type { Metadata } from 'next';
import HomeComponent from './home';

export const metadata: Metadata = {
  title: 'TravelHub',
  description: 'A decentralized online travel agency.',
};

export default function Home() {
  return <HomeComponent />;
}
