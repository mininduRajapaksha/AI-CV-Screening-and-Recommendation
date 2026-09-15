export default function Profile({ accountType = 'user' }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Profile</h1>
      <p className="mt-2 text-sm text-slate-500">Profile content coming soon. Account type: {accountType}</p>
    </div>
  )
}
