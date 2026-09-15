export default function Badge({ children, variant = 'success' }) {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-600',
    navy: 'bg-blue-50 text-navy',
    gray: 'bg-gray-100 text-gray-600'
  }
  return <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${variants[variant]}`}>{children}</span>
}
