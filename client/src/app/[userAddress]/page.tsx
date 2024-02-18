import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'TravelHub profile',
  description: 'Your profile page',
};

export default function ProfilePage({ params: { userAddress } }: { params: { userAddress: `0x${string}` } }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 text-center text-2xl font-semibold leading-none tracking-tight">
        <h2>Organisations</h2>
        <h2>Bookings</h2>
        <h2>Hotels</h2>
      </div>
      <div className="grid h-[70vh] w-full grid-cols-3">
        <div className="relative">
          <Link href="#">
            <Image
              className={cn('opacity-30 transition-all hover:scale-105 hover:opacity-100')}
              src="/my-organisations.png"
              alt="My Organisations"
              layout="fill"
              objectFit="cover"
            />
          </Link>
        </div>
        <div className="relative">
          <Link href={`/${userAddress}/bookings`}>
            <Image
              className={cn('opacity-30 transition-all hover:scale-105 hover:opacity-100')}
              src="/my-bookings.png"
              alt="My Bookings"
              layout="fill"
              objectFit="cover"
            />
          </Link>
        </div>
        <div className="relative">
          <Link href="#">
            <Image
              className={cn('opacity-30 transition-all hover:scale-105 hover:opacity-100')}
              src="/my-hotels.png"
              alt=" My Hotels"
              layout="fill"
              objectFit="cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
