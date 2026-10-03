import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Phone, GraduationCap, Briefcase, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import ProgressRing from '../components/ui/ProgressRing';
import StatusPill from '../components/ui/StatusPill';

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

  const matchPercent = Number(candidate.matchPercent) || 0;
  const rank = candidate.rank || '-';
  const hasMissingSkills = Array.isArray(candidate.missingSkills) && candidate.missingSkills.length > 0;

  // Object එකක් ආවොත් ඒකෙන් අකුරු විතරක් වෙන් කරගන්න හදපු function එක
  const formatData = (data) => {
    if (!data) return 'N/A';
    if (typeof data === 'string') return data;
    
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'object') {
          return item.degree || item.title || item.role || item.institution || item.company || 'Unknown';
        }
        return item;
      }).join(', ');
    }
    
    if (typeof data === 'object') {
      return data.degree || data.title || data.role || data.institution || data.company || JSON.stringify(data);
    }
    
    return String(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{candidate.name || 'Unknown Candidate'}</h1>
          <p className="text-sm text-slate-500">{candidate.appliedRole || 'Role not specified'}</p>
        </div>
        <StatusPill value={candidate.recommendation || 'Pending'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col items-center">
          <ProgressRing value={matchPercent} size={120} />
          <p className="text-sm text-slate-500 mt-4">AI Match Percentage</p>
          <p className="text-xs text-slate-400 mt-1">Rank #{rank}</p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> Missing Skills
          </h2>
          {hasMissingSkills ? (
            <div className="flex flex-wrap gap-2">
              {candidate.missingSkills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">{s}</span>
              ))}
            </div>
          ) : (
             <p className="text-sm text-emerald-600 flex items-center gap-2">
               <CheckCircle2 size={16} /> No missing skills — strong match on all requirements
             </p>
          )}
        </div>

        <div className="card p-6 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Info icon={Mail} label="Email">{candidate.email || 'N/A'}</Info>
          <Info icon={Phone} label="Phone">{candidate.phone || 'N/A'}</Info>
          {/* මෙතනදී අපි අර අලුතින් හදපු formatData function එක පාවිච්චි කරනවා */}
          <Info icon={GraduationCap} label="Education">{formatData(candidate.education)}</Info>
          <Info icon={Briefcase} label="Experience">{formatData(candidate.experience)}</Info>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-slate-600" />
      </div>
      <div>
        <div className="text-xs uppercase text-slate-400 font-semibold">{label}</div>
        <div className="text-sm text-slate-800 mt-0.5">{children}</div>
      </div>
    </div>
  );
}