import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Phone, Briefcase, CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react';

// UI Component for the circular progress from Candidates.jsx
const LargeCircularProgress = ({ value, color }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-2xl font-bold text-slate-800">{value}%</span>
    </div>
  );
};

// Dynamic styles based on recommendation from Candidates.jsx
const getStatusStyles = (rec) => {
  if (rec === "Highly Recommended") return { color: "#22c55e", bg: "bg-green-400", initialBg: "bg-slate-700" };
  if (rec === "Recommended") return { color: "#f59e0b", bg: "bg-yellow-400", initialBg: "bg-blue-700" };
  return { color: "#ef4444", bg: "bg-red-500", initialBg: "bg-slate-800" };
};

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/candidates/${candidateId}`);
        
        const data = res.data?.data || res.data;
        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            throw new Error("Invalid data format received from the server.");
        }
        setCandidate(data);
      } catch (err) {
        console.error("Error fetching candidate details:", err);
        setError("Failed to load candidate details. Check if the backend API endpoint exists.");
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) fetchCandidateDetails();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Loader2 className="animate-spin text-navy-900 mb-2" size={32} />
        <p className="text-sm">Loading Candidate Profile...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm m-6">
        {error || 'Candidate not found in the database.'}
      </div>
    );
  }

  // Safe formatting to ensure arrays are handled correctly for the new layout
  const formatDataList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        return [{ title: data, degree: data }];
    }
    return [data];
  };

  const matchPercent = Number(candidate.matchPercent || candidate.matchPercentage) || 0;
  const recommendation = candidate.recommendation || candidate.aiRecommendation || 'Pending';
  const styles = getStatusStyles(recommendation);
  
  const cName = candidate.name || candidate.personalInfo?.name || 'Unknown Candidate';
  const cEmail = candidate.email || candidate.personalInfo?.email || 'N/A';
  const cPhone = candidate.phone || candidate.personalInfo?.phone || 'N/A';
  
  const matchedSkills = Array.isArray(candidate.matchedSkills) ? candidate.matchedSkills : [];
  const missingSkills = Array.isArray(candidate.missingSkills) ? candidate.missingSkills : [];
  
  const experienceList = formatDataList(candidate.experience);
  const educationList = formatDataList(candidate.education);

  return (
    <div className="w-full text-slate-800">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-900 mb-6 cursor-pointer transition-colors">
        <ArrowLeft size={16} /> Back to Candidates
      </button>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-5">
          <div className={`w-14 h-14 rounded-full ${styles.initialBg} text-white flex items-center justify-center font-bold text-xl mt-1`}>
            {cName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-slate-800">{cName}</h2>
            <div className="flex flex-col gap-2 text-xs text-slate-600 mt-1">
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-slate-500" />
                <span>Applied For: <span className="font-medium">{candidate.appliedRole || "Software Engineer"}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-500" />
                <span>{cEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-500" />
                <span>{cPhone}</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => alert("CV file download API feature will be linked soon!")} 
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer mt-4 md:mt-0"
        >
          <Download size={16} /> Download CV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold mb-4">AI Evaluation</h3>
            <div className="flex flex-col items-center justify-center py-4 mb-2">
              <div className="my-2">
                <LargeCircularProgress value={matchPercent} color={styles.color} />
              </div>
              <span className={`mt-5 px-6 py-2.5 ${styles.bg} text-white rounded-lg text-sm font-bold shadow-sm`}>
                {recommendation}
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold mb-3">AI Justification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{candidate.justification || "No AI justification provided yet."}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold mb-4">Skills & Experience</h3>
            
            <div className="mb-5">
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mb-3">
                <CheckCircle size={14} className="text-green-600" /> Matched Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.length > 0 ? matchedSkills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 bg-[#e0e7ff] text-[#4338ca] rounded-md text-xs font-semibold">{skill}</span>
                )) : <span className="text-slate-500 text-xs">No matched skills recorded.</span>}
              </div>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mb-3">
                <AlertCircle size={14} className="text-red-500" /> Missing Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 bg-[#ffe4e6] text-[#e11d48] rounded-md text-xs font-semibold">{skill}</span>
                )) : <span className="text-slate-500 text-xs">No missing skills recorded.</span>}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold mb-5">Experience & Education</h3>
            <div className="space-y-5 text-xs">
              {experienceList.length > 0 ? experienceList.map((exp, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4a638b] shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[13px]">{exp.title || exp.role || 'Professional Experience'}</h4>
                    <p className="text-slate-500 mt-1">{exp.duration || ''} {exp.company ? `- ${exp.company}` : ''}</p>
                  </div>
                </div>
              )) : <p className="text-slate-500">No experience details available.</p>}
              
              {educationList.length > 0 ? educationList.map((edu, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4a638b] shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[13px]">{edu.degree || edu.title || 'Educational Qualification'}</h4>
                    <p className="text-slate-500 mt-1">{edu.institution || ''}</p>
                  </div>
                </div>
              )) : <p className="text-slate-500">No education details available.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}