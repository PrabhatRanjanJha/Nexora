import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addWishlistProduct, notifyWishlistUpdated, removeWishlistProduct } from '../axiosCalls/wishlistApi.js'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function ProductCard({ product, isWishlisted = false, onWishlistChange }) {
  const [saved, setSaved] = useState(isWishlisted)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [cartError, setCartError] = useState('')
  const { addToCart, cartItems } = useCart()

  useEffect(() => {setSaved(isWishlisted)}, [isWishlisted])

  const cartQuantity = cartItems.find((item) => item.product?._id === product._id)?.quantity || 0

  const handleWishlistClick = async () => {
    if (saving) return

    setSaving(true)
    setMessage('')
    setError('')

    try {
      if (saved) {
        await removeWishlistProduct(product._id)
        setSaved(false)
        onWishlistChange?.(product._id, false)
        setMessage('Removed from your wishlist.')
      } else {
        await addWishlistProduct(product._id)
        setSaved(true)
        onWishlistChange?.(product._id, true)
        setMessage('Added to your wishlist.')
      }
      notifyWishlistUpdated()
    } catch (requestError) {
      if (requestError.response?.status === 409) {
        setSaved(true)
        onWishlistChange?.(product._id, true)
        setError('This product is already in your wishlist.')
        notifyWishlistUpdated()
      } else {
        setError(requestError.response?.data?.message || 'Unable to update your wishlist. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleAddToCart = async () => {
    if (adding) return

    setCartError('')
    setAdding(true)
    try {
      await addToCart(product._id)
    } catch (requestError) {
      setCartError(requestError.response?.data?.message || 'Unable to add this product to your cart.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="catalog-product-card">
      <Link to={`/products/${product._id}`} className="catalog-product-image-wrap">
        <img src={product.image} alt={product.name} className="catalog-product-image" />
      </Link>
      <div className="catalog-product-meta">
        <p className="catalog-product-category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="catalog-product-description">{product.description}</p>
        <div className="catalog-product-footer"><strong>{formatPrice(product.price)}</strong><span>{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</span></div>
        <button className="button button-accent catalog-details-button" type="button" onClick={handleAddToCart} disabled={product.stock === 0 || adding}>
          {adding ? 'Adding...' : cartQuantity > 0 ? `Add another (${cartQuantity})` : 'Add to cart'}
        </button>
        <Link className="button button-dark catalog-details-button" to={`/products/${product._id}`}>View details <span aria-hidden="true">→</span></Link>
        <button className={`wishlist-action${saved ? ' wishlist-action-saved' : ''}`} type="button" onClick={handleWishlistClick} disabled={saving} aria-pressed={saved}>
          {saving ? 'Saving...' : saved ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
        </button>
        {message && <p className="wishlist-feedback" role="status">{message}</p>}
        {error && <p className="wishlist-feedback wishlist-feedback-error" role="alert">{error}</p>}
        {cartError && <p className="wishlist-feedback wishlist-feedback-error" role="alert">{cartError}</p>}
      </div>
    </article>
  )
}

export default ProductCard