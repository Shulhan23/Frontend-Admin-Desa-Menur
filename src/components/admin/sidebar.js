// src/components/admin/Sidebar.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menu = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tambah Berita', href: '/tambah-berita' },
  ]

  return (
    <aside className="w-64 min-h-screen bg-green-50 border-r p-6 hidden md:block">
      <h2 className="text-lg font-semibold text-green-800 mb-6">Panel Admin</h2>
      <nav className="space-y-2">
        {menu.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`block px-4 py-2 rounded text-sm font-medium ${
              pathname === href
                ? 'bg-green-600 text-white'
                : 'text-green-800 hover:bg-green-100'
            } transition`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
