'use client';

import React from 'react';
import CorrectionSidebar from '@/features/correction/components/CorrectionSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <CorrectionSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
