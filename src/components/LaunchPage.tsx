import { useEffect, useState } from 'react'

export default function LaunchPage({ onLaunch }: { onLaunch: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'blast'>('idle')
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (phase !== 'countdown') return
    if (count === 0) {
      setPhase('blast')
      const t = window.setTimeout(onLaunch, 1700)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setCount((c) => c - 1), 750)
    return () => window.clearTimeout(t)
  }, [phase, count, onLaunch])

  const launch = () => {
    if (phase !== 'idle') return
    setCount(3)
    setPhase('countdown')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f1b4d] via-[#1d4ed8] to-[#0f2a6b] px-4 text-center text-white">
      {/* starry sky */}
      <span className="anim-sparkle absolute left-[20%] top-[18%] text-2xl">✦</span>
      <span className="anim-sparkle absolute right-[18%] top-[28%] text-2xl" style={{ animationDelay: '.8s' }}>✦</span>
      <span className="anim-sparkle absolute left-[30%] top-[60%] text-xl" style={{ animationDelay: '1.4s' }}>✦</span>
      <span className="anim-sparkle absolute right-[30%] top-[12%] text-lg" style={{ animationDelay: '.4s' }}>✦</span>
      <span className="anim-sparkle absolute left-[12%] top-[40%] text-lg" style={{ animationDelay: '1.8s' }}>✦</span>

      {/* rushing star streaks on blast-off */}
      {phase === 'blast' && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[8, 22, 38, 55, 70, 85].map((left, i) => (
            <span key={i} className="anim-star-streak absolute h-16 w-1 rounded-full bg-white/80" style={{ left: `${left}%`, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      )}

      {/* drawn rocket: cream body, orange fins, gold porthole, star decal */}
      <div className={phase === 'blast' ? 'anim-rocket relative z-10' : 'anim-sway relative z-10'} aria-hidden>
        <svg viewBox="0 0 120 190" className="h-44 w-28 drop-shadow-2xl md:h-52 md:w-32">
          <polygon points="30,120 8,168 34,156" fill="#e64e24" />
          <polygon points="90,120 112,168 86,156" fill="#e64e24" />
          <path d="M60 6 C82 26 90 62 90 108 L90 132 L30 132 L30 108 C30 62 38 26 60 6 Z" fill="#fdf6e3" stroke="#f5a623" strokeWidth="3" />
          <circle cx="60" cy="66" r="16" fill="#f5a623" />
          <circle cx="60" cy="66" r="11" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="2" />
          <text x="60" y="112" textAnchor="middle" fontSize="20" fill="#e64e24">★</text>
          <rect x="46" y="132" width="28" height="10" fill="#94a3b8" />
        </svg>
        {/* flame + smoke, grows while counting down */}
        <div
          className="anim-flame mx-auto -mt-1 rounded-b-full bg-gradient-to-b from-yellow-300 via-orange-500 to-orange-600 transition-all"
          style={{ height: phase === 'idle' ? 28 : phase === 'countdown' ? 44 + (3 - count) * 14 : 72, width: 26 }}
        />
        {phase !== 'idle' && (
          <p className="mt-2 text-2xl opacity-90">💨 ☁️ ✨</p>
        )}
      </div>

      {/* countdown */}
      {phase === 'countdown' && (
        <p key={count} className="anim-pop relative z-10 mt-4 font-hand text-8xl font-bold text-lime-300 drop-shadow-lg">{count}</p>
      )}
      {phase === 'blast' && (
        <p className="anim-pop relative z-10 mt-4 font-hand text-6xl font-bold text-yellow-300 drop-shadow-lg">Blast off!</p>
      )}
      {phase === 'idle' && (
        <p className="relative z-10 mt-4 font-hand text-3xl text-lime-300">get ready…</p>
      )}

      <h1 className="relative z-10 mt-4 font-hand text-6xl font-bold leading-none md:text-7xl">
        <span className="block">MAKE</span>
        <span className="block text-lime-400">YOUR</span>
        <span className="block">MAGIC</span>
      </h1>
      <p className="relative z-10 mt-3 max-w-sm text-white/85">Our fest is ready to launch. A man is standing by — tap launch and watch him shoot the ball as the rocket goes up!</p>

      {/* man standing, ready to shoot */}
      <div className="relative z-10 mt-6 flex flex-col items-center" aria-label="Man standing ready to launch">
        <div className="h-10 w-10 rounded-full bg-amber-800" />
        <div className="mt-1 h-16 w-12 rounded-t-2xl bg-yellow-400" />
        <div className="flex gap-1">
          <div className="h-12 w-4 rounded bg-blue-900" />
          <div className="h-12 w-4 rounded bg-blue-900" />
        </div>
        <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-700 bg-white text-sm">⚽</div>
      </div>

      <button
        onClick={launch}
        disabled={phase !== 'idle'}
        className="relative z-10 mt-8 rounded-full bg-orange-500 px-10 py-4 font-hand text-3xl font-bold text-white shadow-xl hover:scale-105 disabled:opacity-70"
      >
        {phase === 'idle' ? 'Launch' : phase === 'countdown' ? 'Launching…' : 'Blast off!'}
      </button>
      {phase === 'countdown' && <p className="relative z-10 mt-3 font-hand text-2xl text-lime-300">Here we go!</p>}
    </div>
  )
}
