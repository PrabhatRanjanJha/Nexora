import { Link } from 'react-router-dom'

function Landing() {
  return (
    <main className="landing-page min-h-screen bg-[#090a0d] text-[#f5f6f8] overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,_rgba(204,255,0,0.08)_0%,_rgba(99,102,241,0.04)_40%,_transparent_70%)] pointer-events-none" />

      {/* Navigation */}
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="Nexora home">
          <span className="brand-mark">N</span>
          <span className="tracking-tight">Nexora</span>
        </Link>

        <div className="market-search" role="search">
          <span aria-hidden="true">⌕</span>
          <span>Search curated gear, electronics & style</span>
        </div>

        <div className="nav-actions">
          <Link className="nav-link cart-link" to="/login">
            <span aria-hidden="true" className="text-sm">▱</span> Cart
          </Link>
          <Link className="nav-link" to="/login">Log in</Link>
          <Link className="button button-accent !py-2.5 !px-5" to="/signup">
            Get Started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>

      {/* Category Ticker Bar */}
      <div className="category-bar" aria-label="Shop categories">
        <span>⚡ ALL CATEGORIES</span>
        <span>ELECTRONICS</span>
        <span>FASHION & APPAREL</span>
        <span>BOOKS & CULTURE</span>
        <span>HOME & LIVING</span>
        <span>BEAUTY & WELLNESS</span>
        <span>GROCERY & PANTRY</span>
        <span>✦ TODAY'S DROPS</span>
      </div>

      {/* Main High-Impact Editorial Hero */}
      <section className="landing-hero relative z-10">
        <div className="hero-copy">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#161922] border border-white/10 mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[#ccff00] text-xs font-mono tracking-wider font-semibold uppercase">
              NEXT-GEN COMMERCE PLATFORM
            </span>
          </div>

          <h1 className="text-white">
            Unfiltered <span className="text-[#ccff00]">energy</span>, curated for you.
          </h1>

          <p className="hero-description text-[#8f97a3] text-lg">
            Nexora delivers the fastest, most vibrant shopping journey online. High-velocity checkout, verified authentic drops, and zero friction.
          </p>

          <div className="hero-actions flex-wrap gap-4 pt-2">
            <Link className="button button-accent !text-sm !py-3.5 !px-7 font-extrabold" to="/signup">
              Start Shopping Now <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-dark !text-sm !py-3.5 !px-6" to="/login">
              Track An Existing Order
            </Link>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/10 max-w-lg">
            <div>
              <p className="font-display text-2xl font-extrabold text-white">100%</p>
              <p className="text-[11px] font-mono text-[#8f97a3] uppercase tracking-wider mt-1">Verified Drops</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-[#ccff00]">24H</p>
              <p className="text-[11px] font-mono text-[#8f97a3] uppercase tracking-wider mt-1">Swift Dispatch</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-white">4.9★</p>
              <p className="text-[11px] font-mono text-[#8f97a3] uppercase tracking-wider mt-1">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Visual Showcase Stage */}
        <div className="hero-panel" aria-label="Featured shopping deal">
          <div className="panel-topline">
            <span className="text-white/60 font-mono text-[11px] tracking-widest">CURATED DROP // 01</span>
            <span className="live-dot text-xs font-mono font-bold bg-[#ccff00]/10 border border-[#ccff00]/30 px-2.5 py-0.5 rounded-full">
              ● IN STOCK & READY
            </span>
          </div>

          <div className="product-art product-art-large relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" 
              alt="Flagship Headphone Drop" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-[#090a0d]/40 to-transparent z-10" />
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ccff00]/25 transition-all" />
            
            <div className="relative z-20 flex justify-between w-full items-end p-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#ccff00]">AUDIO HARDWARE</span>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">ANC Wireless Series</p>
              </div>
              <strong className="text-white/30 font-mono text-4xl sm:text-5xl font-extrabold tracking-tighter">
                NX-01
              </strong>
            </div>
          </div>

          <div className="product-hero-info items-center">
            <div>
              <p className="text-white font-display text-lg sm:text-xl font-bold">Noise Cancelling Wireless Headphones</p>
              <strong className="text-[#ccff00] font-mono text-base font-semibold">₹6,999 · 22 Units In Stock</strong>
            </div>
            <Link to="/signup" className="round-arrow" aria-label="Shop featured item">
              ↗
            </Link>
          </div>

          <div className="panel-stat-row">
            <div>
              <strong>Instant</strong>
              <span>Dispatch</span>
            </div>
            <div>
              <strong>Razorpay</strong>
              <span>Secure Pay</span>
            </div>
            <div>
              <strong>30 Days</strong>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Category Strip */}
      <section className="max-w-7xl mx-auto px-8 py-14">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <p className="eyebrow">EXPLORE BY DOMAIN</p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">Curated Collections</h2>
          </div>
          <Link to="/signup" className="text-xs font-mono font-bold text-[#ccff00] hover:underline flex items-center gap-1">
            VIEW ALL CATEGORIES <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Electronics', count: 'Latest Tech', tag: '01', accent: 'border-l-2 border-[#ccff00]' },
            { title: 'Fashion', count: 'Street & Formal', tag: '02', accent: 'border-l-2 border-[#6366f1]' },
            { title: 'Home & Living', count: 'Modern Spaces', tag: '03', accent: 'border-l-2 border-[#00d2ff]' },
            { title: 'Beauty & Care', count: 'Daily Essentials', tag: '04', accent: 'border-l-2 border-[#ff3366]' },
          ].map((cat) => (
            <Link 
              key={cat.tag} 
              to="/signup" 
              className={`p-5 rounded-xl bg-[#14171f] border border-white/10 hover:border-white/20 hover:bg-[#1a1e28] transition-all group ${cat.accent}`}
            >
              <span className="text-[10px] font-mono text-[#8f97a3] group-hover:text-[#ccff00] transition-colors">
                CAT // {cat.tag}
              </span>
              <h3 className="font-display text-lg font-bold text-white mt-1 group-hover:translate-x-0.5 transition-transform">
                {cat.title}
              </h3>
              <p className="text-xs text-[#8f97a3] mt-1 font-mono">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Value Props / Guarantees */}
      <section className="landing-footnote shop-feature-row">
        <div>
          <span>01</span>
          <div>
            <p className="text-white font-bold text-sm">Ultra-Fast Doorstep Delivery</p>
            <p className="text-[#8f97a3] text-xs font-normal mt-0.5">Reliable dispatch from domestic fulfillment hubs.</p>
          </div>
        </div>
        <div>
          <span>02</span>
          <div>
            <p className="text-white font-bold text-sm">Seamless Razorpay Security</p>
            <p className="text-[#8f97a3] text-xs font-normal mt-0.5">Bank-grade encryption across cards, UPI & Netbanking.</p>
          </div>
        </div>
        <div>
          <span>03</span>
          <div>
            <p className="text-white font-bold text-sm">Hassle-Free 30-Day Returns</p>
            <p className="text-[#8f97a3] text-xs font-normal mt-0.5">Straightforward returns with direct customer support.</p>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-8 py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8f97a3]">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold font-display text-sm">Nexora</span>
          <span>© 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          <Link to="/signup" className="hover:text-[#ccff00] transition-colors">Create Account</Link>
          <span className="text-[#ccff00]">● SYSTEM OPERATIONAL</span>
        </div>
      </footer>
    </main>
  )
}

export default Landing
