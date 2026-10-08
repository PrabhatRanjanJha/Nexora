import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchWishlistCount } from '../axiosCalls/wishlistApi.js'

function WishlistNavLink() {
  const [count, setCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    let active = true

    const loadCount = async () => {
      try {
        const nextCount = await fetchWishlistCount()
        if (active) setCount(nextCount)
      } catch {
        if (active) setCount(0)
      }
    }

    loadCount()
    window.addEventListener('wishlist-updated', loadCount)
    return () => {
      active = false
      window.removeEventListener('wishlist-updated', loadCount)
    }
  }, [location.pathname])

  return (
    <Link className="nav-link relative inline-flex items-center gap-1.5" to="/wishlist">
      <span>Wishlist</span>
      <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-mono font-bold rounded-full transition-all ${
        count > 0 
          ? 'bg-[#ff3366] text-white shadow-[0_0_10px_rgba(255,51,102,0.3)]' 
          : 'bg-[#1e222b] text-[#8f97a3] border border-white/10'
      }`}>
        {count}
      </span>
    </Link>
  )
}

export default WishlistNavLink