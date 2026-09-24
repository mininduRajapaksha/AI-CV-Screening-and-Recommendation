import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ChevronDown, Download, ArrowLeft, CheckCircle, AlertCircle, Briefcase, GraduationCap, Mail, Phone } from 'lucide-react'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Larger Circular progress bar component for profile view
const LargeCircularProgress = ({ value, color }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="transparent" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-slate-800">{value}%</span>
    </div>
  );
};

// Circular progress bar component for table
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

// Expanded Dummy data for candidates including profile details
const candidatesData = [
  { 
    rank: "#01", 
    name: "Harshani", 
    role: "Frontend Engineer", 
    match: 98, 
    rec: "Highly Recommended", 
    color: "#22c55e", 
    bg: "bg-green-400",
    email: "harshani@email.com",
    phone: "+94 77 900 1234",
    initial: "H",
    initialBg: "bg-slate-700",
    justification: "Harshani demonstrates an exceptional alignment with the Frontend Engineer role. Her 4 years of dedicated UI development, mastery of React and Figma, and a portfolio of pixel-perfect implementations account for the near-perfect match score. The minor gaps in AWS and Node.js are non-critical for a frontend-focused position and can be addressed with light onboarding.",
    matchedSkills: ["React", "HTML/CSS", "Figma"],
    missingSkills: ["AWS", "Node.js"],
    experience: [
      { title: "UI Developer", duration: "4 Years", company: "Webcraft Studios" },
      { title: "Junior Frontend Developer", duration: "1 Year", company: "TechBridge Pvt Ltd" }
    ],
    education: [
      { degree: "BSc Computer Science", institution: "University of Colombo - 2025" }
    ]
  },
  { 
    rank: "#02", 
    name: "Kasun", 
    role: "UI/UX Designer", 
    match: 92, 
    rec: "Highly Recommended", 
    color: "#22c55e", 
    bg: "bg-green-400",
    email: "kasun@email.com",
    phone: "+94 71 234 5678",
    initial: "K",
    initialBg: "bg-blue-700",
    justification: "Kasun shows strong expertise in UI/UX design principles with extensive experience using Figma and Adobe XD. His portfolio reflects excellent user-centered design methodologies.",
    matchedSkills: ["Figma", "UI/UX", "Wireframing"],
    missingSkills: ["Frontend Code"],
    experience: [
      { title: "Senior UI/UX Designer", duration: "3 Years", company: "DesignHub" }
    ],
    education: [
      { degree: "BA in Interactive Design", institution: "University of Moratuwa - 2023" }
    ]
  },
  { 
    rank: "#03", 
    name: "Pabudi", 
    role: "Data Analyst", 
    match: 78, 
    rec: "Recommended", 
    color: "#f59e0b", 
    bg: "bg-yellow-400",
    email: "pabudi@email.com",
    phone: "+94 76 345 6789",
    initial: "P",
    initialBg: "bg-amber-700",
    justification: "Pabudi has good data analysis skills and proficiency in SQL and Python. Recommended for a mid-level data role.",
    matchedSkills: ["Python", "SQL", "Excel"],
    missingSkills: ["Tableau", "Spark"],
    experience: [
      { title: "Data Analyst", duration: "2 Years", company: "DataMetrics" }
    ],
    education: [
      { degree: "BSc Statistics", institution: "University of Kelaniya - 2024" }
    ]
  },
  { 
    rank: "#04", 
    name: "Diluni", 
    role: "DevOps Engineer", 
    match: 75, 
    rec: "Recommended", 
    color: "#f59e0b", 
    bg: "bg-yellow-400",
    email: "diluni@email.com",
    phone: "+94 70 456 7890",
    initial: "D",
    initialBg: "bg-indigo-900",
    justification: "Diluni possesses solid cloud infrastructure knowledge, specifically with Docker and basic AWS administration.",
    matchedSkills: ["Docker", "Linux", "AWS"],
    missingSkills: ["Kubernetes", "Terraform"],
    experience: [
      { title: "Junior DevOps Engineer", duration: "1.5 Years", company: "CloudOps Lanka" }
    ],
    education: [
      { degree: "BSc IT", institution: "SLIIT - 2024" }
    ]
  },
  { 
    rank: "#05", 
    name: "Kaushi", 
    role: "Frontend Engineer", 
    match: 62, 
    rec: "Not Recommended", 
    color: "#ef4444", 
    bg: "bg-red-500",
    email: "kaushi@email.com",
    phone: "+94 75 567 8901",
    initial: "K",
    initialBg: "bg-rose-700",
    justification: "Kaushi lacks sufficient hands-on experience in modern frontend frameworks required for this senior position.",
    matchedSkills: ["HTML/CSS", "JavaScript"],
    missingSkills: ["React", "Redux", "TypeScript"],
    experience: [
      { title: "Web Intern", duration: "6 Months", company: "Local Web Agency" }
    ],
    education: [
      { degree: "Diploma in IT", institution: "NIBM - 2025" }
    ]
  },
  { 
    rank: "#06", 
    name: "Rovindu", 
    role: "Backend Engineer", 
    match: 51, 
    rec: "Not Recommended", 
    color: "#ef4444", 
    bg: "bg-red-500",
    email: "rovindu@email.com",
    phone: "+94 78 678 9012",
    initial: "R",
    initialBg: "bg-slate-800",
    justification: "Rovindu's background is primarily in legacy systems, showing significant gaps in modern Node.js and database architecture.",
    matchedSkills: ["PHP", "MySQL"],
    missingSkills: ["Node.js", "MongoDB", "Microservices"],
    experience: [
      { title: "Backend Developer", duration: "1 Year", company: "SoftSolutions" }
    ],
    education: [
      { degree: "BSc Computer Systems", institution: "APIIT - 2024" }
    ]
  }
];

