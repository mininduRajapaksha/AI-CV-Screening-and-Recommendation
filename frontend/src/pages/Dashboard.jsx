import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Users, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// Helper function to assign dynamic UI colors based on AI recommendation
const getStatusStyles = (rec) => {
  if (rec === "Highly Recommended") return { color: "#22c55e", bg: "bg-green-400", initialBg: "bg-slate-700" };
  if (rec === "Recommended") return { color: "#f59e0b", bg: "bg-yellow-400", initialBg: "bg-indigo-900" };
  return { color: "#ef4444", bg: "bg-red-500", initialBg: "bg-slate-800" };
};

// Mock data for charts (can be updated later via API)
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

const skillData = [
  { name: 'React / Frontend', value: 38, color: '#1e3a8a' },
  { name: 'Backend / Node', value: 27, color: '#4f46e5' },
  { name: 'Design / UI', value: 18, color: '#3b82f6' },
  { name: 'Data / Analytics', value: 11, color: '#0ea5e9' },
  { name: 'DevOps / Infra', value: 6, color: '#38bdf8' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  // States to store both statistics and the recent candidates list fetched from the backend
  const [stats, setStats] = useState({ totalJobs: 0, totalCandidates: 0, processingCount: 0 });
  const [recentCandidates, setRecentCandidates] = useState([]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetching Top Statistics
        const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats');
        if(statsRes.data.success) {
            setStats(statsRes.data.data);
        }
        
        // 2. Fetching Recent Candidates (Job ID 1)
        const candidatesRes = await axios.get('http://localhost:5000/api/candidates/job/1');
        if(candidatesRes.data.success) {
            // Get the latest candidates and show only the top 3 on the dashboard
            const sorted = candidatesRes.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecentCandidates(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full text-slate-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of candidate applications, active jobs, and AI analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-600">Total Active Jobs</span>
            <div className="p-2 bg-indigo-50 rounded-md"><Briefcase size={16} className="text-indigo-600" /></div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">{stats.totalJobs || 0}</h2>
            <p className="text-xs text-green-500 mt-1">Live from database</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-600">Total Candidates</span>
            <div className="p-2 bg-indigo-50 rounded-md"><Users size={16} className="text-indigo-600" /></div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">{stats.totalCandidates || 0}</h2>
            <p className="text-xs text-green-500 mt-1">Processed CVs</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-600">Shortlisted</span>
            <div className="p-2 bg-indigo-50 rounded-md"><Star size={16} className="text-indigo-600" /></div>
          </div>
          <div className="mt-4">
            {/* Hardcoded for now as Dashboard API lacks shortlisted count calculation */}
            <h2 className="text-3xl font-bold">42</h2>
            <p className="text-xs text-slate-400 mt-1">12% of total</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-bold mb-1">CV Processing Status</h3>
            <p className="text-xs text-slate-500">All {stats.totalCandidates || 0} CVs processed this cycle</p>
          </div>
          <span className="text-2xl font-bold">100%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
          <div className="bg-indigo-900 h-3 rounded-full" style={{ width: '100%' }}></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Reviewed: {stats.totalCandidates || 0}</span>
          <span>Pending: 0</span>
          <span>Rejected: 0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold mb-1">Job Statistics</h3>
          <p className="text-xs text-slate-500 mb-4">Applications vs. Hires — last 6 months</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Applications" fill="#1e293b" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar dataKey="Hires" fill="#6366f1" radius={[2, 2, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> Applications</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Hires</div>
          </div>
        </div>

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

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="pl-6 pr-16 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold">Recent Candidates</h3>
          <button onClick={() => navigate('/candidates')} className="text-xs font-bold text-slate-700 hover:underline cursor-pointer">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-600">
                <th className="p-4 font-medium pl-6">Candidate</th>
                <th className="p-4 font-medium">Applied For</th>
                <th className="p-4 font-medium text-center">AI Match</th>
                <th className="p-4 font-medium text-center">Recommendation</th>
                <th className="p-4 font-medium text-center pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentCandidates.length > 0 ? (
                recentCandidates.map((candidate, index) => {
                  const styles = getStatusStyles(candidate.aiRecommendation);
                  const cName = candidate.personalInfo?.name || candidate.name || "Unknown";
                  return (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${styles.initialBg} text-white flex items-center justify-center font-bold text-xs`}>
                          {cName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{cName}</span>
                      </td>
                      <td className="p-4 text-slate-600">Software Engineer</td>
                      <td className="p-4 text-center">
                        <CircularProgress value={candidate.matchPercentage} color={styles.color} />
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block w-36 py-1.5 ${styles.bg} text-white rounded-md text-xs font-medium`}>
                          {candidate.aiRecommendation}
                        </span>
                      </td>
                      <td className="p-4 text-center pr-6">
                        {/* UPDATE: Passing the specific candidate data through React Router state */}
                        <button 
                          onClick={() => navigate('/candidates', { state: { candidateData: candidate } })} 
                          className="px-4 py-1.5 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 bg-white rounded-full text-xs font-medium transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No recent candidates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}