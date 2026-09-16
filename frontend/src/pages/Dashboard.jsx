import React from 'react';
import { useNavigate } from 'react-router-dom'; // Required for navigation
import { Briefcase, Users, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Custom component for the circular progress bar
const CircularProgress = ({ value, color }) => {
  const radius = 15.9155;
  const circumference = 100;
  const strokeDashoffset = circumference - value;

  return (
    <div className="relative w-10 h-10 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={radius} fill="transparent" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-700">{value}%</span>
    </div>
  );
};

// Dummy Data for Bar Chart
const jobStatsData = [
  { name: 'Jan', Applications: 40, Hires: 20 },
  { name: 'Feb', Applications: 65, Hires: 30 },
  { name: 'Mar', Applications: 50, Hires: 15 },
  { name: 'Apr', Applications: 30, Hires: 10 },
  { name: 'May', Applications: 60, Hires: 20 },
  { name: 'Jun', Applications: 45, Hires: 15 },
  { name: 'Jul', Applications: 55, Hires: 35 },
  { name: 'Aug', Applications: 35, Hires: 20 },
];

// Dummy Data for Donut Chart
const skillData = [
  { name: 'React / Frontend', value: 38, color: '#1e3a8a' },
  { name: 'Backend / Node', value: 27, color: '#4f46e5' },
  { name: 'Design / UI', value: 18, color: '#3b82f6' },
  { name: 'Data / Analytics', value: 11, color: '#0ea5e9' },
  { name: 'DevOps / Infra', value: 6, color: '#38bdf8' },
];

export default function Dashboard() {
  const navigate = useNavigate(); // Hook initialized for route navigation

  return (
    <div className="p-6 min-h-screen text-slate-800">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-600">Total Active Jobs</span>
            <div className="p-2 bg-slate-100 rounded-md"><Briefcase size={16} className="text-slate-600" /></div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">12</h2>
            <p className="text-xs text-slate-500 mt-1">↑ +3 this month</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-600">Total Candidates</span>
            <div className="p-2 bg-slate-100 rounded-md"><Users size={16} className="text-slate-600" /></div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">345</h2>
            <p className="text-xs text-slate-500 mt-1">↑ +28 this week</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-600">Shortlisted</span>
            <div className="p-2 bg-slate-100 rounded-md"><Star size={16} className="text-slate-600" /></div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">42</h2>
            <p className="text-xs text-slate-500 mt-1">12% of total</p>
          </div>
        </div>
      </div>

      {/* CV Processing Status */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-bold mb-1">CV Processing Status</h3>
            <p className="text-xs text-slate-500">259 of 345 CVs processed this cycle</p>
          </div>
          <span className="text-2xl font-bold">75%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
          <div className="bg-indigo-900 h-3 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Reviewed: 180</span>
          <span>Pending: 86</span>
          <span>Rejected: 79</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Bar Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold mb-1">Job Statistics</h3>
          <p className="text-xs text-slate-500 mb-4">Applications vs. Hires — last 6 months</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Applications" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar dataKey="Hires" fill="#1e3a8a" radius={[2, 2, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-300 rounded-sm"></div> Applications</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-900 rounded-sm"></div> Hires</div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div>
            <h3 className="text-sm font-bold mb-1">Candidate Skills</h3>
            <p className="text-xs text-slate-500 mb-4">Breakdown by primary skill area</p>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="h-48 w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={skillData} innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              {skillData.map((skill, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: skill.color }}></div>
                    <span className="text-slate-700 font-medium">{skill.name}</span>
                  </div>
                  <span className="text-slate-500">{skill.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Candidates Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold">Recent Candidates</h3>
          {/* Navigate to candidates list view */}
          <button onClick={() => navigate('/candidates')} className="text-xs font-bold text-slate-700 hover:underline cursor-pointer">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-600">
                <th className="p-4 font-medium">Candidate</th>
                <th className="p-4 font-medium">Applied For</th>
                <th className="p-4 font-medium text-center">AI Match</th>
                <th className="p-4 font-medium text-center">Recommendation</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">H</div>
                  <span className="font-medium">Harshani</span>
                </td>
                <td className="p-4 text-slate-600">Frontend Engineer</td>
                <td className="p-4 text-center">
                  <CircularProgress value={98} color="#22c55e" />
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block w-36 py-1.5 bg-green-400 text-white rounded-md text-xs font-medium">Highly Recommended</span>
                </td>
                <td className="p-4 text-center">
                  {/* Navigate to Harshani's specific profile */}
                  <button onClick={() => navigate('/candidates', { state: { candidateName: 'Harshani' } })} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer">View Profile</button>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-xs">D</div>
                  <span className="font-medium">Diluni</span>
                </td>
                <td className="p-4 text-slate-600">DevOps Engineer</td>
                <td className="p-4 text-center">
                  <CircularProgress value={75} color="#f59e0b" />
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block w-36 py-1.5 bg-yellow-400 text-white rounded-md text-xs font-medium">Recommended</span>
                </td>
                <td className="p-4 text-center">
                  {/* Navigate to Diluni's specific profile */}
                  <button onClick={() => navigate('/candidates', { state: { candidateName: 'Diluni' } })} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer">View Profile</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">R</div>
                  <span className="font-medium">Rovindu</span>
                </td>
                <td className="p-4 text-slate-600">Backend Engineer</td>
                <td className="p-4 text-center">
                   <CircularProgress value={51} color="#ef4444" />
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block w-36 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium">Not Recommended</span>
                </td>
                <td className="p-4 text-center">
                  {/* Navigate to Rovindu's specific profile */}
                  <button onClick={() => navigate('/candidates', { state: { candidateName: 'Rovindu' } })} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer">View Profile</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}