'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function CallbackContent() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home/tasks');
  }, [router]);

  return null;
}

export default function Callback() {
  return (
    <Suspense fallback={null}>
      <CallbackContent />
    </Suspense>
  );
}
