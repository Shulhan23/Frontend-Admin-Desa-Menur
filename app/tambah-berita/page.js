'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DOMPurify from 'dompurify'
import dynamic from 'next/dynamic'

const TiptapEditor = dynamic(() => import('../../src/components/TipTapEditor'), { ssr: false })

export default function TambahBeritaPage() {
  const router = useRouter()
  const [judul, setJudul] = useState('')
  const [konten, setKonten] = useState([{ tipe: 'teks', konten: '' }])
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/laravel-api/api/v1/check-auth', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) router.replace('/login')
      } catch {
        router.replace('/login')
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  const handleKontenChange = (index, field, value) => {
    const newKonten = [...konten]
    newKonten[index][field] = value
    setKonten(newKonten)
  }

  const handleAddKonten = () => {
    setKonten([...konten, { tipe: 'teks', konten: '' }])
  }

  const handleRemoveKonten = (index) => {
    if (konten.length === 1) return
    const newKonten = [...konten]
    newKonten.splice(index, 1)
    setKonten(newKonten)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!judul.trim()) {
      alert('Judul tidak boleh kosong')
      return
    }

    for (let i = 0; i < konten.length; i++) {
      const item = konten[i]
      if (item.tipe === 'teks' && !item.konten.trim()) {
        alert(`Konten teks #${i + 1} tidak boleh kosong`)
        return
      }
      if (item.tipe === 'gambar' && item.konten instanceof File) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(item.konten.type)) {
          alert(`Gambar #${i + 1} harus JPG, PNG, atau WebP`)
          return
        }
        if (item.konten.size > 2 * 1024 * 1024) {
          alert(`Ukuran gambar #${i + 1} maksimal 2MB`)
          return
        }
      }
    }

    const sanitizedKonten = konten.map((item) => ({
      ...item,
      konten: item.tipe === 'teks' ? DOMPurify.sanitize(item.konten) : item.konten,
    }))

    const formData = new FormData()
    formData.append('judul', judul)

    sanitizedKonten.forEach((item, i) => {
      formData.append(`konten[${i}][tipe]`, item.tipe)
      formData.append(`konten[${i}][konten]`, item.konten)
    })

    setLoading(true)
    try {
      await fetch('/laravel-api/sanctum/csrf-cookie', { credentials: 'include' })
      const token = decodeURIComponent(
        document.cookie.split('; ').find(c => c.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
      )
      const res = await fetch('/laravel-api/api/v1/berita', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': token,
        },
        credentials: 'include',
        body: formData,
      })

      if (res.ok) {
        setJudul('')
        setKonten([{ tipe: 'teks', konten: '' }])
        router.push('/')
      } else {
        const err = await res.json()
        alert(err.message || 'Gagal menambah berita.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) return <p className="p-6">Memuat...</p>

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Tambah Berita Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Judul</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>

        {konten.map((item, index) => (
          <div key={index} className="border p-3 rounded space-y-2 bg-white">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">Konten #{index + 1}</label>
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => handleRemoveKonten(index)}
                disabled={konten.length === 1}
              >
                Hapus
              </button>
            </div>
            <select
              value={item.tipe}
              onChange={(e) => handleKontenChange(index, 'tipe', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="teks">Teks</option>
              <option value="gambar">Gambar</option>
            </select>
            {item.tipe === 'teks' ? (
              <TiptapEditor
                value={item.konten}
                onChange={(value) => handleKontenChange(index, 'konten', value)}
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => handleKontenChange(index, 'konten', e.target.files[0])}
                />
                {item.konten instanceof File && (
                  <img
                    src={URL.createObjectURL(item.konten)}
                    alt="Preview"
                    className="mt-2 w-32 h-auto border rounded"
                  />
                )}
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddKonten}
          className="text-sm text-blue-600"
        >
          + Tambah Konten
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Berita'}
        </button>
      </form>
    </div>
  )
}
