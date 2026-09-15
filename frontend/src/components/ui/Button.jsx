export default function Button({ children, variant = 'navy', className = '', ...props }) {
  const variants = {
    coral: 'bg-coral text-white hover:bg-coral-hover',
    navy: 'bg-navy text-white hover:bg-navy-dark',
    secondary: 'bg-white text-navy border border-slate-200 hover:bg-slate-50',
    ghost: 'text-navy hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }
  return (
    <button className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
