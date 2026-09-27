import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronDown, Download, ArrowLeft, CheckCircle, AlertCircle, Briefcase, GraduationCap, Mail, Phone } from 'lucide-react'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Component for the large circular progress bar in the profile view
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

// Component for the small circular progress bar in the candidates table
const CircularProgress = ({ value, color }) => {
  const radius = 15.9155;
  const circumference = 100;
  const strokeDashoffset = circumference - value;
  return (
    <div className="relative w-10 h-10 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="18" cy="18" r={radius} fill="transparent" stroke={color} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-700">{value}%</span>
    </div>
  );
};

// Helper function to dynamically assign UI colors based on AI recommendation
const getStatusStyles = (rec) => {
  if (rec === "Highly Recommended") return { color: "#22c55e", bg: "bg-green-400", initialBg: "bg-slate-700" };
  if (rec === "Recommended") return { color: "#f59e0b", bg: "bg-yellow-400", initialBg: "bg-blue-700" };
  return { color: "#ef4444", bg: "bg-red-500", initialBg: "bg-slate-800" };
};

export default function Candidates() {
  const location = useLocation(); 
  
  // State variables for candidates data, UI selections, and search/filters
  const [candidatesList, setCandidatesList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRec, setFilterRec] = useState("All Recommended");
  const [filterJob, setFilterJob] = useState("All Jobs");

  // Options for filter dropdowns
  const recOptions = ["All Recommended", "Highly Recommended", "Recommended", "Not Recommended"];
  const uniqueJobs = ["All Jobs", "Software Engineer", "UI/UX Designer", "DevOps Engineer"]; 

  // Fetch Candidates List from Backend on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/candidates/job/1');
        if(response.data.success) {
            // Sorting candidates by Match Percentage (Highest to Lowest)
            const sortedCandidates = response.data.data.sort((a, b) => b.matchPercentage - a.matchPercentage);
            setCandidatesList(sortedCandidates);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  // Fetch specific candidate profile data when "View Profile" is clicked
  const handleViewProfile = async (candidate) => {
    try {
        // Safe check for MongoDB _id or fallback to id
        const candidateId = candidate._id || candidate.id;
        const response = await axios.get(`http://localhost:5000/api/candidates/${candidateId}`);
        if(response.data.success) {
            const profileData = response.data.data;
            const cName = candidate.personalInfo?.name || candidate.name || 'Unknown Candidate';
            
            // Ensure personalInfo exists before assigning
            if (!profileData.personalInfo) profileData.personalInfo = {};
            
            profileData.personalInfo.name = cName;
            profileData.matchPercentage = candidate.matchPercentage;
            profileData.aiRecommendation = candidate.aiRecommendation;
            profileData.personalInfo.email = candidate.personalInfo?.email || `${cName.split(' ')[0].toLowerCase()}@example.com`;
            
            setSelectedCandidate(profileData);
        }
    } catch (error) {
        console.error("Error fetching profile details:", error);
    }
  };

  // UPDATE: Auto-open profile if navigated from Dashboard with specific candidate data
  useEffect(() => {
    if (location.state && location.state.candidateData) {
      handleViewProfile(location.state.candidateData);
    }
  }, [location.state]);

  // Filter logic for the candidates table based on search query and recommendation filter
  const filteredCandidates = candidatesList.filter((candidate) => {
    const cName = candidate.personalInfo?.name || candidate.name || "";
    const matchesSearch = cName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRec = filterRec === "All Recommended" || candidate.aiRecommendation === filterRec;
    return matchesSearch && matchesRec;
  });

  // Export current table view to CSV
  const handleExportCSV = () => {
    const headers = ["Rank", "Candidate Name", "Applied For", "AI Match (%)", "Recommendation"];
    const rows = filteredCandidates.map((c, i) => {
      const cName = c.personalInfo?.name || c.name || "Unknown";
      return [`#0${i+1}`, cName, "Software Engineer", c.matchPercentage, c.aiRecommendation];
    });
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "candidates_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export current table view to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("AI Candidates Report", 14, 15);
    const tableColumn = ["Rank", "Candidate Name", "Applied For", "AI Match (%)", "Recommendation"];
    const tableRows = filteredCandidates.map((c, i) => {
      const cName = c.personalInfo?.name || c.name || "Unknown";
      return [`#0${i+1}`, cName, "Software Engineer", c.matchPercentage, c.aiRecommendation];
    });
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("candidates_report.pdf");
  };

  // Dynamic statistics calculations based on fetched backend data
  const totalCandidates = candidatesList.length;
  const highlyRecommendedCount = candidatesList.filter(c => c.aiRecommendation === "Highly Recommended").length;
  const averageMatch = totalCandidates > 0 ? Math.round(candidatesList.reduce((acc, c) => acc + c.matchPercentage, 0) / totalCandidates) : 0;
  const shortlistedCount = candidatesList.filter(c => c.aiRecommendation === "Highly Recommended" || c.aiRecommendation === "Recommended").length;

  // --- CANDIDATE PROFILE VIEW ---
  if (selectedCandidate) {
    const styles = getStatusStyles(selectedCandidate.aiRecommendation);
    
    // UI Fallbacks for detailed data missing from the current backend API response
    const matchedSkills = selectedCandidate.matchedSkills || ["React", "Node.js", "MongoDB"];
    const missingSkills = selectedCandidate.missingSkills || ["Docker", "Kubernetes"];
    const experience = selectedCandidate.experience || [{ title: "Software Engineer", duration: "2 Years", company: "Tech Solutions" }];
    const education = selectedCandidate.education || [{ degree: "BSc Computer Science", institution: "UCSC - 2023" }];

    return (
      <div className="w-full text-slate-800">
        <button onClick={() => setSelectedCandidate(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-900 mb-6 cursor-pointer transition-colors">
          <ArrowLeft size={16} /> Back to Candidates
        </button>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-full ${styles.initialBg} text-white flex items-center justify-center font-bold text-xl mt-1`}>
              {selectedCandidate.personalInfo?.name?.[0] || 'C'}
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-slate-800">{selectedCandidate.personalInfo?.name}</h2>
              <div className="flex flex-col gap-2 text-xs text-slate-600 mt-1">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-500" />
                  <span>Applied For: <span className="font-medium">Software Engineer</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-500" />
                  <span>{selectedCandidate.personalInfo?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-500" />
                  <span>{selectedCandidate.personalInfo?.phone || "N/A"}</span>
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
                  <LargeCircularProgress value={selectedCandidate.matchPercentage} color={styles.color} />
                </div>
                <span className={`mt-5 px-6 py-2.5 ${styles.bg} text-white rounded-lg text-sm font-bold shadow-sm`}>
                  {selectedCandidate.aiRecommendation}
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-3">AI Justification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedCandidate.justification}</p>
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
                  {matchedSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-1.5 bg-[#e0e7ff] text-[#4338ca] rounded-md text-xs font-semibold">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mb-3">
                  <AlertCircle size={14} className="text-red-500" /> Missing Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-1.5 bg-[#ffe4e6] text-[#e11d48] rounded-md text-xs font-semibold">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-5">Experience & Education</h3>
              <div className="space-y-5 text-xs">
                {experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4a638b] shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[13px]">{exp.title}</h4>
                      <p className="text-slate-500 mt-1">{exp.duration} - {exp.company}</p>
                    </div>
                  </div>
                ))}
                {education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4a638b] shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[13px]">{edu.degree}</h4>
                      <p className="text-slate-500 mt-1">{edu.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CANDIDATES LIST VIEW ---
  return (
    <div className="w-full text-slate-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
        <p className="text-sm text-slate-500 mt-1">AI ranked results for your selected job posting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Total Candidate</span>
          <div className="mt-2"><h2 className="text-2xl font-bold">{totalCandidates}</h2></div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Highly Recommended</span>
          <div className="mt-2"><h2 className="text-2xl font-bold">{highlyRecommendedCount}</h2></div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Average Match</span>
          <div className="mt-2"><h2 className="text-2xl font-bold">{averageMatch}%</h2></div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Shortlisted</span>
          <div className="mt-2"><h2 className="text-2xl font-bold">{shortlistedCount}</h2></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-xl border border-slate-100">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search by name or skill........." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-56">
          <select 
            className="w-full appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-600 font-medium"
            value={filterRec}
            onChange={(e) => setFilterRec(e.target.value)}
          >
            {recOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
        <div className="relative w-full md:w-56">
          <select 
            className="w-full appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-600 font-medium"
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
          >
            {uniqueJobs.map((job, i) => <option key={i} value={job}>{job}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-600">
                <th className="p-4 font-bold">Rank</th>
                <th className="p-4 font-bold text-center">Candidate</th>
                <th className="p-4 font-bold text-center">Applied For</th>
                <th className="p-4 font-bold text-center">AI Match</th>
                <th className="p-4 font-bold text-center">Recommendation</th>
                <th className="p-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate, index) => {
                  const styles = getStatusStyles(candidate.aiRecommendation);
                  const cName = candidate.personalInfo?.name || candidate.name || "Unknown";
                  return (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-600">#0{index + 1}</td>
                      <td className="p-4 text-center font-medium">{cName}</td>
                      <td className="p-4 text-center text-slate-600">Software Engineer</td>
                      <td className="p-4 text-center">
                        <CircularProgress value={candidate.matchPercentage} color={styles.color} />
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block w-40 py-1.5 ${styles.bg} text-white rounded-md text-xs font-medium`}>
                          {candidate.aiRecommendation}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleViewProfile(candidate)}
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
                  <td colSpan="6" className="p-8 text-center text-slate-500">No candidates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors shadow-sm cursor-pointer">
          <Download size={16} /> Export CSV
        </button>
        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors shadow-sm cursor-pointer">
          <Download size={16} /> Export PDF
        </button>
      </div>
    </div>
  );
}