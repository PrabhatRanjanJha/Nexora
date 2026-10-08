import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const emptyAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: '',
}

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function validateAddress(address) {
  const errors = {}
  Object.entries(address).forEach(([field, value]) => {
    if (!value.trim()) errors[field] = 'This field is required.'
  })

  const phoneDigits = address.phone.replace(/\D/g, '')
  if (
    address.phone &&
    (!/^\+?[0-9\s()-]{10,16}$/.test(address.phone) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15)
  ) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
    errors.pincode = 'Pincode must contain 6 digits.'
  }
  return errors
}

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, cartLoading, cartError, subtotal, refreshCart } = useCart()
  const [address, setAddress] = useState(emptyAddress)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    const savedAddress = user.shippingAddress || {}
    setAddress({
      fullName: user.fullName || '',
      phone: user.phone || '',
      addressLine1: savedAddress.street || '',
      city: savedAddress.city || '',
      state: savedAddress.state || '',
      pincode: savedAddress.postalCode || '',
    })
  }, [user])

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) navigate('/cart', { replace: true })
  }, [cartItems.length, cartLoading, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setAddress((currentAddress) => ({ ...currentAddress, [name]: value }))
    setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateAddress(address)
    setFieldErrors(validationErrors)
    setError('')
    if (Object.keys(validationErrors).length) return

    setSubmitting(true)
    try {
      const checkoutReady = await loadRazorpay()
      if (!checkoutReady) {
        setError('Razorpay Checkout could not be loaded. Check your connection and try again.')
        setSubmitting(false)
        return
      }

      const response = await axiosInstance.post('/orders/create-payment-order', {
        shippingAddress: Object.fromEntries(
          Object.entries(address).map(([field, value]) => [field, value.trim()])
        ),
      })
      const paymentOrder = response.data
      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'Nexora',
        description: 'Order payment',
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: address.fullName,
          email: user?.email || '',
          contact: address.phone,
        },
        notes: { orderId: paymentOrder.orderId },
        theme: { color: '#090a0d' },
        handler: async (payment) => {
          try {
            await axiosInstance.post('/orders/verify-payment', {
              orderId: paymentOrder.orderId,
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature,
            })
            await refreshCart()
            navigate(`/orders/${paymentOrder.orderId}`, { replace: true })
          } catch (verificationError) {
            setError(
              verificationError.response?.data?.message ||
                'Payment verification failed. Your cart has not been cleared.'
            )
            setSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      })
      checkout.on('payment.failed', (payment) => {
        setError(payment.error?.description || 'Payment was not completed. Your cart is unchanged.')
        setSubmitting(false)
      })
      checkout.open()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to start checkout. Please try again.')
      setSubmitting(false)
    }
  }

  if (cartLoading) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center font-mono text-[#8f97a3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
          <span>PREPARING CHECKOUT GATEWAY...</span>
        </div>
      </main>
    )
  }

  if (cartError) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-[#141720] border border-[#ff3366]/30" role="alert">
          <p className="text-[#ff4d6d] font-bold text-lg mb-4">{cartError}</p>
          <button type="button" className="button button-accent" onClick={refreshCart}>
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center font-mono text-[#8f97a3]">
        <span>Returning to your bag...</span>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#090a0d] text-[#f5f6f8]">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Checkout navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/cart">← Back to Bag</Link>
          <Link className="nav-link" to="/orders">My Orders</Link>
        </div>
      </nav>

      {/* Main Checkout Content */}
      <section className="checkout-content max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="home-heading mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[#ccff00] text-xs font-mono uppercase tracking-wider font-semibold">
              ENCRYPTED CHECKOUT
            </span>
          </div>
          <h1>
            Delivery & <span className="text-[#ccff00]">Payment.</span>
          </h1>
          <p className="text-[#8f97a3] text-base">
            Confirm your destination address. Payment is securely verified in Razorpay Test Mode.
          </p>
        </div>

        {error && (
          <div className="checkout-error mb-6" role="alert">
            ! {error}
          </div>
        )}

        <div className="checkout-layout">
          {/* Left Shipping Address Form */}
          <form className="checkout-card" onSubmit={handleSubmit} noValidate>
            <div className="card-label flex items-center justify-between pb-4 border-b border-white/10">
              <span><span className="card-number text-[#ccff00]">01 //</span> SHIPPING DESTINATION</span>
              <span className="text-[10px] font-mono text-[#8f97a3]">REQUIRED</span>
            </div>

            <div className="checkout-fields">
              <label>
                Full Name
                <input
                  name="fullName"
                  autoComplete="name"
                  value={address.fullName}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  placeholder="e.g. Rahul Sharma"
                />
                {fieldErrors.fullName && <small>{fieldErrors.fullName}</small>}
              </label>

              <label>
                Phone Number
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={address.phone}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  placeholder="e.g. 9876543210"
                />
                {fieldErrors.phone && <small>{fieldErrors.phone}</small>}
              </label>

              <label className="checkout-field-wide">
                Street Address / Building
                <input
                  name="addressLine1"
                  autoComplete="street-address"
                  value={address.addressLine1}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.addressLine1)}
                  placeholder="Flat / House no., Street, Landmark"
                />
                {fieldErrors.addressLine1 && <small>{fieldErrors.addressLine1}</small>}
              </label>

              <label>
                City
                <input
                  name="city"
                  autoComplete="address-level2"
                  value={address.city}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.city)}
                  placeholder="City"
                />
                {fieldErrors.city && <small>{fieldErrors.city}</small>}
              </label>

              <label>
                State
                <input
                  name="state"
                  autoComplete="address-level1"
                  value={address.state}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.state)}
                  placeholder="State"
                />
                {fieldErrors.state && <small>{fieldErrors.state}</small>}
              </label>

              <label>
                Postal Code (PIN)
                <input
                  name="pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength="6"
                  value={address.pincode}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.pincode)}
                  placeholder="6-digit PIN"
                />
                {fieldErrors.pincode && <small>{fieldErrors.pincode}</small>}
              </label>
            </div>

            <button
              className="button button-accent checkout-submit !py-4 !text-base font-extrabold"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Connecting to Razorpay...
                </span>
              ) : (
                `Complete Payment — ${formatPrice(subtotal)} →`
              )}
            </button>

            <p className="checkout-note mt-4 text-xs text-[#8f97a3] leading-relaxed">
              Payments are processed securely via Razorpay Test Gateway. Your bag is cleared only upon verified confirmation.
            </p>
          </form>

          {/* Right Order Summary Aside */}
          <aside className="checkout-card checkout-summary">
            <div className="card-label flex items-center justify-between pb-4 border-b border-white/10">
              <span><span className="card-number text-[#ccff00]">02 //</span> ORDER BREAKDOWN</span>
              <span className="text-[10px] font-mono text-[#8f97a3]">{cartItems.length} ITEMS</span>
            </div>

            <div className="checkout-summary-items">
              {cartItems.map(
                (item) =>
                  item.product && (
                    <div className="checkout-summary-item py-2 border-b border-white/5" key={item.product._id}>
                      <span className="text-white font-medium">
                        {item.product.name} <small className="text-[#8f97a3] font-mono">× {item.quantity}</small>
                      </span>
                      <strong className="text-[#ccff00] font-mono font-bold">
                        {formatPrice(Number(item.product.price) * Number(item.quantity))}
                      </strong>
                    </div>
                  )
              )}
            </div>

            <div className="checkout-total pt-4 mt-4 border-t border-white/10">
              <span className="text-base font-bold text-white">Grand Total</span>
              <strong className="text-2xl text-[#ccff00] font-mono font-extrabold">
                {formatPrice(subtotal)}
              </strong>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-[#8f97a3]">
              <p className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                ✓ Free Standard Shipping Applied
              </p>
              <p>Estimated Delivery: 2-4 business days.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Checkout
