import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import logo from '../../assets/logo.png';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await authApi.forgotPassword({ email });
    } catch {
      // Silently ignore  never reveal whether email exists
    }
    toast.success('If the email exists, a reset link has been sent.');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-navy-900 text-white px-16 py-12">
        <img src={logo} alt="" className="w-24 h-24 mb-8" />
        <h1 className="text-4xl font-bold leading-tight">AI-Powered CV Screening and Recommendation System</h1>
        <p className="text-brand-cyan font-semibold mt-3">Smarter Hiring. Better Talent.</p>
      </div>

      <div className="flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="" className="w-16 h-16 mb-3" />
            <h2 className="text-2xl font-bold">Forgot Password?</h2>
            <p className="text-sm text-slate-500 text-center">No worries! Enter your work email and we will send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Work Email Address *</label>
              <input type="email" {...register('email')} placeholder="e.g. minindu.r@claritydental.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-red-500 text-sm hover:underline">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
