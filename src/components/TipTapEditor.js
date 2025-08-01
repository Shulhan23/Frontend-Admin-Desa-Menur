'use client'

import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import DOMPurify from 'dompurify'
import { useEffect } from 'react'

export default function TiptapEditor({ value = '', onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, BubbleMenu],
    content: value, // hanya pakai value tanpa fallback '', agar tidak replace isi lama
    editorProps: {
      attributes: {
        class: 'prose min-h-[150px] focus:outline-none p-2',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(DOMPurify.sanitize(html)) // kirim konten yang aman
    },
  })

  // Pastikan jika value dari luar berubah, editor ikut berubah
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value])

  return (
    <div className="border rounded p-2 bg-white">
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex space-x-2 bg-white border shadow px-2 py-1 rounded">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded ${
                editor.isActive('bold') ? 'bg-green-200 font-bold' : ''
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded ${
                editor.isActive('italic') ? 'bg-green-200 italic' : ''
              }`}
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded ${
                editor.isActive('heading', { level: 2 }) ? 'bg-green-200 font-semibold' : ''
              }`}
            >
              H2
            </button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
