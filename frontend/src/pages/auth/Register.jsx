import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap, Target, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string(),
  role: z.string().min(1, 'Select a role'),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export default function Register() {
  const { register: signup, loading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const res = await signup({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      role: values.role,
    });
    if (res.ok) {
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-navy-900 text-white px-16 py-12">
        <img src={logo} alt="" className="w-24 h-24 mb-8" />
        <h1 className="text-4xl font-bold leading-tight">AI-Powered CV Screening and Recommendation System</h1>
        <p className="text-brand-cyan font-semibold mt-3">Smarter Hiring. Better Talent.</p>
        <p className="text-slate-300 mt-4 max-w-md">
          Streamline your recruitment pipeline using advanced natural language processing.
        </p>
      </div>

      <div className="flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="" className="w-16 h-16 mb-3" />
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-sm text-slate-500">Join CVision AI to start managing active candidates</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <input {...register('fullName')} placeholder="e.g. Minindu Ratnayake" className="input-field" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Work Email Address *</label>
              <input type="email" {...register('email')} placeholder="name@company.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} {...register('password')} placeholder="Choose password" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input type={showPwd ? 'text' : 'password'} {...register('confirmPassword')} placeholder="Repeat password" className="input-field" />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Your Primary Workspace Role *</label>
              <select {...register('role')} className="input-field">
                <option value="">Select a role</option>
                <option value="HR Manager">HR Manager</option>
                <option value="System Administrator">System Administrator</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" {...register('terms')} className="mt-0.5 rounded" />
              <span>I agree to CVision AI's <a className="text-red-500 hover:underline" href="#">Terms of Service</a> and <a className="text-red-500 hover:underline" href="#">Privacy Policy</a></span>
            </label>
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-red-500 font-medium hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
