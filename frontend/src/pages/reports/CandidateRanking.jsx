import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search, Filter, ChevronLeft, User } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Toggle from '../../components/ui/Toggle'
import { useJobs } from '../../context/JobContext'

function MatchRing({ value }) {
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444'
  const radius = 16, circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="relative w-10 h-10">
      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <circle cx="20" cy="20" r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-navy">{value}%</span>
    </div>
  )
}

function StatCard({ label, value, sub, iconColor }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-navy mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}><User className="w-5 h-5" /></div>
      </div>
    </div>
  )
}

export default function CandidateRanking() {
  const { id } = useParams()
  const { getJob, getCandidates } = useJobs()
  const job = getJob(id)
  const candidates = getCandidates(id)

  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [recFilters, setRecFilters] = useState({ 'Highly Recommended': true, 'Recommended': true, 'Not Recommended': false })
  const [showCsv, setShowCsv] = useState(false)
  const [showPdf, setShowPdf] = useState(false)

  const [csvCols, setCsvCols] = useState({ rank: true, appliedRole: true, recLevel: true, email: true, name: true, match: true, dateApplied: true })
  const [csvName, setCsvName] = useState('senior_product_designer_ranking_2026.csv')
  const [pdfTitle, setPdfTitle] = useState('Senior Product Designer - Evaluation Summary')
  const [pdfOrientation, setPdfOrientation] = useState('Portrait')
  const [pdfCharts, setPdfCharts] = useState(true)
  const [pdfBranding, setPdfBranding] = useState(true)
  const [pdfEmails, setPdfEmails] = useState(false)

  const filtered = useMemo(() => {
    return candidates.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (recFilters[c.recommendation] !== false)
    )
  }, [candidates, search, recFilters])

  const stats = { total: 342, highly: 25, avg: 70, shortlisted: 42 }
  const recVariant = { 'Highly Recommended': 'success', 'Recommended': 'warning', 'Not Recommended': 'danger' }

  return (
    <Layout topbarTitle={`Evaluation Reports / ${job?.title || 'Senior Product Designer'}`}>
      <Link to="/reports" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-navy mb-3">
        <ChevronLeft className="w-4 h-4" /> Back to Reports
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">AI Matching & Candidate Ranking</h2>
          <p className="text-sm text-gray-500 mt-1">AI-ranked candidates optimized for the {job?.title} profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowCsv(true)}>Export CSV</Button>
          <Button variant="coral" onClick={() => setShowPdf(true)}>Generate PDF Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Applicants" value={stats.total} sub="+28 this week" iconColor="bg-blue-50 text-navy" />
        <StatCard label="Highly Recommended" value={stats.highly} sub="Top 7% of applicants" iconColor="bg-green-50 text-green-600" />
        <StatCard label="Average Match %" value={`${stats.avg}%`} sub="Across all applications" iconColor="bg-purple-50 text-purple-600" />
        <StatCard label="Shortlisted" value={stats.shortlisted} sub="12% of total pipeline" iconColor="bg-amber-50 text-amber-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidate by name..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral/30" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="ml-auto flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className={`grid ${showFilters ? 'grid-cols-3' : 'grid-cols-1'}`}>
          <div className={showFilters ? 'col-span-2' : ''}>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">Candidate Name</th>
                  <th className="px-5 py-3">Applied For</th>
                  <th className="px-5 py-3">AI Match</th>
                  <th className="px-5 py-3">Recommendation</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                    <td className="px-5 py-4 text-gray-500 font-medium">#{String(c.rank).padStart(2, '0')}</td>
                    <td className="px-5 py-4 font-semibold text-navy">{c.name}</td>
                    <td className="px-5 py-4 text-gray-600">{c.appliedFor}</td>
                    <td className="px-5 py-4"><MatchRing value={c.match} /></td>
                    <td className="px-5 py-4"><Badge variant={recVariant[c.recommendation]}>{c.recommendation}</Badge></td>
                    <td className="px-5 py-4 text-right">
                      <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-navy hover:bg-gray-50">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showFilters && (
            <div className="border-l border-gray-100 p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-navy">Filters</h3>
                <button onClick={() => setRecFilters({ 'Highly Recommended': true, 'Recommended': true, 'Not Recommended': true })} className="text-xs text-coral font-semibold">Clear All</button>
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recommendation Level</p>
              <div className="space-y-2 mb-5">
                {['Highly Recommended', 'Recommended', 'Not Recommended'].map(r => (
                  <label key={r} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                    <input type="checkbox" checked={!!recFilters[r]} onChange={e => setRecFilters({ ...recFilters, [r]: e.target.checked })} className="accent-navy" /> {r}
                  </label>
                ))}
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">AI Match Range</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1"><span>50%</span><span>100%</span></div>
              <input type="range" min="50" max="100" defaultValue="100" className="w-full accent-coral mb-5" />

              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Experience Level</p>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-navy mb-5">
                <option>Senior (5-8 Years)</option>
              </select>

              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Must-Have Skills</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {['Figma', 'UI Design', 'React', 'Python', 'Prototyping'].map(s => (
                  <span key={s} className="px-2.5 py-1 bg-navy text-white text-xs font-medium rounded-full cursor-pointer">{s}</span>
                ))}
              </div>

              <Button variant="coral" className="w-full">Apply Filters</Button>
            </div>
          )}
        </div>
      </div>

      <Modal open={showCsv} onClose={() => setShowCsv(false)} maxWidth="max-w-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-navy mb-1">Export Candidates (CSV)</h2>
          <p className="text-xs text-gray-500 mb-5">Export AI grading results to an excel-friendly spreadsheet format.</p>

          <label className="block text-xs font-semibold text-navy mb-1.5">File Name</label>
          <input value={csvName} onChange={e => setCsvName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-5" />

          <p className="text-xs font-semibold text-navy mb-3">Columns to Include</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              ['rank', 'Rank'], ['name', 'Candidate Name'],
              ['appliedRole', 'Applied Role'], ['match', 'AI Match %'],
              ['recLevel', 'Recommendation Level'], ['dateApplied', 'Date Applied'],
              ['email', 'Email Contact']
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                <input type="checkbox" checked={csvCols[key]} onChange={e => setCsvCols({ ...csvCols, [key]: e.target.checked })} className="accent-navy" />
                {label}
              </label>
            ))}
          </div>

          <p className="text-xs font-semibold text-navy mb-2">Format Preview</p>
          <div className="bg-gray-50 rounded-lg p-3 text-[11px] font-mono text-gray-600 leading-relaxed mb-5">
            Rank, Name, Applied Role, AI Match, Status
            #01, Harshani, Senior Product Designer, 98%, Highly Recommended
            #02, Kasun, Senior Product Designer, 82%, Highly Recommended
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowCsv(false)}>Cancel</Button>
            <Button variant="coral" onClick={() => { setShowCsv(false); alert('CSV downloaded') }}>Export CSV</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showPdf} onClose={() => setShowPdf(false)} maxWidth="max-w-3xl">
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-navy mb-1">Generate PDF Report</h2>
            <p className="text-xs text-gray-500 mb-5">Produce an executive candidate rank summary report.</p>

            <label className="block text-xs font-semibold text-navy mb-1.5">Report Title</label>
            <input value={pdfTitle} onChange={e => setPdfTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-5" />

            <label className="block text-xs font-semibold text-navy mb-1.5">Page Orientation</label>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {['Portrait', 'Landscape'].map(o => (
                <button key={o} onClick={() => setPdfOrientation(o)}
                  className={`py-2 rounded-lg text-sm font-medium border ${pdfOrientation === o ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-navy border-gray-200'}`}>
                  {o}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-5">
              {[
                ['Include analytics & matching charts', pdfCharts, setPdfCharts],
                ['Show company branding & logo', pdfBranding, setPdfBranding],
                ['Include full candidate contact emails', pdfEmails, setPdfEmails]
              ].map(([label, val, setter]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-navy">{label}</span>
                  <Toggle checked={val} onChange={setter} />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowPdf(false)}>Cancel</Button>
              <Button variant="coral" onClick={() => { setShowPdf(false); alert('PDF generated') }}>Generate PDF</Button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Preview</p>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-navy">TalentFlow AI Report</span>
                <span className="w-2 h-2 rounded-full bg-coral"></span>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">Rank 98% Match</span>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-semibold">Avg Score 70% Match</span>
              </div>
              <div className="space-y-2">
                {['#1 Candidate', '#2 Candidate', '#3 Candidate'].map(c => (
                  <div key={c} className="bg-gray-50 rounded p-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-navy">{c}</span>
                    <div className="flex gap-1">
                      <span className="w-8 h-1.5 bg-green-200 rounded"></span>
                      <span className="w-6 h-1.5 bg-green-200 rounded"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
