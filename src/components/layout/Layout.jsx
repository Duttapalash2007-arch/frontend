import Header from './Header'
import Footer from './Footer'
import { useAuth } from '../../hooks/useAuth'
import AdminSidebar from './AdminSidebar'

export default function Layout({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()

  if (isAuthenticated && isAdmin) {
    return (
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-main">
          <main className="site-main admin-main__content">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="site-shell">
      <Header />
      <main className="site-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}
