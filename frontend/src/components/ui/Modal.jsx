export default function Modal({ open, onClose, children, maxWidth = 'max-w-2xl' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
