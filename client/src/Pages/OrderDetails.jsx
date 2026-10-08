import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadOrder = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${id}`)
        if (mounted) setOrder(response.data.order)
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.message || 'Unable to load this order.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadOrder()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090a0d] flex items-center justify-center font-mono text-[#8f97a3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
          <span>VERIFYING ORDER MANIFEST...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#090a0d] text-[#f5f6f8]">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Order details navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/orders">← My Orders</Link>
          <Link className="nav-link" to="/products">Catalogue</Link>
        </div>
      </nav>

      {/* Main Order Details Content */}
      <section className="order-details-content max-w-4xl mx-auto px-6 sm:px-8 py-10">
        {error ? (
          <div className="orders-state orders-state-error p-8 text-center" role="alert">
            <p className="font-bold text-lg mb-4">{error}</p>
            <Link className="button button-accent" to="/orders">
              Back to my orders
            </Link>
          </div>
        ) : (
          order && (
            <>
              <div className="home-heading mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                  <span className="text-[#ccff00] text-xs font-mono uppercase tracking-wider font-semibold">
                    {order.paymentStatus === 'PAID' ? 'TRANSACTION CONFIRMED' : 'TRANSACTION PENDING'}
                  </span>
                </div>
                <h1>
                  {order.paymentStatus === 'PAID' ? 'Thank You for Your Order' : 'Order Details'}
                  <span className="text-[#ccff00]">.</span>
                </h1>
                <p className="text-[#8f97a3] text-base">
                  {order.paymentStatus === 'PAID'
                    ? 'Your payment was successfully verified. The fulfillment team has received your order.'
                    : 'This order is currently pending payment confirmation.'}
                </p>
              </div>

              <article className="order-details-card bg-[#141720] border border-white/10 rounded-2xl p-8 shadow-xl">
                {/* Header Strip */}
                <div className="order-card-heading pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow !text-xs !mb-1 text-[#8f97a3]">OFFICIAL RECEIPT</p>
                    <h2 className="font-mono text-xl font-bold text-white">
                      #{order._id}
                    </h2>
                  </div>
                  <span
                    className={`order-status ${
                      order.status === 'PAID'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-[#ccff00]/30 bg-[#ccff00]/10 text-[#ccff00]'
                    }`}
                  >
                    ● {order.status.replaceAll('_', ' ')}
                  </span>
                </div>

                {/* Items List */}
                <div className="order-detail-items py-4">
                  {order.items.map((item, index) => (
                    <div className="order-detail-item" key={`${item.product}-${index}`}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover bg-[#090a0d] border border-white/10"
                        />
                      )}
                      <div>
                        <strong className="text-white font-medium text-base">{item.name}</strong>
                        <span className="text-[#8f97a3] font-mono text-xs">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </span>
                      </div>
                      <strong className="text-[#ccff00] font-mono text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="order-detail-total flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-white font-bold text-base">
                    {order.paymentStatus === 'PAID' ? 'Total Paid (Verified)' : 'Order Total'}
                  </span>
                  <strong className="text-2xl text-[#ccff00] font-mono font-extrabold">
                    {formatPrice(order.totalAmount)}
                  </strong>
                </div>

                {/* Shipping Details */}
                <div className="order-shipping mt-8 pt-6 border-t border-white/10">
                  <p className="eyebrow !text-xs !mb-2 text-[#8f97a3]">DELIVERY RECIPIENT</p>
                  <strong className="text-white text-base">{order.shippingAddress.fullName}</strong>
                  <span className="text-[#8f97a3] text-sm">
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} — {order.shippingAddress.pincode}
                  </span>
                  <span className="text-[#8f97a3] font-mono text-xs">
                    Contact: {order.shippingAddress.phone}
                  </span>
                </div>

                {/* Payment Line */}
                <p className="order-payment-line mt-6 pt-4 border-t border-white/10 text-xs font-mono text-[#8f97a3]">
                  Payment Status: <strong className="text-[#ccff00]">{order.paymentStatus}</strong> · Order Created:{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </article>

              <div className="order-detail-actions mt-8 flex items-center gap-4">
                <Link className="button button-dark" to="/orders">
                  ← Back to Orders
                </Link>
                <Link className="button button-accent" to="/products">
                  Continue Shopping →
                </Link>
              </div>
            </>
          )
        )}
      </section>
    </main>
  )
}

export default OrderDetails