export default function Candidates() {
  const location = useLocation(); 
  
  const initialCandidateName = location.state?.candidateName;
  const initialCandidate = initialCandidateName 
    ? candidatesData.find(c => c.name === initialCandidateName) 
    : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRec, setFilterRec] = useState("All Recommended");
  const [filterJob, setFilterJob] = useState("All Jobs");
  const [selectedCandidate, setSelectedCandidate] = useState(initialCandidate); 

  const uniqueJobs = ["All Jobs", ...new Set(candidatesData.map(c => c.role))];
  const recOptions = ["All Recommended", "Highly Recommended", "Recommended", "Not Recommended"];

  const filteredCandidates = candidatesData.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          candidate.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRec = filterRec === "All Recommended" || candidate.rec === filterRec;
    const matchesJob = filterJob === "All Jobs" || candidate.role === filterJob;

    return matchesSearch && matchesRec && matchesJob;
  });

  const handleExportCSV = () => {
    const headers = ["Rank", "Candidate Name", "Applied For", "AI Match (%)", "Recommendation"];
    const rows = filteredCandidates.map(c => [c.rank, c.name, c.role, c.match, c.rec]);
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("AI Candidates Report", 14, 15);
    
    const tableColumn = ["Rank", "Candidate Name", "Applied For", "AI Match (%)", "Recommendation"];
    const tableRows = [];

    filteredCandidates.forEach(candidate => {
      const candidateData = [
        candidate.rank,
        candidate.name,
        candidate.role,
        candidate.match,
        candidate.rec
      ];
      tableRows.push(candidateData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("candidates_report.pdf");
  };

  // --- CANDIDATE PROFILE VIEW ---
  if (selectedCandidate) {
    return (
      <div className="w-full text-slate-800">
        
        {/* Back Button */}
        <button 
          onClick={() => setSelectedCandidate(null)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-900 mb-6 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Candidates
        </button>

        {/* Candidate Header Card */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-full ${selectedCandidate.initialBg || 'bg-slate-700'} text-white flex items-center justify-center font-bold text-xl mt-1`}>
              {selectedCandidate.initial || selectedCandidate.name[0]}
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-slate-800">{selectedCandidate.name}</h2>
              
              <div className="flex flex-col gap-2 text-xs text-slate-600 mt-1">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-500" />
                  <span>Applied For: <span className="font-medium">{selectedCandidate.role}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-500" />
                  <span>{selectedCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-500" />
                  <span>{selectedCandidate.phone || "+94 77 900 1234"}</span>
                </div>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer mt-4 md:mt-0">
            <Download size={16} />
            Download CV
          </button>
        </div>

        {/* Main Grid for Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: AI Evaluation & Justification */}
          {/* මෙහි space-y-6 වෙනුවට space-y-4 භාවිතා කර ඇත */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-4">AI Evaluation</h3>
              <div className="flex flex-col items-center justify-center py-4 mb-2">
                <div className="my-2">
                  <LargeCircularProgress value={selectedCandidate.match} color={selectedCandidate.color} />
                </div>
                <span className={`mt-5 px-6 py-2.5 ${selectedCandidate.bg} text-white rounded-lg text-sm font-bold shadow-sm`}>
                  {selectedCandidate.rec}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-3">AI Justification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedCandidate.justification}
              </p>
            </div>
          </div>

          {/* Right Column: Skills, Experience & Education */}
          {/* මෙහිද space-y-4 භාවිතා කර ඇත සමමිතිය සඳහා */}
          <div className="space-y-4">
            
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-4">Skills & Experience</h3>
              
              {/* Matched Skills */}
              <div className="mb-5">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mb-3">
                  <CheckCircle size={14} className="text-green-600" /> Matched Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.matchedSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-1.5 bg-[#e0e7ff] text-[#4338ca] rounded-md text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mb-3">
                  <AlertCircle size={14} className="text-red-500" /> Missing Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.missingSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-1.5 bg-[#ffe4e6] text-[#e11d48] rounded-md text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience & Education */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-5">Experience & Education</h3>
              
              <div className="space-y-5 text-xs">
                {selectedCandidate.experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4a638b] shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[13px]">{exp.title}</h4>
                      <p className="text-slate-500 mt-1">{exp.duration} - {exp.company}</p>
                    </div>
                  </div>
                ))}

                {selectedCandidate.education.map((edu, i) => (
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
          <div className="mt-2"><h2 className="text-2xl font-bold">342</h2></div>
          <p className="text-xs text-slate-500 mt-1">+28 this week</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Highly Recommended</span>
          <div className="mt-2"><h2 className="text-2xl font-bold">25</h2></div>
          <p className="text-xs text-slate-500 mt-1">Top 7% of applicants</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Average Match</span>
          <div className="mt-2"><h2 className="text-2xl font-bold">70%</h2></div>
          <p className="text-xs text-slate-500 mt-1">Across all applications</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Shortlisted</span>
          <div className="mt-2"><h2 className="text-2xl font-bold">42</h2></div>
          <p className="text-xs text-slate-500 mt-1">12% of total</p>
        </div>
      </div>

      {/* Enhanced Search Bar and Filters Area */}
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
            {recOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
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
            {uniqueJobs.map((job, i) => (
              <option key={i} value={job}>{job}</option>
            ))}
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
                filteredCandidates.map((candidate, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-600">{candidate.rank}</td>
                    <td className="p-4 text-center font-medium">{candidate.name}</td>
                    <td className="p-4 text-center text-slate-600">{candidate.role}</td>
                    <td className="p-4 text-center">
                      <CircularProgress value={candidate.match} color={candidate.color} />
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block w-40 py-1.5 ${candidate.bg} text-white rounded-md text-xs font-medium`}>
                        {candidate.rec}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedCandidate(candidate)}
                        className="px-4 py-1.5 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 bg-white rounded-full text-xs font-medium transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No candidates found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors shadow-sm cursor-pointer"
        >
          <Download size={16} />
          Export CSV
        </button>
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors shadow-sm cursor-pointer"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>

    </div>
  );
}