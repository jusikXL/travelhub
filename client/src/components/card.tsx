import { BackpackIcon, HomeIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { formatEther } from 'viem';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import truncateEthAddress from '@/lib/truncate';
import { HotelFull, HotelBasic, OrganisationFull, OrganisationBasic, RoomFull, RoomBasic } from '@/lib/types';
import { cn } from '@/lib/utils';

type CardProps =
  | {
      kind: 'hotelFull';
      data: HotelFull;
    }
  | {
      kind: 'hotelBasic';
      data: HotelBasic;
    }
  | {
      kind: 'organisationFull';
      data: OrganisationFull;
    }
  | {
      kind: 'organisationBasic';
      data: OrganisationBasic;
    }
  | {
      kind: 'roomFull';
      data: RoomFull;
    }
  | {
      kind: 'roomBasic';
      data: RoomBasic;
    };

export function CardComponent({ kind, data }: CardProps) {
  return (
    <Card>
      <CardHeader>
        <Image
          src={data.image}
          width={500}
          height={500}
          alt="Hotel or Organisation image"
          className={cn('mb-6 h-96 w-auto object-cover transition-all hover:scale-105')}
        />
        <div className="flex justify-between">
          <CardTitle>
            {kind === 'roomFull' || kind === 'roomBasic' ? `$${formatEther(BigInt(data.price))}` : data.title}
          </CardTitle>
          <CardDescription>
            {kind === 'hotelFull' || kind === 'organisationFull' ? (
              <Link href={`https://explorer.fusespark.io/address/${data.address}`} target="_blank">
                {truncateEthAddress(data.address)}
              </Link>
            ) : (
              <span>
                {kind === 'hotelBasic'
                  ? data.city
                  : kind === 'roomFull' || kind === 'roomBasic'
                    ? data.id.toString()
                    : truncateEthAddress(data.address)}
              </span>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {kind === 'hotelFull' ? (
          <div className="flex h-24 flex-col justify-between">
            <Link href={`/organisations/${data.organisation.address}`}>
              <div className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={data.organisation.image} />
                  <AvatarFallback>ERR</AvatarFallback>
                </Avatar>
                <div className="ml-2">{data.organisation.title}</div>
              </div>
            </Link>
            <div className="flex items-center">
              <HomeIcon />
              <CardDescription className="ml-2">{data.city + ', ' + data.location}</CardDescription>
            </div>
            <div className="flex items-center">
              <BackpackIcon />
              <Link target="_blank" href={`https://explorer.fusespark.io/address/${data.organisation.address}`}>
                <CardDescription className="ml-2">{truncateEthAddress(data.organisation.address)}</CardDescription>
              </Link>
            </div>
          </div>
        ) : kind === 'organisationFull' ? (
          <p>{data.description}</p>
        ) : kind === 'roomFull' ? (
          <div className="flex h-24 flex-col justify-between">
            <Link href={`/hotels/${data.hotel.address}`}>
              <div className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={data.hotel.image} alt="organisation or hotel avatar" />
                  <AvatarFallback>ERR</AvatarFallback>
                </Avatar>
                <div className="ml-2">{data.hotel.title}</div>
              </div>
            </Link>
            <CardDescription>{truncateEthAddress(data.hotel.address)}</CardDescription>
          </div>
        ) : kind === 'roomBasic' ? (
          <p></p>
        ) : (
          <p>{data.subtitle}</p>
        )}
      </CardContent>
      {kind === 'organisationFull' && (
        <CardFooter>
          <CardDescription>{data.contacts}</CardDescription>
        </CardFooter>
      )}
    </Card>
  );
}
