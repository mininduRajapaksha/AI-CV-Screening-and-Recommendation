import React from 'react';
import { Monitor, Clock, Circle } from 'lucide-react';

export default function SystemStatus() {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full text-slate-800">
      
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold leading-9 text-slate-900">System Status</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor application health and microservices.</p>
      </div>

      {/* Microservices Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Frontend Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
              <Monitor size={20} />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-300 text-green-600 rounded-md text-xs font-semibold">
              <Circle size={8} fill="currentColor" className="text-green-500" /> Online
            </span>
          </div>
          <h3 className="font-bold text-sm mb-1">Frontend (React)</h3>
          <p className="text-xs text-slate-500 mb-2">Uptime: 99.9%</p>
          <p className="text-xs text-slate-400">Vite 8 · Port 8443</p>
        </div>

        {/* Backend API Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
              {/* Custom Cloud & Server Icon exactly matching the 2nd image */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 14a4.5 4.5 0 0 1 0-9 6 6 0 0 1 11.8 1.5A4 4 0 0 1 17.5 14H6.5z" />
                <rect x="4" y="17" width="16" height="4" rx="1" />
                <circle cx="7" cy="19" r="1" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-300 text-green-600 rounded-md text-xs font-semibold">
              <Circle size={8} fill="currentColor" className="text-green-500" /> Online
            </span>
          </div>
          <h3 className="font-bold text-sm mb-1">Backend API</h3>
          <p className="text-xs text-slate-500 mb-2">Uptime: 99.7%</p>
          <p className="text-xs text-slate-400">REST · v2.4.1</p>
        </div>

        {/* AI Engine Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
              <Clock size={20} />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-300 text-green-600 rounded-md text-xs font-semibold">
              <Circle size={8} fill="currentColor" className="text-green-500" /> Online
            </span>
          </div>
          <h3 className="font-bold text-sm mb-1">AI Engine</h3>
          <p className="text-xs text-slate-500 mb-2">Queue: 0 tasks</p>
          <p className="text-xs text-slate-400">GPT-4o · Online</p>
        </div>

      </div>

      {/* System Resource Usage Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-bold text-base">System Resource Usage</h2>
            <p className="text-xs text-slate-500 mt-1">Live metrics · Updated every 30s</p>
          </div>
          <div className="px-5 py-1.5 bg-indigo-50/50 border border-indigo-200 text-indigo-600 rounded-full text-[15px] font-semibold tracking-wide shadow-sm">
            {currentTime}
          </div>
        </div>

        <div className="space-y-6">
          {/* CPU Usage */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">CPU Usage</span>
              <div className="flex gap-4">
                <span className="text-slate-500">4 cores · 3.2 GHz</span>
                <span className="font-medium text-slate-700">42%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-lg h-3.5">
              <div className="bg-[#1e293b] h-3.5 rounded-lg" style={{ width: '42%' }}></div>
            </div>
          </div>

          {/* Memory Usage */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">Memory</span>
              <div className="flex gap-4">
                <span className="text-slate-500">6.2 GB / 8 GB</span>
                <span className="font-medium text-slate-700">78%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-lg h-3.5">
              <div className="bg-yellow-400 h-3.5 rounded-lg" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Disk I/O */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">Disk I/O</span>
              <div className="flex gap-4">
                <span className="text-slate-500">120 MB/s throughput</span>
                <span className="font-medium text-slate-700">23%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-lg h-3.5">
              <div className="bg-green-500 h-3.5 rounded-lg" style={{ width: '23%' }}></div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-slate-400 mb-1">OS</span>
            <span className="font-medium text-slate-700">Ubuntu 22.04 LTS</span>
          </div>
          <div>
            <span className="block text-slate-400 mb-1">Node.js</span>
            <span className="font-medium text-slate-700">v22.4.0</span>
          </div>
          <div>
            <span className="block text-slate-400 mb-1">Region</span>
            <span className="font-medium text-slate-700">us-east-1</span>
          </div>
          <div>
            <span className="block text-slate-400 mb-1">Last restart</span>
            <span className="font-medium text-slate-700">14 days ago</span>
          </div>
        </div>

      </div>

    </div>
  );
}