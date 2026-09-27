import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Circle, ChevronDown, Cpu } from 'lucide-react';

export default function ApiConfiguration() {
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isGeminiConnected, setIsGeminiConnected] = useState(false);

  const handleSaveGeminiConfig = async () => {
    if (!geminiApiKey) {
      alert("Please enter a valid API Key first.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/admin/config', {
        apiKey: geminiApiKey,
        provider: 'gemini'
      });
      
      if (response.status === 200) {
        alert(response.data.message);
        setIsGeminiConnected(true);
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert(error.response?.data?.error || "Failed to update API configuration");
    }
  };

  return (
    <div className="w-full text-slate-800">
      
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold leading-9 text-slate-900">API Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">Manage external AI provider integrations.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 min-w-[48px] min-h-[48px] shrink-0 bg-slate-100 rounded-lg text-slate-800 flex items-center justify-center">
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="font-bold text-base">OpenAI API Settings</h2>
                <p className="text-xs text-slate-500">GPT-4o, GPT-4 Turbo, and more</p>
              </div>
            </div>
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
            <span className={`flex items-center gap-1.5 px-2.5 py-1 ${isGeminiConnected ? 'bg-green-50 border-green-300 text-green-600' : 'bg-red-50 border-red-300 text-red-500'} border rounded-md text-xs font-semibold`}>
              <Circle size={8} fill="currentColor" className={isGeminiConnected ? 'text-green-500' : 'text-red-500'} /> 
              {isGeminiConnected ? 'Connected' : 'Not Configured'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">API Key</label>
              <div className="relative">
                <input 
                  type={showGeminiKey ? "text" : "password"} 
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
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
              <button 
                onClick={handleSaveGeminiConfig}
                className="px-5 py-2 bg-[#1e293b] hover:bg-slate-800 active:scale-95 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}