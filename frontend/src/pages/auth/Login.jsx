import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo.png'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email)
    navigate('/')
  }

  const handleGoogleLogin = () => {
    alert('Google Sign-In clicked  connect OAuth later')
    login('google-user@example.com')
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 sm:p-10">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="CVision AI" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-navy text-center">Welcome Back</h1>
        <p className="text-xs text-slate-500 text-center mt-1 mb-6">Access your recruitment and talent workspace</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Work Email Address" required type="email" placeholder="minindu.r@claritydental.com" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" required withEye placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-navy font-medium cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 accent-navy" />
              Remember this device
            </label>
            <Link to="/forgot-password" className="text-xs text-coral font-semibold hover:underline">Forgot Password?</Link>
          </div>

          <Button type="submit" variant="navy" className="w-full">Sign In</Button>

          <div className="relative text-center py-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-3 text-xs text-gray-400">or continue with</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-navy hover:bg-slate-50 transition-colors"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Don't have an account? <Link to="/register" className="text-coral font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
