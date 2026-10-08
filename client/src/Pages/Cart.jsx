import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function Cart() {
  const { cartItems, cartLoading, cartError, subtotal, updateQuantity, removeFromCart, refreshCart } = useCart()
  const [updatingId, setUpdatingId] = useState('')

  const handleQuantityChange = async (productId, nextQuantity) => {
    if (!productId || nextQuantity < 1) return
    setUpdatingId(productId)
    try {
      await updateQuantity(productId, nextQuantity)
    } finally {
      setUpdatingId('')
    }
  }

  const handleRemove = async (productId) => {
    setUpdatingId(productId)
    try {
      await removeFromCart(productId)
    } finally {
      setUpdatingId('')
    }
  }

  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)

  if (cartLoading) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center font-mono text-[#8f97a3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
          <span>SYNCHRONIZING SHOPPING BAG...</span>
        </div>
      </main>
    )
  }

  if (cartError) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-[#141720] border border-[#ff3366]/30">
          <p className="text-[#ff4d6d] font-bold text-lg mb-4">{cartError}</p>
          <button type="button" className="button button-accent" onClick={refreshCart}>
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#090a0d] text-[#f5f6f8]">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Cart navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/products">Catalogue</Link>
          <Link className="nav-link" to="/wishlist">Wishlist</Link>
          <Link className="nav-link" to="/orders">Orders</Link>
          <Link className="nav-link" to="/profile">Account</Link>
        </div>
      </nav>

      {/* Main Cart Content */}
      <section className="cart-content max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="home-heading mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[#ccff00] text-xs font-mono uppercase tracking-wider font-semibold">
              BAG SUMMARY
            </span>
          </div>
          <h1>
            Your Shopping <span className="text-[#ccff00]">Bag.</span>
          </h1>
          <p className="text-[#8f97a3] text-base">
            {itemCount} {itemCount === 1 ? 'verified item' : 'verified items'} prepared for direct fulfillment.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty p-12 text-center rounded-2xl bg-[#141720] border border-white/10 max-w-2xl mx-auto">
            <span className="text-5xl text-[#ccff00] mb-4 block" aria-hidden="true">
              🛍
            </span>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Your shopping bag is empty</h2>
            <p className="text-[#8f97a3] text-sm mb-6 max-w-md mx-auto">
              You haven't added any products to your bag yet. Browse our curated drops to discover gear you love.
            </p>
            <Link className="button button-accent" to="/products">
              Explore Catalogue <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Left Items Panel */}
            <section className="cart-items-panel">
              {cartItems.map((item) => {
                const product = item.product
                if (!product) return null

                const isUpdating = updatingId === product._id
                const lineTotal = Number(product.price || 0) * Number(item.quantity || 0)

                return (
                  <article className="cart-item-card" key={product._id}>
                    <Link className="cart-image-wrap block relative overflow-hidden bg-[#11141a]" to={`/products/${product._id}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </Link>

                    <div className="cart-item-details">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-[#ccff00] uppercase tracking-wider">
                            {product.category}
                          </span>
                          <span className="text-xs font-mono text-[#8f97a3]">
                            Unit: {formatPrice(product.price)}
                          </span>
                        </div>
                        <Link to={`/products/${product._id}`} className="hover:text-[#ccff00] transition-colors">
                          <h2 className="mt-1">{product.name}</h2>
                        </Link>
                      </div>

                      <div className="cart-item-controls pt-2">
                        {/* Tactile Quantity Stepper */}
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            aria-label={`Decrease quantity of ${product.name}`}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) + 1)}
                            disabled={isUpdating || item.quantity >= (product.stock || 0)}
                            aria-label={`Increase quantity of ${product.name}`}
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          className="text-xs font-mono font-semibold text-[#ff4d6d] hover:text-[#ff3366] transition-colors flex items-center gap-1 disabled:opacity-50"
                          onClick={() => handleRemove(product._id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Updating...' : '✕ Remove'}
                        </button>
                      </div>

                      <div className="cart-price-row">
                        <span className="text-xs text-[#8f97a3] font-mono">ITEM TOTAL</span>
                        <strong>{formatPrice(lineTotal)}</strong>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            {/* Right Sticky Order Summary Card */}
            <aside className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Total Items</span>
                <strong>{itemCount} units</strong>
              </div>
              <div className="summary-row">
                <span>Estimated Shipping</span>
                <strong className="text-emerald-400">FREE</strong>
              </div>
              <div className="summary-row">
                <span className="text-base font-bold text-white">Subtotal</span>
                <strong className="text-xl text-[#ccff00] font-mono font-bold">
                  {formatPrice(subtotal)}
                </strong>
              </div>

              <Link className="button button-accent cart-checkout-button" to="/checkout">
                Proceed to Checkout <span aria-hidden="true">→</span>
              </Link>

              <div className="mt-6 pt-6 border-t border-white/10 text-xs font-mono text-[#8f97a3] flex flex-col gap-2">
                <span className="flex items-center gap-2">
                  <span className="text-[#ccff00]">✓</span> Powered by Razorpay Standard Checkout
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#ccff00]">✓</span> 100% Encrypted & Authenticated
                </span>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default Cart
