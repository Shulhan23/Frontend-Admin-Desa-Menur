'use client'

import { useState } from 'react'
import Sidebar from './sidebar'
import Header from './header'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/laravel-api/sanctum/csrf-cookie', {
      credentials: 'include',
    })

    const res = await fetch('/laravel-api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
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

  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1">
        <Header onLogout={handleLogout} toggleSidebar={toggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
