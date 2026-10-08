import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../axiosCalls/productApi.js'
import WishlistNavLink from '../components/WishlistNavLink.jsx'
import CartNavLink from '../components/CartNavLink.jsx'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [actionError, setActionError] = useState('')
  const { addToCart, cartItems } = useCart()

  useEffect(() => {
    let mounted = true
    const loadProduct = async () => {
      try {
        setLoading(true)
        const result = await fetchProduct(id)
        if (mounted) setProduct(result)
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError.response?.status === 404
              ? 'Product not found.'
              : 'Something went wrong while loading this product.'
          )
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      mounted = false
    }
  }, [id])

  const cartQuantity = cartItems.find((item) => item.product?._id === product?._id)?.quantity || 0

  const handleAddToCart = async () => {
    if (!product || adding) return

    setActionError('')
    setAdding(true)
    try {
      await addToCart(product._id)
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to add this product to your cart.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center font-mono text-[#8f97a3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
          <span>INITIALIZING PRODUCT SPECIFICATIONS...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-[#141720] border border-[#ff3366]/30">
          <p className="text-[#ff4d6d] font-bold text-lg mb-4">{error}</p>
          <Link className="button button-dark" to="/products">
            ← Return to Catalogue
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="catalog-page min-h-screen bg-[#090a0d] text-[#f5f6f8]">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Product navigation">
        <Link className="brand" to="/home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="nav-actions">
          <WishlistNavLink />
          <CartNavLink />
          <Link className="nav-link" to="/products">
            ← Catalogue
          </Link>
        </div>
      </nav>

      {/* Main Details Section */}
      <section className="product-detail-content max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <Link className="text-xs font-mono font-bold text-[#8f97a3] hover:text-[#ccff00] inline-flex items-center gap-2 mb-8 transition-colors" to="/products">
          <span>←</span> BACK TO CATALOGUE
        </Link>

        <div className="product-detail-layout">
          {/* Left: Dominant Product Imagery Stage */}
          <div className="product-detail-image relative group overflow-hidden bg-gradient-to-b from-[#161a22] to-[#101217]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-[#090a0d]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-[#ccff00]">
              CATEGORY // {product.category}
            </div>
          </div>

          {/* Right: Sticky Intelligence & Action Panel */}
          <div className="product-detail-copy flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#ccff00] uppercase tracking-widest font-semibold">
                CURATED SPECIFICATION
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono text-[#8f97a3] uppercase">
                ID: {product._id.slice(-6)}
              </span>
            </div>

            <h1 className="text-white font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <p className="product-detail-price text-3xl sm:text-4xl font-mono font-bold text-[#ccff00]">
                {formatPrice(product.price)}
              </p>
              <span className="text-xs font-mono text-[#8f97a3]">INCL. ALL TAXES</span>
            </div>

            <div className="my-6 py-6 border-y border-white/10">
              <p className="text-[#8f97a3] text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Inventory Status Pill */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full ${
                product.stock > 0 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {product.stock > 0 ? `${product.stock} UNITS READY FOR DISPATCH` : 'CURRENTLY OUT OF STOCK'}
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-3">
              <button
                className="button button-accent !py-4 !text-base font-extrabold w-full"
                type="button"
                disabled={product.stock === 0 || adding}
                onClick={handleAddToCart}
              >
                {adding ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Updating Cart...
                  </span>
                ) : cartQuantity > 0 ? (
                  `Add Another To Cart (${cartQuantity} Already In Bag)`
                ) : (
                  'Add To Shopping Bag →'
                )}
              </button>

              <div className="flex items-center gap-3">
                <Link className="button button-dark flex-1 text-center" to="/cart">
                  View Bag
                </Link>
                <Link className="button button-dark flex-1 text-center" to="/products">
                  Continue Browsing
                </Link>
              </div>
            </div>

            {actionError && (
              <p className="mt-4 p-3 rounded-lg bg-[#ff3366]/10 border border-[#ff3366]/30 text-[#ff4d6d] text-xs font-mono" role="alert">
                ! {actionError}
              </p>
            )}

            {/* Assurance Guarantees */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono text-[#8f97a3]">
              <div className="flex items-center gap-2">
                <span className="text-[#ccff00] font-bold">⚡</span>
                <span>Fast Domestic Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#ccff00] font-bold">✦</span>
                <span>100% Genuine Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetails