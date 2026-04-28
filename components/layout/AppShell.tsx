'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import QuickCaptureDialog from '../inbox/QuickCaptureDialog';
import { DateProvider, useDate } from '@/hooks/useDate';

const AUTH_ROUTES = ['/login', '/register'];

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { date, goNext, goPrev, goToday } = useDate();
  const [showCapture, setShowCapture] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-0">
        <TopBar
          date={date}
          onPrevDay={goPrev}
          onNextDay={goNext}
          onToday={goToday}
          onQuickCapture={() => setShowCapture(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <QuickCaptureDialog
        open={showCapture}
        onClose={() => setShowCapture(false)}
      />
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <DateProvider>
      <AppShellInner>{children}</AppShellInner>
    </DateProvider>
  );
}
