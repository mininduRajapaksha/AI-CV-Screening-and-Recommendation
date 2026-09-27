import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Monitor, Clock, Circle } from 'lucide-react';

export default function SystemStatus() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
  
  const [backendHealth, setBackendHealth] = useState({
    status: 'Checking...',
    uptime: 'N/A',
    isOnline: false
  });

  const [sysMetrics, setSysMetrics] = useState({
    cpu: { cores: 0, speed: 0, usage: 0 },
    memory: { used: 0, total: 0, percent: 0 },
    osInfo: 'Loading...',
    nodeVersion: 'Loading...'
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/status');
        if (response.data.server === "Running") {
          const hours = Math.floor(response.data.uptime / 3600);
          const minutes = Math.floor((response.data.uptime % 3600) / 60);
          
          setBackendHealth({
            status: response.data.message,
            uptime: `${hours}h ${minutes}m`,
            isOnline: true
          });

          if (response.data.metrics) {
            setSysMetrics(response.data.metrics);
          }
        }
      } catch (error) {
        console.error("Backend status check failed:", error);
        setBackendHealth({ status: 'Offline', uptime: '0h 0m', isOnline: false });
      }
    };

    fetchStatus();
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
      fetchStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-slate-800">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold leading-9 text-slate-900">System Status</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor application health and microservices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 14a4.5 4.5 0 0 1 0-9 6 6 0 0 1 11.8 1.5A4 4 0 0 1 17.5 14H6.5z" />
                <rect x="4" y="17" width="16" height="4" rx="1" />
                <circle cx="7" cy="19" r="1" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 ${backendHealth.isOnline ? 'bg-green-50 border-green-300 text-green-600' : 'bg-red-50 border-red-300 text-red-600'} border rounded-md text-xs font-semibold`}>
              <Circle size={8} fill="currentColor" className={backendHealth.isOnline ? 'text-green-500' : 'text-red-500'} /> {backendHealth.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <h3 className="font-bold text-sm mb-1">Backend API</h3>
          <p className="text-xs text-slate-500 mb-2">Uptime: {backendHealth.uptime}</p>
          <p className="text-xs text-slate-400">REST · {backendHealth.status}</p>
        </div>

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
          <p className="text-xs text-slate-400">Gemini Pro · Online</p>
        </div>
      </div>

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
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">CPU Usage</span>
              <div className="flex gap-4">
                <span className="text-slate-500">{sysMetrics.cpu.cores} cores · {sysMetrics.cpu.speed} GHz</span>
                <span className="font-medium text-slate-700">{sysMetrics.cpu.usage}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-lg h-3.5">
              <div className="bg-[#1e293b] h-3.5 rounded-lg transition-all duration-1000" style={{ width: `${sysMetrics.cpu.usage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">Memory</span>
              <div className="flex gap-4">
                <span className="text-slate-500">{sysMetrics.memory.used} GB / {sysMetrics.memory.total} GB</span>
                <span className="font-medium text-slate-700">{sysMetrics.memory.percent}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-lg h-3.5">
              <div className="bg-yellow-400 h-3.5 rounded-lg transition-all duration-1000" style={{ width: `${sysMetrics.memory.percent}%` }}></div>
            </div>
          </div>

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

        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-slate-400 mb-1">OS</span>
            <span className="font-medium text-slate-700">{sysMetrics.osInfo}</span>
          </div>
          <div>
            <span className="block text-slate-400 mb-1">Node.js</span>
            <span className="font-medium text-slate-700">{sysMetrics.nodeVersion}</span>
          </div>
          <div>
            <span className="block text-slate-400 mb-1">Region</span>
            <span className="font-medium text-slate-700">Local (LK)</span>
          </div>
          <div>
            <span className="block text-slate-400 mb-1">Last restart</span>
            <span className="font-medium text-slate-700">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}