'use client';
import React, { createContext, useContext } from 'react';
import { useAppStore } from '@/store/use-app-store';

type CardGridVariant = 'kidFriendly' | 'normal';

const CardGridVariantContext = createContext<CardGridVariant>('normal');

export const CardGridVariantProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const levelId = useAppStore((state) => state.user?.levelId);
  console.log('User levelId:', levelId);
  const variant: CardGridVariant =
    typeof levelId === 'number' && levelId < 10 ? 'kidFriendly' : 'normal';

  return (
    <CardGridVariantContext.Provider value={variant}>
      {children}
    </CardGridVariantContext.Provider>
  );
};

export const useCardGridVariant = () => useContext(CardGridVariantContext);
