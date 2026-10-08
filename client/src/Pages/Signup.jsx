import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import StatusMessage from '../components/StatusMessage.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })
  const [loader, setLoader] = useState(false)
  const [err, setErr] = useState(location.state?.message || '')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    setErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoader(true)
    try {
      const response = await axiosInstance.post('/customer/register', form)
      setUser(response.data.customer)
      setLoader(false)
      navigate('/home', { replace: true })
    } catch (error) {
      setLoader(false)
      if (error.response?.status === 409) {
        navigate('/login', {
          state: { message: 'You are already a user. Please log in instead.' },
        })
        return
      }
      setErr(error.response?.data?.message || 'Unable to register. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#090a0d] text-[#f5f6f8] flex flex-col justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_rgba(204,255,0,0.06)_0%,_rgba(99,102,241,0.04)_40%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Editorial Visual Brand Panel */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-10 rounded-2xl bg-gradient-to-br from-[#161922] to-[#101217] border border-white/10 min-h-[580px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <Link className="inline-flex items-center gap-3 font-display font-extrabold text-2xl text-white tracking-tight" to="/">
              <span className="brand-mark !w-10 !h-10 !text-lg">N</span>
              <span>Nexora</span>
            </Link>

            <div className="mt-14">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#ccff00] font-semibold">
                CREATE PROFILE // 01
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white mt-3 leading-tight">
                Unlock exclusive drops and instantaneous checkout.
              </h2>
              <p className="text-[#8f97a3] text-sm mt-3 leading-relaxed">
                Join thousands of shoppers enjoying verified authentic merchandise, lightning-fast domestic dispatch, and instant wishlist management.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#8f97a3]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              REGISTRATION OPEN
            </span>
            <span>NO ANNUAL FEES</span>
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="lg:col-span-7 max-w-md w-full mx-auto">
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden inline-flex items-center justify-center mb-4">
              <Link className="brand" to="/">
                <span className="brand-mark">N</span>
                <span>Nexora</span>
              </Link>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white">Create your account</h1>
            <p className="text-[#8f97a3] text-sm mt-2">
              Fill in your details below to activate your Nexora profile.
            </p>
          </div>

          <div className="auth-card">
            <form className="auth-form" onSubmit={handleSubmit}>
              <StatusMessage message={err} />

              <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Alex Morgan"
                  value={form.fullName}
                  className="auth-input"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  className="auth-input"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={form.email}
                  className="auth-input"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Password (Minimum 6 Characters)</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={form.password}
                  className="auth-input"
                  onChange={handleChange}
                  minLength="6"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loader}
                  className="button button-accent auth-submit w-full"
                >
                  {loader ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Activate Account →'
                  )}
                </button>
              </div>
            </form>

            <p className="auth-terms mt-6 text-center text-xs text-[#5a6270]">
              By signing up, you agree to Nexora's{' '}
              <a href="#terms" className="text-[#8f97a3] hover:text-[#ccff00] underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#privacy" className="text-[#8f97a3] hover:text-[#ccff00] underline">Privacy Policy</a>.
            </p>
          </div>

          <p className="auth-switch text-center text-sm text-[#8f97a3] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#ccff00] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
