import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import logo from '../../assets/Logo.png'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[34rem] p-8 sm:p-12">
        <div className="flex justify-center mb-5">
          <img src={logo} alt="CVision AI" className="w-20 h-20 object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-navy text-center">Forgot Password?</h1>
        <p className="text-sm text-slate-500 text-center mt-2 mb-8">No worries! Enter your work email and we will send you a reset link.</p>

        <form onSubmit={e => { e.preventDefault(); alert('Reset link sent to ' + email) }} className="space-y-4">
          <Input label="Work Email Address" required type="email" placeholder="e.g. minindu.r@claritydental.com" value={email} onChange={e => setEmail(e.target.value)} />
          <Button type="submit" variant="navy" className="w-full">Send Reset Link</Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-coral font-semibold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
