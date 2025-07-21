'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

export default function Sidebar({ open, toggleSidebar }) {
  const pathname = usePathname()

  const menu = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tambah Berita', href: '/tambah-berita' },
  ]

  return (
    <>
      {/* Overlay saat sidebar terbuka (mobile) */}
      {open && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"></div>}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md z-50 p-6
          transform ${open ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300
          md:static md:translate-x-0 md:block
        `}
      >
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-lg font-semibold text-green-800">Panel Admin</h2>
          <button onClick={toggleSidebar} className="text-green-800">
            <X size={24} />
          </button>
        </div>

        <h2 className="hidden md:block text-lg font-bold text-green-800 mb-6">Panel Admin</h2>
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
    </>
  )
}
