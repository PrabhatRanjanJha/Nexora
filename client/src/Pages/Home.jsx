import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import WishlistNavLink from '../components/WishlistNavLink.jsx'
import CartNavLink from '../components/CartNavLink.jsx'

function Home() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || 'N'
  const firstName = user?.fullName?.split(' ')[0] || 'Shopper'

  return (
    <main className="home-page min-h-screen bg-[#090a0d] text-[#f5f6f8]">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Account navigation">
        <Link className="brand" to="/home" aria-label="Nexora dashboard">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        
        <div className="market-search" role="search">
          <span aria-hidden="true">⌕</span>
          <span>Search products, brands and orders</span>
        </div>

        <div className="nav-actions">
          <Link className="nav-link" to="/products">Catalogue</Link>
          <WishlistNavLink />
          <CartNavLink />
          <Link className="nav-link" to="/orders">Orders</Link>
          <Link className="nav-link" to="/profile">Account</Link>
          <button className="nav-link logout-button text-[#ff4d6d] hover:text-[#ff3366]" type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      {/* Main Customer Dashboard Content */}
      <section className="home-content">
        {/* Welcome Header */}
        <div className="home-heading">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[#ccff00] text-xs font-mono uppercase tracking-wider font-semibold">
              AUTHENTICATED CUSTOMER PORTAL
            </span>
          </div>
          <h1>
            Welcome back, <span className="text-[#ccff00]">{firstName}.</span>
          </h1>
          <p className="text-[#8f97a3] text-base">
            Your personal hub. Explore new catalogue drops, check your wishlist, track real-time orders, or update your delivery preferences.
          </p>
        </div>

        {/* Discovery Marquee Banner */}
        <div className="shop-discovery-banner mt-10">
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
              CURATED COMMERCE
            </p>
            <h2>Discover verified products in the catalogue.</h2>
            <p className="text-[#8f97a3] mt-2">
              Explore high-performance electronics, contemporary apparel, living essentials, and more. Filter by category, price, and availability.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link className="button button-accent !text-sm !py-3 !px-6" to="/products">
                Browse Full Catalogue <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button-dark !text-sm !py-3 !px-5" to="/orders">
                View Past Orders
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-3 p-5 bg-[#141720]/80 rounded-2xl border border-white/10 min-w-[280px]">
            <div className="flex items-center justify-between font-mono text-[11px] pb-2 border-b border-white/10">
              <span className="text-[#8f97a3]">FEATURED HARDWARE</span>
              <span className="text-[#ccff00]">● IN STOCK</span>
            </div>
            <Link to="/products" className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1e28] hover:bg-[#222836] transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=200&q=80" 
                alt="Mechanical Keyboard" 
                className="w-10 h-10 rounded-md object-cover" 
              />
              <div>
                <p className="text-xs font-bold text-white">Mechanical Keyboard</p>
                <p className="text-[10px] font-mono text-[#ccff00]">₹3,499</p>
              </div>
            </Link>
            <Link to="/products" className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1e28] hover:bg-[#222836] transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80" 
                alt="Fitness Watch" 
                className="w-10 h-10 rounded-md object-cover" 
              />
              <div>
                <p className="text-xs font-bold text-white">Smart Fitness Watch</p>
                <p className="text-[10px] font-mono text-[#ccff00]">₹4,299</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Account Hub Cards */}
        <div className="account-grid shop-account-grid mt-10">
          <article className="account-card bg-[#141720] border border-white/10 hover:border-white/20 transition-all">
            <div className="card-label flex items-center justify-between">
              <span><span className="card-number text-[#ccff00]">01 //</span> PROFILE IDENTITY</span>
              <span className="text-[10px] font-mono text-[#8f97a3]">VERIFIED</span>
            </div>
            
            <Link className="profile-row group" to="/profile">
              <span className="profile-avatar group-hover:scale-105 transition-transform">
                {userInitial}
              </span>
              <div>
                <h2 className="group-hover:text-[#ccff00] transition-colors">{user?.fullName || 'Nexora Customer'}</h2>
                <p className="text-[#8f97a3] font-mono text-xs">{user?.email || 'No email provided'}</p>
              </div>
            </Link>

            <div className="card-detail">
              <span>Registered Phone</span>
              <strong className="text-white">{user?.phone || 'Not provided'}</strong>
            </div>
          </article>

          <article className="account-card account-card-secondary bg-[#141720] border border-white/10 hover:border-white/20 transition-all">
            <div className="card-label flex items-center justify-between">
              <span><span className="card-number text-[#ccff00]">02 //</span> ORDERS & FULFILLMENT</span>
              <span className="text-[10px] font-mono text-[#ccff00]">ACTIVE SUPPORT</span>
            </div>
            
            <div className="status-icon" aria-hidden="true">
              ↗
            </div>
            <h2>Order tracking & support</h2>
            <p className="text-[#8f97a3]">
              Review past shipments, download invoices, or initiate return requests directly through our automated portal.
            </p>
            
            <Link className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ccff00] hover:underline mt-6" to="/orders">
              GO TO MY ORDERS <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Home
