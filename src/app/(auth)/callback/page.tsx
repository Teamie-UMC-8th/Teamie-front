'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get('next');
    router.replace(next || '/home/tasks');
  }, [router, searchParams]);

  return null;
}

export default function Callback() {
  return (
    <Suspense fallback={null}>
      <CallbackContent />
    </Suspense>
  );
}
