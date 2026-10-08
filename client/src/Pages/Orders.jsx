import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get('/orders')
      setOrders(response.data.orders || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  return (
    <main className="min-h-screen bg-[#090a0d] text-[#f5f6f8]">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Orders navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/products">Catalogue</Link>
          <Link className="nav-link" to="/cart">Cart</Link>
          <Link className="nav-link" to="/profile">Account</Link>
        </div>
      </nav>

      {/* Main Orders Content */}
      <section className="orders-content max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="home-heading mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[#ccff00] text-xs font-mono uppercase tracking-wider font-semibold">
              PURCHASE ARCHIVE
            </span>
          </div>
          <h1>
            My Orders <span className="text-[#ccff00]">History.</span>
          </h1>
          <p className="text-[#8f97a3] text-base">
            Track previous orders, view payment confirmations, and download verified digital receipts.
          </p>
        </div>

        {loading && (
          <div className="orders-state">
            <div className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
            <span>RETRIEVING ORDER LEDGER...</span>
          </div>
        )}

        {!loading && error && (
          <div className="orders-state orders-state-error" role="alert">
            <p className="font-bold">{error}</p>
            <button className="button button-accent mt-2" type="button" onClick={loadOrders}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty p-12 text-center rounded-2xl bg-[#141720] border border-white/10 max-w-2xl mx-auto">
            <span className="text-5xl text-[#ccff00] mb-4 block" aria-hidden="true">
              📦
            </span>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              No orders placed yet
            </h2>
            <p className="text-[#8f97a3] text-sm mb-6 max-w-md mx-auto">
              Your purchase history is currently empty. Explore the catalogue and place your first order.
            </p>
            <Link className="button button-accent" to="/products">
              Start Shopping <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => {
              const statusClass =
                order.status === 'PAID'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : order.status === 'PENDING_PAYMENT'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-[#ccff00]/30 bg-[#ccff00]/10 text-[#ccff00]'

              return (
                <article className="order-card" key={order._id}>
                  <div className="order-card-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow !text-xs !mb-1 text-[#8f97a3]">
                        ORDER PLACED {formatDate(order.createdAt)}
                      </p>
                      <h2 className="font-mono text-lg font-bold text-white">
                        Order #{order._id}
                      </h2>
                    </div>
                    <span className={`order-status ${statusClass}`}>
                      ● {order.status.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div className="order-card-items">
                    {order.items.map((item, index) => (
                      <div className="flex items-center justify-between text-sm py-1" key={`${item.product}-${index}`}>
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-[#8f97a3] font-mono">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-6">
                      <span>
                        <span className="text-[10px] font-mono uppercase text-[#8f97a3] block">TOTAL AMOUNT</span>
                        <strong className="text-[#ccff00] text-base font-mono">{formatPrice(order.totalAmount)}</strong>
                      </span>
                      <span>
                        <span className="text-[10px] font-mono uppercase text-[#8f97a3] block">PAYMENT</span>
                        <strong className="text-white text-sm font-mono">{order.paymentStatus}</strong>
                      </span>
                    </div>

                    <Link className="button button-dark !py-2.5 !px-5 !text-xs" to={`/orders/${order._id}`}>
                      View Details <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default Orders
