'use client';

import dynamic from 'next/dynamic';

// Dynamically import with no SSR
const BarModelCreator = dynamic(() => import('@/components/BarModelCreator'), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <BarModelCreator />
    </div>
  );
}
