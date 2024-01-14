'use client';
import { useToast } from '@/components/ui/use-toast';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSupabaseUser } from './supabase-user-provider';
import { getUserSubscriptionStatus } from '../supabase/queries';
import SubscriptionModal from '@/components/global/subscription-modal';
import { ProductWirhPrice } from '../supabase/supabase.types';

type SubscriptionModalContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SubscriptionModalContext = createContext<SubscriptionModalContextType>({
  open: false,
  setOpen: () => {},
});

export const useSubscriptionModal = () => {
  return useContext(SubscriptionModalContext);
};

export const SubscriptionModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SubscriptionModalContext.Provider value={{ open, setOpen }}>
      {children}
      <SubscriptionModal />
    </SubscriptionModalContext.Provider>
  );
};