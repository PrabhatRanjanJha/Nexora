import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWishlist, notifyWishlistUpdated, removeWishlistProduct } from '../axiosCalls/wishlistApi.js'
import WishlistNavLink from '../components/WishlistNavLink.jsx'
import CartNavLink from '../components/CartNavLink.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function Wishlist() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [removingId, setRemovingId] = useState('')

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetchWishlist()
      setProducts(response.wishlist || [])
    } catch {
      setError('We couldn’t load your wishlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    setActionError('')

    try {
      await removeWishlistProduct(productId)
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId))
      notifyWishlistUpdated()
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to remove this product. Please try again.')
    } finally {
      setRemovingId('')
    }
  }

  return (
    <main className="wishlist-page min-h-screen bg-[#090a0d] text-[#f5f6f8]">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Wishlist navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/products">Catalogue</Link>
          <WishlistNavLink />
          <CartNavLink />
          <Link className="nav-link" to="/profile">Account</Link>
        </div>
      </nav>

      {/* Main Wishlist Content */}
      <section className="wishlist-content max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="home-heading mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ff3366] animate-pulse" />
            <span className="text-[#ff3366] text-xs font-mono uppercase tracking-wider font-semibold">
              SAVED GEAR & DROPS
            </span>
          </div>
          <h1>
            Your Personal <span className="text-[#ccff00]">Wishlist.</span>
          </h1>
          <p className="text-[#8f97a3] text-base">
            {products.length} {products.length === 1 ? 'curated drop' : 'curated drops'} saved for future checkout.
          </p>
        </div>

        {loading && (
          <div className="wishlist-state">
            <div className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
            <span>SYNCHRONIZING SAVED ITEMS...</span>
          </div>
        )}

        {!loading && error && (
          <div className="wishlist-state wishlist-state-error" role="alert">
            <p className="font-bold">{error}</p>
            <button className="button button-accent mt-2" type="button" onClick={loadWishlist}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="wishlist-empty p-12 text-center rounded-2xl bg-[#141720] border border-white/10 max-w-2xl mx-auto">
            <span className="text-5xl text-[#ff3366] mb-4 block" aria-hidden="true">
              ♡
            </span>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-[#8f97a3] text-sm mb-6 max-w-md mx-auto">
              You haven't saved any products yet. Browse the catalogue and click the heart icon on any drop.
            </p>
            <Link className="button button-accent" to="/products">
              Explore Products <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {!loading && !error && actionError && (
          <p className="p-3 mb-6 rounded-lg bg-[#ff3366]/10 border border-[#ff3366]/30 text-[#ff4d6d] text-xs font-mono" role="alert">
            ! {actionError}
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="wishlist-grid">
            {products.map((product) => (
              <article className="wishlist-card" key={product._id}>
                <Link className="wishlist-image-wrap block relative overflow-hidden bg-[#11141a]" to={`/products/${product._id}`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  <span className="absolute top-3 left-3 bg-[#090a0d]/80 backdrop-blur-md border border-white/10 text-[#ccff00] text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </Link>

                <div className="wishlist-card-content flex flex-col justify-between p-5 flex-1">
                  <div>
                    <p className="catalog-product-category">{product.category}</p>
                    <Link to={`/products/${product._id}`} className="hover:text-[#ccff00] transition-colors">
                      <h2 className="text-lg font-bold text-white mb-2">{product.name}</h2>
                    </Link>
                    
                    <div className="catalog-product-footer pt-3 border-t border-white/10 flex items-baseline justify-between">
                      <strong className="text-[#ccff00] font-mono text-base">{formatPrice(product.price)}</strong>
                      <span className="text-[11px] font-mono text-[#8f97a3]">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <Link className="button button-accent !py-2.5 !text-xs text-center" to={`/products/${product._id}`}>
                      View Details & Order <span aria-hidden="true">→</span>
                    </Link>
                    <button
                      className="wishlist-action wishlist-remove !mt-0 !py-2 !text-xs"
                      type="button"
                      onClick={() => handleRemove(product._id)}
                      disabled={removingId === product._id}
                    >
                      {removingId === product._id ? 'Removing...' : '✕ Remove from Wishlist'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Wishlist