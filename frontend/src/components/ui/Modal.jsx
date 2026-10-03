import { X } from 'lucide-react'

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width,
  maxWidth = 'max-w-2xl'
}) {
  if (!open) return null
  const sizeClass = width || maxWidth

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <>
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
            {footer && (
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                {footer}
              </div>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
