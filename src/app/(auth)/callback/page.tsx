'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home/tasks');
  }, [router]);

  return null;
}
