'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ open, toggleSidebar }) {
  const pathname = usePathname()

  const menu = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tambah Berita', href: '/tambah-berita' },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md z-50 p-6 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-lg font-bold text-green-800 mb-6">Panel Admin</h2>
        <nav className="space-y-2">
          {menu.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={toggleSidebar}
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

      {/* Overlay */}
      {open && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-30 z-40"
        />
      )}
    </>
  )
}
