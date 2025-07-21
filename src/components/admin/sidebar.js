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
    <aside className="w-full md:w-64 bg-green-50 border-b md:border-b-0 md:border-r p-4">
      <h2 className="text-base font-semibold text-green-800 mb-4">Panel Admin</h2>
      <nav className="flex flex-col space-y-2">
        {menu.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`px-2 py-1 rounded text-sm font-medium ${
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
