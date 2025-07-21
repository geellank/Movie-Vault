'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex justify-center mt-16">
      <Image
        src="/spinner.svg"
        alt="Loading..."
        width={208} // setara dengan className='h-52'
        height={208}
        className="animate-spin"
        priority
      />
    </div>
  );
}