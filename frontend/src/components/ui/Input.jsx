import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function Input({ label, required, type = 'text', withEye, className = '', ...props }) {
  const [show, setShow] = useState(false)
  const inputType = withEye ? (show ? 'text' : 'password') : type
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-navy mb-1.5">
          {label} {required && <span className="text-coral">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
          {...props}
        />
        {withEye && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
