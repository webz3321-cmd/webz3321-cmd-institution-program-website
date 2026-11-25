import { useState } from 'react'

export default function LaunchPage({ onLaunch }: { onLaunch: () => void }) {
  const [launching, setLaunching] = useState(false)

  const launch = () => {
    if (launching) return
    setLaunching(true)
    window.setTimeout(onLaunch, 1900)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1d4ed8] via-[#2b6cff] to-[#0f2a6b] px-4 text-center text-white">
      <span className="anim-sparkle absolute left-[20%] top-[18%] text-2xl">✦</span>
      <span className="anim-sparkle absolute right-[18%] top-[28%] text-2xl" style={{ animationDelay: '.8s' }}>✦</span>
      <span className="anim-sparkle absolute left-[30%] top-[60%] text-xl" style={{ animationDelay: '1.4s' }}>✦</span>

      {/* rocket */}
      <div className={launching ? 'anim-rocket relative z-10' : 'relative z-10'} aria-hidden>
        <div className="text-7xl md:text-8xl">🚀</div>
        <div className="anim-flame mx-auto -mt-2 h-10 w-6 rounded-b-full bg-gradient-to-b from-yellow-300 to-orange-600" />
        {launching && <p className="mt-2 text-3xl">💨 ☁️ ✨</p>}
      </div>

      <h1 className="mt-6 font-hand text-6xl font-bold leading-none md:text-7xl">
        <span className="block">MAKE</span>
        <span className="block text-lime-400">YOUR</span>
        <span className="block">MAGIC</span>
      </h1>
      <p className="mt-3 max-w-sm text-white/85">Our fest is ready to launch. A man is standing by — tap launch and watch him shoot the ball as the rocket goes up!</p>

      {/* man standing, ready to shoot */}
      <div className="mt-6 flex flex-col items-center" aria-label="Man standing ready to launch">
        <div className="h-10 w-10 rounded-full bg-amber-800" />
        <div className="mt-1 h-16 w-12 rounded-t-2xl bg-yellow-400" />
        <div className="flex gap-1">
          <div className="h-12 w-4 rounded bg-blue-900" />
          <div className="h-12 w-4 rounded bg-blue-900" />
        </div>
        <div className="mt-2 h-8 w-8 rounded-full border-2 border-slate-700 bg-white">⚽</div>
      </div>

      <button
        onClick={launch}
        disabled={launching}
        className="mt-8 rounded-full bg-orange-500 px-10 py-4 font-hand text-3xl font-bold text-white shadow-xl hover:scale-105 disabled:opacity-70"
      >
        {launching ? 'Launching… 🚀' : 'Launch 🚀'}
      </button>
      {launching && <p className="mt-3 font-hand text-2xl text-lime-300">Here we go!</p>}
    </div>
  )
}
