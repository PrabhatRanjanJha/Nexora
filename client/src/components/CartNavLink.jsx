import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function CartNavLink() {
  const { cartCount } = useCart()

  return (
    <Link className="nav-link relative inline-flex items-center gap-1.5" to="/cart">
      <span>Cart</span>
      <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-mono font-bold rounded-full transition-all ${
        cartCount > 0 
          ? 'bg-[#ccff00] text-[#090a0d] shadow-[0_0_10px_rgba(204,255,0,0.3)]' 
          : 'bg-[#1e222b] text-[#8f97a3] border border-white/10'
      }`}>
        {cartCount}
      </span>
    </Link>
  )
}

export default CartNavLink
