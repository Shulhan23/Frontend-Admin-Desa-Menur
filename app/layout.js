// app/layout.js
'use client'

import { usePathname } from 'next/navigation'
import '@/../styles/globals.css'
import AdminLayout from '@/components/admin/adminlayout'

export default function Layout({ children }) {
  const pathname = usePathname()

  // Jika sedang di halaman login, tidak pakai AdminLayout
  const isLoginPage = pathname === '/login'

  return (
    <html lang="id">
      <body>
        {isLoginPage ? children : <AdminLayout>{children}</AdminLayout>}
      </body>
    </html>
  )
}
