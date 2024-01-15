export const dynamic = 'force-dynamic';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import db from '@/lib/supabase/db'
import { ThemeProvider } from '@/lib/providers/next-theme-provider'
import { DM_Sans } from "next/font/google";
import { twMerge } from 'tailwind-merge'
import AppStateProvider from '@/lib/providers/state-provider'
import { SupabaseUserProvider } from '@/lib/providers/supabase-user-provider'
import { Toaster } from '@/components/ui/toaster'
import { SocketProvider } from '@/lib/providers/socket-provider'

const inter = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Saas application',
  description: 'Next, Typescript, Javascript app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // console.log(db)
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true} className={twMerge('bg-background', inter.className)}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
        >
          <AppStateProvider>
            <SupabaseUserProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
              <Toaster />
            </SupabaseUserProvider>  
          </AppStateProvider>
        </ThemeProvider>  
      </body>
    </html>
  )
}
