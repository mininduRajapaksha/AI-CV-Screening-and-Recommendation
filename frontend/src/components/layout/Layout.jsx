import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ children, topbarTitle }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#EFF6FF' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={topbarTitle} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
