'use client'

import Sidebar from './sidebar'
import Header from './header'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleLogout = async () => {
    await fetch('/laravel-api/sanctum/csrf-cookie', {
      credentials: 'include',
    })

    const res = await fetch('/laravel-api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
        )
      }
    })

    if (res.ok) {
      router.replace('/login')
    } else {
      console.error('Logout gagal')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1">
        <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
