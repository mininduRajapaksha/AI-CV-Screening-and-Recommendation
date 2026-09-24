import React, { useState } from 'react';
import { Eye, EyeOff, Circle, ChevronDown } from 'lucide-react';

export default function ApiConfiguration() {
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  return (
    <div className="w-full text-slate-800">
      
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold leading-9 text-slate-900">API Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">Manage external AI provider integrations.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        
        {/* OpenAI API Settings Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-700 flex items-center justify-center">
                {/* 100% Fixed Official OpenAI Logo (No Stroke, Only Fill) */}
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A6.0651 6.0651 0 0 0 19.0192 19.818a5.9847 5.9847 0 0 0 3.9977-2.9001 6.0462 6.0462 0 0 0-.735-7.0968zM8.7505 6.7134c.8336-1.4485 2.6644-1.9213 4.1018-1.0553l.899.5373-3.4187 5.9224c-.035.0607-.0763.1186-.1233.1725L8.272 9.0436a4.269 4.269 0 0 1 .4785-2.3302zm-3.3444 8.7849c-.8335-1.4485-.3483-3.3031 1.0886-4.1352l.9037-.5253v6.8122c-.0011.0702-.0165.1396-.0456.205L5.4385 14.618a4.2662 4.2662 0 0 1-.0324-2.3803zm12.3789 2.1284c-.8336 1.4484-2.6644 1.9212-4.1018 1.0552l-.899-.5372 3.4187-5.9224c.035-.0607.0763-.1186.1233-.1725l1.9373 3.2468a4.269 4.269 0 0 1-.4785 2.3301zm3.3443-8.785c.8336 1.4485.3483 3.3031-1.0886 4.1353l-.9037.5252V7.7052c.0012-.0702.0165-.1396.0456-.205l1.9143 3.2374a4.2662 4.2662 0 0 1 .0324 2.3803zm-7.6666-4.0624 3.4187 5.9224-2.841 1.64c-.0606.035-.1254.061-.1925.0772L9.5898 10.373l1.8967-3.2844a4.2688 4.2688 0 0 1 2.2227-1.4116zm-5.7876 9.9846-3.4186-5.9224 2.841-1.64c.0606-.035.1254-.061.1925-.0772l4.2393 2.4589-1.8967 3.2845a4.2688 4.2688 0 0 1-2.2227 1.4116zm7.2625-3.0822-2.1197-1.2295 2.1197-1.2294 2.1196 1.2294-2.1196 1.2295z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-base">OpenAI API Settings</h2>
                <p className="text-xs text-slate-500">GPT-4o, GPT-4 Turbo, and more</p>
              </div>
            </div>
            {/* Connected Badge */}
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-300 text-green-600 rounded-md text-xs font-semibold">
              <Circle size={8} fill="currentColor" className="text-green-500" /> Connected
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">API Key</label>
              <div className="relative">
                <input 
                  type={showOpenAIKey ? "text" : "password"} 
                  defaultValue="sk-proj-1234567890abcdefghijklmnopqrstuvwxyz"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-900 focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showOpenAIKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Select Model</label>
              <div className="relative">
                <select className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-900 focus:outline-none appearance-none cursor-pointer">
                  <option>GPT-4o</option>
                  <option>GPT-4 Turbo</option>
                  <option>GPT-3.5 Turbo</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-slate-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 rounded-lg text-sm font-medium text-slate-700 transition-all cursor-pointer">
                Test Connection
              </button>
              <button className="px-5 py-2 bg-[#1e293b] hover:bg-slate-800 active:scale-95 text-white rounded-lg text-sm font-medium transition-all cursor-pointer">
                Save Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Google Gemini API Settings Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                <div className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-base">Google Gemini API Settings</h2>
                <p className="text-xs text-slate-500">Gemini 1.5 Pro, Gemini Flash, and more</p>
              </div>
            </div>
            {/* Not Configured Badge */}
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-300 text-red-500 rounded-md text-xs font-semibold">
              <Circle size={8} fill="currentColor" className="text-red-500" /> Not Configured
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">API Key</label>
              <div className="relative">
                <input 
                  type={showGeminiKey ? "text" : "password"} 
                  placeholder="Enter Your Google AI API Key"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-900 focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Select Model</label>
              <div className="relative">
                <select className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-900 focus:outline-none appearance-none cursor-pointer">
                  <option>Gemini 1.5 Pro</option>
                  <option>Gemini 1.5 Flash</option>
                  <option>Gemini Pro</option> 
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-slate-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 rounded-lg text-sm font-medium text-slate-700 transition-all cursor-pointer">
                Test Connection
              </button>
              <button className="px-5 py-2 bg-[#1e293b] hover:bg-slate-800 active:scale-95 text-white rounded-lg text-sm font-medium transition-all cursor-pointer">
                Save Configuration
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}