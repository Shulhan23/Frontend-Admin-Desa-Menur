'use client'

import { Menu } from 'lucide-react'

export default function Header({ onLogout, toggleSidebar }) {
  return (
    <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-green-700">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-green-700">Desa Menur - Admin</h1>
      </div>
      <button
        onClick={onLogout}
        className="text-sm text-red-600 hover:text-red-800 hover:underline transition"
      >
        Logout
      </button>
    </header>
  )
}
