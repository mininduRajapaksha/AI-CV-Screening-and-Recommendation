import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap, Target, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const schema = z.object({
  email: z.string().email('nirmalsenavirathna80@gmail.com'),
  password: z.string().min(6, 'Nirmal@2002'),
});

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/jobs';
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const res = await login(values.email, values.password);
    if (res.ok) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left marketing panel */}
      <div className="hidden lg:flex flex-col justify-center bg-navy-900 text-white px-16 py-12">
        <img src={logo} alt="" className="w-24 h-24 mb-8" />
        <h1 className="text-4xl font-bold leading-tight">AI-Powered CV Screening and Recommendation System</h1>
        <p className="text-brand-cyan font-semibold mt-3">Smarter Hiring. Better Talent.</p>
        <p className="text-slate-300 mt-4 max-w-md">
          Streamline your recruitment pipeline using advanced natural language processing. Match, screen, and select the optimal candidates objectively in seconds.
        </p>
        <div className="mt-10 space-y-4">
          {[
            { icon: Zap, title: 'Automated Screening', text: 'Save thousands of hours with immediate, high-accuracy AI summary analysis' },
            { icon: Target, title: 'Smart Recommendations', text: 'Find the perfect candidate matches ranked instantly by technical suitability' },
            { icon: ShieldCheck, title: 'Fair & Objective', text: 'Mitigate human bias with standardized metric evaluation pipelines' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-brand-cyan" />
              </div>
              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-slate-300">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="" className="w-16 h-16 mb-3" />
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-sm text-slate-500">Access your recruitment and talent workspace</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Work Email Address *</label>
              <input type="email" {...register('email')} placeholder="name@company.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} {...register('password')} placeholder="" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded" /> Remember this device
              </label>
              <Link to="/forgot-password" className="text-red-500 hover:underline">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in' : 'Sign In'}
            </button>

            <div className="text-center text-xs text-slate-400"> or continue with </div>

            <button type="button" className="btn-secondary w-full flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-blue-500">G</span> Single Sign-On (SSO)
            </button>

            <p className="text-center text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="text-red-500 font-medium hover:underline">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
