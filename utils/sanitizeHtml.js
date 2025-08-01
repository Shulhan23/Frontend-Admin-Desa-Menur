// utils/sanitizeHtml.js
import DOMPurify from 'dompurify'

export const sanitize = (html) => {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html)
  }
  return html
}
