
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { ClipboardCheck, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { NavLink } from './NavLink';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary" aria-label={`${SITE_NAME} homepage`}>
          <ClipboardCheck className="h-7 w-7 text-primary" />
          <span className="text-black dark:text-white">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => ( 
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                   <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    <ClipboardCheck className="h-6 w-6" />
                    <span>{SITE_NAME}</span>
                  </Link>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X className="h-6 w-6" />
                      </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-3">
                  {NAV_LINKS.map((link) => (
                    <NavLink key={link.href} {...link} onClick={() => setIsMobileMenuOpen(false)} />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
