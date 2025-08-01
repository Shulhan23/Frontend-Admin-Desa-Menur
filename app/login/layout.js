// app/(admin)/admin/login/layout.js
import '@/../styles/globals.css'

export const metadata = {
  title: 'Login Admin',
}

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
