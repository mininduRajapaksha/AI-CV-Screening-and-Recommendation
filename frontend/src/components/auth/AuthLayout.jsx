import { Zap, Target, ShieldCheck } from 'lucide-react'
import logo from '../../assets/Logo.png'

const features = [
  { icon: Zap, title: 'Automated Screening', desc: 'Save thousands of hours with immediate, high-accuracy AI summary analysis.' },
  { icon: Target, title: 'Smart Recommendations', desc: 'Find the perfect candidate matches ranked instantly by technical suitability.' },
  { icon: ShieldCheck, title: 'Fair & Objective', desc: 'Mitigate human bias with standardized metric evaluation pipelines.' }
]

export default function AuthLayout({ children }) {
  return (
<<<<<<< HEAD
    <div className="h-screen w-screen overflow-hidden flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-b from-authblue to-authblue-dark px-10 py-8 flex-col justify-center text-white overflow-hidden">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="w-32 h-32 mb-6 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 p-4 mx-auto lg:mx-0">
            <img src={logo} alt="CVision AI" className="w-24 h-24 object-contain" />
          </div>
=======
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-[49%] min-h-screen bg-gradient-to-b from-authblue to-authblue-dark px-20 py-12 flex-col justify-center text-white">
        <div className="max-w-lg">
          <img src={logo} alt="CVision AI" className="w-64 h-64 object-contain mb-8" />
>>>>>>> 2297b78a2ecd081de10f34fafed8f4f52ee4c4d6

          {/* Heading */}
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-2">
            AI-Powered<br />CV Screening and<br />Recommendation<br />System
          </h1>

          <p className="font-semibold mb-2 text-sm">Smarter Hiring. Better Talent.</p>

          <p className="text-xs text-white/85 mb-5 leading-relaxed">
            Leverage the power of AI to automatically screen CVs, analyze candidate skills and core experience, and instantly retrieve the best recommendations faster and fairer.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs">{title}</div>
                  <div className="text-[11px] text-white/80 leading-snug">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

<<<<<<< HEAD
      {/* RIGHT PANEL */}
      <div className="flex-1 bg-[#f0f2f5] flex items-center justify-center p-6 h-screen overflow-hidden">
=======
      <main className="flex-1 min-h-screen bg-[#eef3f8] flex items-center justify-center p-6 lg:p-12">
>>>>>>> 2297b78a2ecd081de10f34fafed8f4f52ee4c4d6
        {children}
      </main>
    </div>
  )
}
