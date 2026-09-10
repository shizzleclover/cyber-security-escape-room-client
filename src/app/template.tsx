'use client';

/**
 * @fileoverview template.tsx
 * @module app/template.tsx
 * 
 * React Component/Page for the CyberEscape platform.
 * This file handles logic specific to its directory domain.
 */


import PageTransition from '@/components/layout/PageTransition';

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
