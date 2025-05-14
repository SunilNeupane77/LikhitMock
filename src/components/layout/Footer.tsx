
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <ClipboardCheck className="h-7 w-7 text-primary" />
              <span className="text-black dark:text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Ace your Nepal driving license test with our comprehensive mock exam platform.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
               <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
               <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
               <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
