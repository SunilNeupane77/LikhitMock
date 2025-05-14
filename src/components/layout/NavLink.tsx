'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';

interface NavLinkProps extends NavItem {
  onClick?: () => void; // For mobile menu close
}

export function NavLink({ href, label, icon: Icon, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href === "/" && pathname.startsWith("/?")); // Adjusted for potential query params on home

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-primary/10 hover:text-primary",
        isActive ? "text-primary bg-primary/5" : "text-foreground/70 hover:text-foreground",
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
}
