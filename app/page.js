'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { sanitize } from '../utils/sanitizeHtml'

const TiptapEditor = dynamic(() => import('../src/components/TipTapEditor'), { ssr: false })
  
export default function AdminDashboard() {
  const router = useRouter()
  const [berita, setBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)
  const [tempKonten, setTempKonten] = useState([])
  const [hapusKontenId, setHapusKontenId] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = await fetch('/laravel-api/api/v1/check-auth', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })

        if (!auth.ok) return router.replace('/login')

        const res = await fetch('/laravel-api/api/v1/berita', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })

        if (!res.ok) throw new Error('Gagal ambil data berita')

        const data = await res.json()
        setBerita(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus berita ini?')) return

    const csrfToken = getCookie('XSRF-TOKEN')

    const res = await fetch(`/laravel-api/api/v1/berita/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-XSRF-TOKEN': csrfToken,
      },
    })

    if (res.ok) {
      setBerita((prev) => prev.filter((b) => b.id !== id))
    } else {
      console.error('Gagal hapus berita:', res.status)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!modalData || !modalData.id) return

    const form = e.target
    const formData = new FormData()
    formData.append('judul', form.judul.value)

    // Tambah konten yang masih ada
    if (Array.isArray(tempKonten)) {
      tempKonten.forEach((item, index) => {
        formData.append(`konten[${index}][tipe]`, item.tipe)
        if (item.id) {
          formData.append(`konten[${index}][id]`, item.id)
        }

        if (item.tipe === 'teks') {
          formData.append(`konten[${index}][konten]`, item.konten)
        } else if (item.tipe === 'gambar' && item.file) {
          formData.append(`konten[${index}][konten]`, item.file)
        } else if (item.tipe === 'gambar' && item.konten) {
          formData.append(`konten[${index}][konten]`, item.konten)
        }
      })
    }

    // Tambahkan konten yang dihapus
    hapusKontenId.forEach((id, i) => {
      formData.append(`hapus_konten[${i}]`, id)
    })

    const csrfToken = getCookie('XSRF-TOKEN')

    try {
      const response = await fetch(`/laravel-api/api/v1/berita/${modalData.id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-HTTP-Method-Override': 'PUT',
          'X-XSRF-TOKEN': csrfToken || '',
        },
        body: formData,
        credentials: 'include',
      })

      let data
      try {
        data = await response.json()
      } catch (_) {
        const text = await response.text()
        console.error('Respon bukan JSON:', text)
        alert('Respon dari server tidak sesuai format JSON.')
        return
      }
      if (response.ok) {
        console.log('Berita berhasil diperbarui:', data)

        const updatedRes = await fetch(`/laravel-api/api/v1/berita-by-id/${modalData.id}`, {
          credentials: 'include',
          headers: {  
            Accept: 'application/json',
          },
        })

        if (!updatedRes.ok) throw new Error('Gagal ambil ulang data berita')

        const updatedData = await updatedRes.json()

        setBerita((prev) =>
          prev.map((b) => (b.id === updatedData.id ? updatedData : b))
        )

        // Reset modal state
        setModalData(null)
        setTempKonten([])
        setHapusKontenId([])
      } else {
        console.error('Gagal memperbarui berita:', data)
        alert('Gagal memperbarui berita. Silakan cek data.')
      }
    } catch (error) {
      console.error('Kesalahan saat memperbarui berita:', error)
      alert('Terjadi kesalahan saat mengirim data.')
    }
  }

    const handleKontenChange = (index, field, value) => {
      setTempKonten((prev) => {
        const updated = [...prev]
        updated[index][field] = value
        return updated
      })
    }

    const handleFileChange = (index, file) => {
      setTempKonten((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          file,
        }
        return updated
      })
    }

  if (loading) return <p className="p-6 text-gray-600">Memuat...</p>

 return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Dashboard Berita</h1>

      {berita.length === 0 ? (
        <p className="text-gray-600">Belum ada berita.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {berita.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg border border-gray-200 p-4 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                <h2 className="font-semibold text-lg text-green-700 mb-2">{item.judul}</h2>
                <div className="mt-1 space-y-2 max-h-40 overflow-y-auto text-sm text-gray-800 prose">
                  {Array.isArray(item.konten) &&
                    item.konten.map((k, i) =>
                      k.tipe === 'teks' ? (
                        <div
                          key={i}
                          dangerouslySetInnerHTML={{ __html: sanitize(k.konten) }}
                        />
                      ) : (
                      <img
                        key={i}
                        src={`${process.env.NEXT_PUBLIC_LARAVEL_URL}/${k.konten}?t=${Date.now()}`}
                        className="rounded w-full object-cover max-h-32"
                        alt=""
                      />
                      )
                    )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                  setModalData({ ...item })
                  setTempKonten(JSON.parse(JSON.stringify(item.konten || [])))
                }}
                  className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Edit */}
      {modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Edit Berita</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="judul"
                defaultValue={modalData.judul}
                className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring focus:border-green-500"
                required
              />

              {Array.isArray(tempKonten) &&
                tempKonten.map((item, index) => (
                  <div key={index} className="mb-4 border p-3 rounded relative bg-gray-50 shadow-sm">
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-red-600 font-bold text-lg"
                        onClick={() => {
                          const toDelete = tempKonten[index]
                          if (toDelete?.id) {
                            setHapusKontenId((prev) => [...prev, toDelete.id])
                          }
                          setTempKonten((prev) => prev.filter((_, i) => i !== index))
                        }}
                      title="Hapus konten"
                    >
                      &times;
                    </button>

                    {item.tipe === 'teks' ? (
                      <TiptapEditor
                        value={item.konten}
                        onChange={(val) => handleKontenChange(index, 'konten', val)}
                      />
                    ) : (
                      <div>
                        {item.konten && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_LARAVEL_URL}/${item.konten}?t=${Date.now()}`}
                            alt=""
                            className="mb-2 rounded max-h-40"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                          className="block text-sm"
                        />
                        {item.file && (
                          <p className="text-xs text-green-600 mt-1">
                            File baru akan diunggah setelah menekan Simpan.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
              ))}
              {/* Tombol tambah konten */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                  onClick={() =>
                    setTempKonten((prev) => [...prev, { tipe: 'teks', konten: '' }])
                  }
                >
                  + Teks
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                  onClick={() =>
                    setTempKonten((prev) => [...prev, { tipe: 'gambar', konten: '' }])
                  }
                >
                  + Gambar
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="px-4 py-1 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
