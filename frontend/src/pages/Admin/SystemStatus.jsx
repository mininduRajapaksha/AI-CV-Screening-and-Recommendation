import React from 'react';
import { Code, Monitor, Cpu, Circle } from 'lucide-react';

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
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Code size={20} />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
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
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Monitor size={20} />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
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
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Cpu size={20} />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
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
          <div className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-semibold">
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
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-black h-2.5 rounded-full" style={{ width: '42%' }}></div>
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
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '78%' }}></div>
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
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
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