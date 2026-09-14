import { Zap, Target, ShieldCheck } from 'lucide-react'
import logo from '../../assets/logo.png'

const features = [
  { icon: Zap, title: 'Automated Screening', desc: 'Save thousands of hours with immediate, high-accuracy AI summary analysis.' },
  { icon: Target, title: 'Smart Recommendations', desc: 'Find the perfect candidate matches ranked instantly by technical suitability.' },
  { icon: ShieldCheck, title: 'Fair & Objective', desc: 'Mitigate human bias with standardized metric evaluation pipelines.' }
]

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[45%] bg-gradient-to-b from-authblue to-authblue-dark p-12 flex-col justify-center text-white">
        <div className="max-w-md">
          <div className="w-44 h-44 mb-8 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 p-5">
            <img src={logo} alt="CVision AI" className="w-36 h-36 object-contain" />
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-3">
            AI-Powered<br />CV Screening and<br />Recommendation<br />System
          </h1>
          <p className="font-semibold mb-4">Smarter Hiring. Better Talent.</p>
          <p className="text-sm text-white/85 mb-8 leading-relaxed">
            Leverage the power of AI to automatically screen CVs, analyze candidate skills and core experience, and instantly retrieve the best recommendations faster and fairer.
          </p>

          <div className="space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-white/80 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#f0f2f5] flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  )
}