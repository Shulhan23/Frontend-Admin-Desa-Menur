// src/components/admin/Sidebar.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const menu = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tambah Berita', href: '/tambah-berita' },
  ]

  return (
    <>
      {/* Tombol toggle sidebar */}
      <button
        className="md:hidden p-4 text-green-800 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-green-50 border-r p-6 z-40 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:block`}
      >
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
              onClick={() => setOpen(false)} // Tutup sidebar setelah klik link
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay hitam saat sidebar dibuka (di mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  )
}
