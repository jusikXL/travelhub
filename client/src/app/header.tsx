'use client';

import { GitHubLogoIcon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';
import { useAccount } from 'wagmi';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '../components/ui/button';

export default function Header() {
  const { address } = useAccount();
  const isMounted = useMounted();

  return (
    <div className="relative z-50 flex items-center justify-between py-8">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-3xl font-bold">
          TravelHub
        </Link>
        <Button className="w-9 px-0" variant="outline" asChild>
          <Link href="#" target="_blank" rel="noreferrer">
            <GitHubLogoIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        {address && isMounted && (
          <Button className="w-9 px-0" variant="outline" asChild>
            <Link href={`/${address}`}>
              <PersonIcon className="h-5 w-5" />
              <span className="sr-only">Your Profile</span>
            </Link>
          </Button>
        )}
        <w3m-button />
      </div>
    </div>
  );
}
