import type { ReactNode } from 'react';

// This layout can be used for pages that share a common structure,
// like having a sidebar or specific padding.
// For now, it will just render children.

export default function MainContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex-1 w-full">
      {children}
    </div>
  );
}
