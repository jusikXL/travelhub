import Background from '@/components/bg/background';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Landing() {
  return (
    <>
      <div className="flex flex-col items-center">
        <Background />
        <div className="z-30 select-none px-28">
          <div className="my-36 flex flex-col items-center justify-center px-48">
            <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              An innovation in the world of short-term renting
            </h1>
            <p className="mb-6 text-center text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-36">
              Here at HabiHub we focus on markets where technology, innovation, and capital can unlock long-term value
              and drive economic growth.
            </p>
            <Button>Learn more</Button>

          </div>
        </div>
      </div >
    </>
  );
}
