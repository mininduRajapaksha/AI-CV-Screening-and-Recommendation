import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ children, topbarTitle }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-60">
        <Topbar title={topbarTitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
