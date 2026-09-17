import { X, Mail, Briefcase, Award, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'

export default function CandidateProfileModal({ open, onClose, candidate, jobSkills = [] }) {
  if (!candidate) return null

  const recVariant = {
    'Highly Recommended': 'success',
    'Recommended': 'warning',
    'Not Recommended': 'danger'
  }

  // Compute matching / missing skills
  const candidateSkills = candidate.skills || []
  const matchedSkills = jobSkills.filter(s => candidateSkills.includes(s))
  const missingSkills = jobSkills.filter(s => !candidateSkills.includes(s))

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-navy to-navy-dark text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                {candidate.name?.charAt(0) || '?'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-sm text-white/80 mt-1">Applied for: {candidate.appliedFor}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-white/70">Rank</p>
              <p className="text-xl font-bold mt-0.5">#{String(candidate.rank).padStart(2, '0')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-white/70">AI Match</p>
              <p className="text-xl font-bold mt-0.5">{candidate.match}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-white/70">Recommendation</p>
              <p className="text-sm font-bold mt-1">{candidate.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact info */}
          <div>
            <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Contact Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-navy">{candidate.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Experience</span>
                <span className="font-medium text-navy">{candidate.experience || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidateSkills.length > 0 ? (
                candidateSkills.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-blue-50 text-navy text-xs font-medium rounded-full">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No skills listed</span>
              )}
            </div>
          </div>

          {/* Matched vs Missing Skills */}
          {jobSkills.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Matched Skills ({matchedSkills.length})
                </h3>
                <div className="space-y-1.5">
                  {matchedSkills.length > 0 ? matchedSkills.map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {s}
                    </div>
                  )) : (
                    <span className="text-xs text-gray-400">None matched</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2 text-sm">
                  <XCircle className="w-4 h-4" /> Missing Skills ({missingSkills.length})
                </h3>
                <div className="space-y-1.5">
                  {missingSkills.length > 0 ? missingSkills.map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {s}
                    </div>
                  )) : (
                    <span className="text-xs text-gray-400">All required skills present </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendation */}
          <div>
            <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> AI Recommendation
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={recVariant[candidate.recommendation]}>{candidate.recommendation}</Badge>
                <span className="text-sm text-gray-500">Match Score: {candidate.match}%</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {candidate.recommendation === 'Highly Recommended'
                  ? `This candidate is an excellent match for the ${candidate.appliedFor} role. Their skill set and experience align closely with the job requirements, and they rank in the top tier of applicants. We strongly recommend moving them to the interview stage.`
                  : candidate.recommendation === 'Recommended'
                  ? `This candidate is a solid match for the ${candidate.appliedFor} role. They meet most of the core requirements and show strong potential. Consider them for an initial screening call.`
                  : `This candidate has some gaps relative to the ${candidate.appliedFor} role. Their current skill set does not fully align with the requirements. Consider only if the pipeline needs to be expanded.`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-navy bg-white border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-coral hover:bg-coral-hover">
              Shortlist Candidate
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
