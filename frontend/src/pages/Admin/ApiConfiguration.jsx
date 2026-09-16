import React, { useState } from 'react';
import { Eye, EyeOff, Circle, Bot, Sparkles, ChevronDown } from 'lucide-react';

export default function ApiConfiguration() {
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  return (
    <div className="w-full text-slate-800">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">API Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">Manage external AI provider integrations.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        
        {/* OpenAI API Settings Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="font-bold text-base">OpenAI API Settings</h2>
                <p className="text-xs text-slate-500">GPT-4o, GPT-4 Turbo, and more</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
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
              <button className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors cursor-pointer">
                Test Connection
              </button>
              <button className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
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
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="font-bold text-base">Google Gemini API Settings</h2>
                <p className="text-xs text-slate-500">Gemini 1.5 Pro, Gemini Flash, and more</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
              <Circle size={8} fill="currentColor" className="text-slate-400" /> Not Configured
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
              <button className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors cursor-pointer">
                Test Connection
              </button>
              <button className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                Save Configuration
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}