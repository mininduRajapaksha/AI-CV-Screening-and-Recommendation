import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo.png'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'HR Manager', agree: false })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (!form.agree) return setError('Please agree to the terms to continue.')
    setIsSubmitting(true)
    try {
      await register(form)
      navigate('/login', { state: { message: 'Account created. Please sign in.' } })
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 sm:p-10">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="CVision AI" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-navy text-center">Create Account</h1>
        <p className="text-xs text-slate-500 text-center mt-1 mb-6">Join TalentFlow to start managing active candidates</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
          <Input label="Full Name" required placeholder="e.g. Minindu Ratnayake" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Work Email Address" required type="email" placeholder="name@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Password" required withEye placeholder="Choose password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <Input label="Confirm Password" required withEye placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Your Primary Workspace Role <span className="text-coral">*</span></label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-coral/30">
              <option>HR Manager</option>
              <option>Recruiter</option>
            </select>
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} className="mt-0.5 w-3.5 h-3.5 accent-navy" />
            <span>I agree to TalentFlow's <span className="font-semibold text-navy">Terms of Service</span> and <span className="font-semibold text-navy">Privacy Policy</span></span>
          </label>

          <Button type="submit" disabled={isSubmitting} variant="navy" className="w-full bg-[#1E2A4A] hover:bg-[#172554] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Creating account...' : 'Create Account'}</Button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-3">
          Already have an account? <Link to="/login" className="text-coral font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
