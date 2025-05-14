'use client';

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useRouter, usePathname } from 'next/navigation';

const MobileBackButtonHandler = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
      const listener = CapacitorApp.addListener('backButton', (event) => {
        if (event.canGoBack && window.history.length > 1) {
          // Check if there's actual browser history to go back to
          // This check might be redundant if event.canGoBack is reliable enough
          // but extra safety doesn't hurt.
          window.history.back();
        } else {
          // If not on the home page, navigate to home
          if (pathname !== '/') {
            router.replace('/');
          } else {
            // If on the home page, then exit the app
             // Optionally, show a confirmation dialog here
            CapacitorApp.exitApp();
          }
        }
      });

      return () => {
        listener.remove();
      };
    }
  }, [router, pathname]); // Re-run if router or pathname changes, though pathname change might not be necessary if logic remains simple

  return null; // This component does not render anything
};

export default MobileBackButtonHandler;
