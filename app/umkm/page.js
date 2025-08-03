'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminUMKMPage() {
  const router = useRouter()
  const [umkmList, setUmkmList] = useState([])
  const [jenisList, setJenisList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingJenisId, setEditingJenisId] = useState(null)
  const [editingJenisNama, setEditingJenisNama] = useState('')
  const [editingUMKMId, setEditingUMKMId] = useState(null)
  const [editingUMKMData, setEditingUMKMData] = useState({})

  // Form input states
  const [nama_umkm, setNamaUMKM] = useState('')
  const [produkJasa, setProdukJasa] = useState('')
  const [jenisId, setJenisId] = useState('')
  const [noHp, setNoHp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [newJenisNama, setNewJenisNama] = useState('')

  // Ambil CSRF cookie
  const getCSRFToken = async () => {
    try {
      await fetch('/laravel-api/sanctum/csrf-cookie', {
        credentials: 'include',
      })
    } catch (err) {
      console.error('Gagal ambil CSRF token:', err)
    }
  }

    const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }

  // Fungsi fetch wrapper dengan headers dan credentials default
    const fetchWithAuth = async (url, options = {}) => {
    const csrfToken = getCookie('XSRF-TOKEN')

    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
        Accept: 'application/json',
        'X-XSRF-TOKEN': csrfToken,
        ...options.headers,
        },
    })

    // Cek apakah user tidak lagi login
    if (res.status === 401 || res.status === 419) {
        window.location.href = '/login' // atau router.replace jika pakai useRouter
    }

    return res
    }

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth('/laravel-api/api/v1/check-auth')
        if (!res.ok) return router.replace('/login')

        await fetchUMKM()
        await fetchJenis()
      } catch (err) {
        console.error('Autentikasi gagal:', err)
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const fetchUMKM = async () => {
    try {
      const res = await fetchWithAuth('/laravel-api/api/v1/umkm')
      const data = await res.json()
      setUmkmList(Array.isArray(data) ? data : data.data ?? [])
    } catch (err) {
      console.error('Fetch UMKM gagal:', err)
      setUmkmList([])
    }
  }

  const fetchJenis = async () => {
    try {
      const res = await fetchWithAuth('/laravel-api/api/v1/jenis-umkm')
      const data = await res.json()
      setJenisList(Array.isArray(data) ? data : data.data ?? [])
    } catch (err) {
      console.error('Fetch jenis gagal:', err)
      setJenisList([])
    }
  }

    const handleHapusJenis = async (id) => {
    if (!confirm('Yakin ingin menghapus jenis UMKM ini?')) return
    await getCSRFToken()

    const res = await fetchWithAuth(`/laravel-api/api/v1/jenis-umkm/${id}`, {
        method: 'DELETE',
    })

    if (res.ok) {
        fetchJenis()
        alert('Jenis UMKM berhasil dihapus!')
    } else {
        const err = await res.json()
        alert('Gagal hapus jenis: ' + JSON.stringify(err))
    }
    }   


    const handleTambahUMKM = async (e) => {
    e.preventDefault()

    try {
        // WAJIB: Ambil CSRF cookie sebelum POST
        await getCSRFToken()

        const res = await fetchWithAuth('/laravel-api/api/v1/umkm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nama_umkm,
            produk_jasa: produkJasa,
            jenis_umkm_id: jenisId,
            no_hp: noHp,
            alamat,
        }),
        })

        const data = await res.json()

        if (!res.ok) {
        console.error('Gagal menambahkan UMKM:', data)
        alert(`Gagal menambahkan UMKM: ${data.message || 'Terjadi kesalahan'}`)
        return
        }

        alert('UMKM berhasil ditambahkan!')
        setNamaUMKM('')
        setProdukJasa('')
        setJenisId('')
        setNoHp('')
        setAlamat('')
        fetchUMKM() // refresh data
    } catch (err) {
        console.error('Terjadi error:', err)
        alert('Terjadi error saat menambahkan UMKM.')
    }
    }

    const handleTambahJenis = async () => {
    if (!newJenisNama) return alert('Nama jenis UMKM harus diisi')
    await getCSRFToken()

    const res = await fetchWithAuth('/laravel-api/api/v1/jenis-umkm', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama_jenis: newJenisNama }),
    })

    if (res.ok) {
        setNewJenisNama('')
        fetchJenis()
        alert('Jenis UMKM berhasil ditambahkan!')
    } else {
        const err = await res.json()
        alert('Gagal tambah jenis: ' + JSON.stringify(err))
    }
    }

    const handleSimpanEditJenis = async (id) => {
    if (!editingJenisNama) return alert('Nama jenis tidak boleh kosong')
    await getCSRFToken()

    const res = await fetchWithAuth(`/laravel-api/api/v1/jenis-umkm/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_jenis: editingJenisNama }),
    })

    if (res.ok) {
        alert('Jenis UMKM berhasil diupdate!')
        setEditingJenisId(null)
        setEditingJenisNama('')
        fetchJenis()
    } else {
        const err = await res.json()
        alert('Gagal update jenis: ' + JSON.stringify(err))
    }
    }

    const handleSimpanEditUMKM = async (id) => {
    await getCSRFToken()

    const res = await fetchWithAuth(`/laravel-api/api/v1/umkm/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUMKMData),
    })

    if (res.ok) {
        alert('UMKM berhasil diupdate!')
        setEditingUMKMId(null)
        setEditingUMKMData({})
        fetchUMKM()
    } else {
        const err = await res.json()
        alert('Gagal update UMKM: ' + JSON.stringify(err))
    }
    }

    const handleHapusUMKM = async (id) => {
    if (!confirm('Yakin ingin menghapus UMKM ini?')) return
    await getCSRFToken()

    const res = await fetchWithAuth(`/laravel-api/api/v1/umkm/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      fetchUMKM()
      alert('UMKM berhasil dihapus!')
    } else {
      const err = await res.json()
      alert('Gagal hapus UMKM: ' + JSON.stringify(err))
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manajemen UMKM</h1>

      {/* Form Tambah UMKM */}
      <form onSubmit={handleTambahUMKM} className="space-y-4 mb-10">
        <input className="border p-2 w-full rounded" placeholder="Nama UMKM" value={nama_umkm} onChange={(e) => setNamaUMKM(e.target.value)} />
        <input className="border p-2 w-full rounded" placeholder="Produk/Jasa" value={produkJasa} onChange={(e) => setProdukJasa(e.target.value)} />
        <select className="border p-2 w-full rounded" value={jenisId} onChange={(e) => setJenisId(e.target.value)}>
          <option value="">Pilih Jenis UMKM</option>
          {jenisList.map((jenis) => (
            <option key={jenis.id} value={jenis.id}>{jenis.nama_jenis}</option>
          ))}
        </select>
        <input className="border p-2 w-full rounded" placeholder="No HP" value={noHp} onChange={(e) => setNoHp(e.target.value)} />
        <textarea className="border p-2 w-full rounded" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Tambah UMKM</button>
      </form>

    <h2 className="text-xl font-semibold mb-4 mt-10">Daftar Jenis UMKM</h2>
        {jenisList.length === 0 ? (
        <p>Belum ada data jenis UMKM.</p>
        ) : (
            <table className="w-full border border-gray-300 mb-10">
            <thead className="bg-gray-100">
                <tr>
                <th className="border p-2 text-left">Nama Jenis</th>
                <th className="border p-2 text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {jenisList.map((item) => (
                <tr key={item.id}>
                    <td className="border p-2">
                    {editingJenisId === item.id ? (
                        <input
                        value={editingJenisNama}
                        onChange={(e) => setEditingJenisNama(e.target.value)}
                        className="border p-1 rounded w-full"
                        />
                    ) : (
                        item.nama_jenis
                    )}
                    </td>
                    <td className="border p-2 space-x-2">
                    {editingJenisId === item.id ? (
                        <>
                        <button
                            onClick={() => handleSimpanEditJenis(item.id)}
                            className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                            Simpan
                        </button>
                        <button
                            onClick={() => setEditingJenisId(null)}
                            className="bg-gray-400 text-white px-2 py-1 rounded"
                        >
                            Batal
                        </button>
                        </>
                    ) : (
                        <>
                        <button
                            onClick={() => {
                            setEditingJenisId(item.id)
                            setEditingJenisNama(item.nama_jenis)
                            }}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleHapusJenis(item.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Hapus
                        </button>
                        </>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}

      {/* Form tambah Jenis */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Tambah Jenis UMKM</h2>
        <div className="flex gap-2">
          <input className="border p-2 rounded w-full" placeholder="Nama Jenis UMKM" value={newJenisNama} onChange={(e) => setNewJenisNama(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleTambahJenis}>Tambah Jenis</button>
        </div>
      </div>

      {/* Tabel UMKM */}
      <h2 className="text-xl font-semibold mb-4">Daftar UMKM</h2>
      {loading ? (
        <p>Memuat data...</p>
      ) : umkmList.length === 0 ? (
        <p>Belum ada data UMKM.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Nama UMKM</th>
              <th className="border p-2 text-left">Produk/Jasa</th>
              <th className="border p-2 text-left">Jenis</th>
              <th className="border p-2 text-left">No HP</th>
              <th className="border p-2 text-left">Alamat</th>
              <th className="border p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {umkmList.map((item) => (
            <tr key={item.id}>
            <td className="border p-2">
                {editingUMKMId === item.id ? (
                <input
                    value={editingUMKMData.nama_umkm}
                    onChange={(e) => setEditingUMKMData({ ...editingUMKMData, nama_umkm: e.target.value })}
                    className="border p-1 rounded w-full"
                />
                ) : (
                item.nama_umkm
                )}
            </td>
            <td className="border p-2">
                {editingUMKMId === item.id ? (
                <input
                    value={editingUMKMData.produk_jasa}
                    onChange={(e) => setEditingUMKMData({ ...editingUMKMData, produk_jasa: e.target.value })}
                    className="border p-1 rounded w-full"
                />
                ) : (
                item.produk_jasa
                )}
            </td>
            <td className="border p-2">
                {editingUMKMId === item.id ? (
                <select
                    value={editingUMKMData.jenis_umkm_id}
                    onChange={(e) => setEditingUMKMData({ ...editingUMKMData, jenis_umkm_id: e.target.value })}
                    className="border p-1 rounded w-full"
                >
                    <option value="">Pilih Jenis</option>
                    {jenisList.map(j => (
                    <option key={j.id} value={j.id}>{j.nama_jenis}</option>
                    ))}
                </select>
                ) : (
                item.jenis_umkm?.nama_jenis
                )}
            </td>
            <td className="border p-2">
                {editingUMKMId === item.id ? (
                <input
                    value={editingUMKMData.no_hp}
                    onChange={(e) => setEditingUMKMData({ ...editingUMKMData, no_hp: e.target.value })}
                    className="border p-1 rounded w-full"
                />
                ) : (
                item.no_hp
                )}
            </td>
            <td className="border p-2">
                {editingUMKMId === item.id ? (
                <textarea
                    value={editingUMKMData.alamat}
                    onChange={(e) => setEditingUMKMData({ ...editingUMKMData, alamat: e.target.value })}
                    className="border p-1 rounded w-full"
                />
                ) : (
                item.alamat
                )}
            </td>
            <td className="border p-2 space-x-2">
                {editingUMKMId === item.id ? (
                <>
                    <button onClick={() => handleSimpanEditUMKM(item.id)} className="bg-green-600 text-white px-2 py-1 rounded">Simpan</button>
                    <button onClick={() => setEditingUMKMId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Batal</button>
                </>
                ) : (
                <>
                    <button
                    onClick={() => {
                        setEditingUMKMId(item.id)
                        setEditingUMKMData({
                        nama_umkm: item.nama_umkm,
                        produk_jasa: item.produk_jasa,
                        jenis_umkm_id: item.jenis_umkm_id,
                        no_hp: item.no_hp,
                        alamat: item.alamat,
                        })
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                    Edit
                    </button>
                    <button onClick={() => handleHapusUMKM(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                </>
                )}
            </td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
