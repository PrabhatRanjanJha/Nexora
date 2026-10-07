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
    return <main className="catalog-page route-state">Loading your cart...</main>
  }

  if (cartError) {
    return (
      <main className="catalog-page catalog-state catalog-error">
        <div>
          <p>{cartError}</p>
          <button type="button" className="catalog-retry" onClick={refreshCart}>Try Again</button>
        </div>
      </main>
    )
  }

  return (
    <main className="wishlist-page shop-home">
      <nav className="site-nav home-nav" aria-label="Cart navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home"><span className="brand-mark">N</span><span>Nexora</span></Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/products">Products</Link>
          <Link className="nav-link" to="/wishlist">Wishlist</Link>
          <Link className="nav-link" to="/orders">Orders</Link>
          <Link className="nav-link" to="/profile">Account</Link>
        </div>
      </nav>

      <section className="wishlist-content cart-content">
        <div className="home-heading"><p className="eyebrow">YOUR CART</p><h1>Ready to checkout<span>.</span></h1><p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag.</p></div>

        {cartItems.length === 0 ? (
          <div className="wishlist-empty cart-empty">
            <span className="wishlist-empty-icon" aria-hidden="true">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link className="button button-accent" to="/products">Browse products <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-panel">
              {cartItems.map((item) => {
                const product = item.product
                if (!product) return null

                const isUpdating = updatingId === product._id
                const lineTotal = Number(product.price || 0) * Number(item.quantity || 0)

                return (
                  <article className="cart-item-card" key={product._id}>
                    <Link className="wishlist-image-wrap cart-image-wrap" to={`/products/${product._id}`}>
                      <img src={product.image} alt={product.name} />
                    </Link>
                    <div className="cart-item-details">
                      <div>
                        <p className="catalog-product-category">{product.category}</p>
                        <h2>{product.name}</h2>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-control">
                          <button type="button" onClick={() => handleQuantityChange(product._id, Number(item.quantity) - 1)} disabled={item.quantity <= 1 || isUpdating}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => handleQuantityChange(product._id, Number(item.quantity) + 1)} disabled={isUpdating || item.quantity >= (product.stock || 0)} aria-label={`Increase quantity of ${product.name}`}>+</button>
                        </div>
                        <button type="button" className="wishlist-action wishlist-remove cart-remove" onClick={() => handleRemove(product._id)} disabled={isUpdating}>
                          {isUpdating ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                      <div className="cart-price-row">
                        <strong>{formatPrice(product.price)}</strong>
                        <span>{formatPrice(lineTotal)}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            <aside className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Items</span><strong>{itemCount}</strong></div>
              <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <Link className="button button-accent cart-checkout-button" to="/checkout">Proceed to Checkout</Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default Cart
