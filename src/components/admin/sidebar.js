'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const menu = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tambah Berita', href: '/tambah-berita' },
  ]

  const toggleSidebar = () => setOpen(!open)

  return (
    <>
      {/* Tombol Toggle untuk Mobile */}
      <div className="md:hidden p-4 flex justify-between items-center bg-green-50 border-b">
        <h2 className="text-lg font-semibold text-green-800">Panel Admin</h2>
        <button onClick={toggleSidebar} className="text-green-800">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          open ? 'block' : 'hidden'
        } md:block fixed md:static top-0 left-0 h-full w-64 bg-white border-r shadow-md z-50 p-6`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={toggleSidebar} className="text-green-800">
            <X size={24} />
          </button>
        </div>
        <h2 className="text-lg font-bold text-green-800 mb-6 hidden md:block">Panel Admin</h2>
        <nav className="space-y-2">
          {menu.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)} // tutup sidebar setelah klik
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

      {/* Overlay ketika sidebar terbuka di mobile */}
      {open && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"></div>}
    </>
  )
}
