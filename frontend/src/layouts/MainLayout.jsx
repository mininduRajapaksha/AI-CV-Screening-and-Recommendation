import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

export default function MainLayout({ children, topbarTitle }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#EFF6FF' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title={topbarTitle} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
