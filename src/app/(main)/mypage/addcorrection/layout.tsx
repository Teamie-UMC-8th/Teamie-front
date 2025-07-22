'use client';

import React from 'react';
import CorrectionSidebar from '@/features/correction/components/CorrectionSidebar';
import CorrectionResponsiveHeader from '@/features/correction/components/CorrectionResponsiveHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="hidden max-lg:block">
        <CorrectionResponsiveHeader />
      </div>
      <div className="block max-lg:hidden">
        <CorrectionSidebar />
      </div>
      <div
        className="flex-1
      max-lg: mt-[32px]"
      >
        {children}
      </div>
    </div>
  );
}
