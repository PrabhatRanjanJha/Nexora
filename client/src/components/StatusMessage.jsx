function StatusMessage({ message, type = 'error' }) {
  if (!message) return null

  const isError = type === 'error'

  return (
    <div 
      className={`p-3.5 rounded-xl border text-sm font-sans flex items-start gap-2.5 transition-all ${
        isError 
          ? 'bg-[#ff3366]/10 border-[#ff3366]/30 text-[#ff4d6d]' 
          : 'bg-[#10b981]/10 border-[#10b981]/30 text-[#00f59b]'
      }`} 
      role={isError ? 'alert' : 'status'}
    >
      <span aria-hidden="true" className="font-mono font-bold text-base leading-none">
        {isError ? '!' : '✓'}
      </span>
      <span className="leading-snug">{message}</span>
    </div>
  )
}

export default StatusMessage
