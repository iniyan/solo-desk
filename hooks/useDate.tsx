'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { todayStr, getNextDay, getPrevDay } from '@/lib/dates';

interface DateContextType {
  date: string;
  setDate: (date: string) => void;
  goToday: () => void;
  goNext: () => void;
  goPrev: () => void;
}

const DateContext = createContext<DateContextType | null>(null);

export function DateProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState(todayStr());

  const goToday = useCallback(() => setDate(todayStr()), []);
  const goNext = useCallback(() => setDate(d => getNextDay(d)), []);
  const goPrev = useCallback(() => setDate(d => getPrevDay(d)), []);

  return (
    <DateContext.Provider value={{ date, setDate, goToday, goNext, goPrev }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error('useDate must be used within DateProvider');
  return ctx;
}
