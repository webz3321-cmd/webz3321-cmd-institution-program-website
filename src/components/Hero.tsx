import { useMemo } from 'react'

const WORDS: { text: string; colour: string }[] = [
  { text: 'MAKE', colour: '#ffffff' },
  { text: 'YOUR', colour: '#a3e635' },
  { text: 'MAGIC', colour: '#ffffff' },
]

/** Letters of MAKE YOUR MAGIC, positioned along the ball's flight arc. */
function MagicLetters() {
  const letters = useMemo(() => {
    const chars: { ch: string; colour: string; left: number; top: number; delay: number }[] = []
    let i = 0
    const phrase = 'MAKEYOURMAGIC'
    const colours = ['#ffffff', '#a3e635', '#ffffff']
    let word = 0
    for (const ch of phrase) {
      if (ch === 'M' && i > 0) word += 0 // keep simple: colour by word position below
      void word
      const t = i / (phrase.length - 1)
      // arc: left 40% -> 88%, top dips up in the middle
      const left = 40 + t * 48
      const top = 62 - Math.sin(t * Math.PI) * 34
      const colour = i < 4 ? colours[0] : i < 8 ? colours[1] : colours[2]
      chars.push({ ch, colour, left, top, delay: 1.7 + t * 1.1 })
      i += 1
    }
    return chars
  }, [])
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {letters.map((l, idx) => (
        <span
          key={idx}
          className="absolute font-hand text-3xl font-bold md:text-5xl"
          style={{
            left: `${l.left}%`,
            top: `${l.top}%`,
            color: l.colour,
            textShadow: '0 2px 10px rgba(0,0,0,.35)',
            animation: `magicLetter 3.4s ease-in-out ${l.delay}s infinite`,
            opacity: 0,
          }}
        >
          {l.ch}
        </span>
      ))}
    </div>
  )
}

export default function Hero({ programName, themeLine }: { programName: string; themeLine: string }) {
  const words = themeLine.trim() ? themeLine.trim().split(/\s+/).slice(0, 3) : WORDS.map((w) => w.text)
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#2b6cff] text-white">
      {/* sky, clouds, sparkles */}
      <div className="anim-cloud absolute left-[12%] top-[16%] h-8 w-28 rounded-full bg-pink-200/80" />
      <div className="anim-cloud absolute right-[10%] top-[24%] h-7 w-24 rounded-full bg-pink-200/70" style={{ animationDelay: '1.2s' }} />
      <div className="anim-cloud absolute left-[6%] top-[46%] h-6 w-20 rounded-full bg-white/50" style={{ animationDelay: '2s' }} />
      <span className="anim-sparkle absolute left-[30%] top-[30%] text-2xl">✦</span>
      <span className="anim-sparkle absolute right-[22%] top-[14%] text-2xl" style={{ animationDelay: '.7s' }}>✦</span>
      <span className="anim-sparkle absolute left-[55%] top-[55%] text-xl" style={{ animationDelay: '1.4s' }}>✦</span>

      {/* giant orange hand from the top, with puppet threads */}
      <div className="anim-hand-in absolute -left-4 -top-2 z-10 w-40 md:w-56" aria-hidden>
        <svg viewBox="0 0 200 170" className="w-full drop-shadow-lg">
          <g fill="#f97316" stroke="#ea580c" strokeWidth="3" strokeLinejoin="round">
            <path d="M10 10 Q60 -10 110 20 Q150 40 140 80 Q130 120 90 130 Q50 140 25 110 Q5 80 10 10 Z" />
            <rect x="118" y="18" width="26" height="72" rx="13" transform="rotate(18 131 54)" />
            <rect x="148" y="34" width="24" height="62" rx="12" transform="rotate(28 160 65)" />
            <rect x="84" y="2" width="26" height="66" rx="13" transform="rotate(4 97 35)" />
            <rect x="48" y="6" width="26" height="58" rx="13" transform="rotate(-10 61 35)" />
          </g>
          <ellipse cx="70" cy="70" rx="22" ry="12" fill="#fdba74" opacity=".7" />
        </svg>
      </div>

      {/* puppet threads */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <line x1="14" y1="8" x2="40" y2="68" stroke="white" strokeWidth="0.35" className="string-line" pathLength={100} style={{ animationDelay: '.6s' }} />
        <line x1="17" y1="10" x2="44" y2="66" stroke="white" strokeWidth="0.35" className="string-line" pathLength={100} style={{ animationDelay: '.85s' }} />
        <line x1="20" y1="12" x2="48" y2="70" stroke="white" strokeWidth="0.35" className="string-line" pathLength={100} style={{ animationDelay: '1.1s' }} />
        <line x1="16" y1="9" x2="86" y2="74" stroke="white" strokeWidth="0.3" className="string-line" pathLength={100} style={{ animationDelay: '2.3s' }} />
        <line x1="19" y1="11" x2="89" y2="72" stroke="white" strokeWidth="0.3" className="string-line" pathLength={100} style={{ animationDelay: '2.45s' }} />
      </svg>

      {/* headline */}
      <div className="relative z-20 flex flex-col items-center pt-24 text-center md:pt-28">
        <h1 className="font-hand text-6xl font-bold leading-[0.9] drop-shadow-lg md:text-8xl">
          {words.map((w, i) => (
            <span key={i} className="block" style={{ color: i === 1 ? '#a3e635' : '#ffffff', transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}>
              {w.toUpperCase()}
            </span>
          ))}
        </h1>
        <div className="mt-3 h-1.5 w-56 rounded-full bg-lime-400 md:w-72" />
        {programName && (
          <p className="mt-4 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur">{programName}</p>
        )}
      </div>

      {/* flying ball + magic letters */}
      <div className="anim-ball-fly absolute z-30 h-9 w-9 rounded-full border-2 border-slate-700 bg-white shadow-lg" aria-hidden>
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
      </div>
      <MagicLetters />

      {/* marionette footballer */}
      <div className="anim-foot-in absolute bottom-[16%] left-1/2 z-20 -translate-x-1/2" aria-label="Marionette footballer shooting a football">
        <div className="anim-sway flex flex-col items-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-amber-800" />
            <div className="absolute -top-1 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full bg-slate-900" />
          </div>
          <div className="mt-1 h-16 w-12 rounded-t-2xl bg-yellow-400 shadow" />
          <div className="flex gap-1">
            <div className="h-12 w-4 rounded bg-blue-900" />
            <div className="anim-kick-leg h-12 w-4 rounded bg-blue-900" />
          </div>
        </div>
      </div>

      {/* marionette singer */}
      <div className="anim-singer-in absolute bottom-[14%] right-[6%] z-20" aria-label="Marionette singer with a microphone">
        <div className="anim-sway flex flex-col items-center">
          <span className="anim-note absolute -top-8 left-2 text-xl">♪</span>
          <span className="anim-note absolute -top-6 right-0 text-lg" style={{ animationDelay: '.8s' }}>♫</span>
          <div className="h-9 w-9 rounded-full bg-amber-900" />
          <div className="mt-1 h-14 w-11 rounded-t-2xl bg-pink-500 shadow" />
          <div className="mt-1 flex items-center gap-1">
            <div className="h-2 w-8 -rotate-12 rounded-full bg-slate-800" />
            <div className="h-4 w-4 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>

      {/* brown hill */}
      <div className="absolute bottom-0 left-0 right-0 h-[13%] rounded-t-[50%] bg-[#8d5a2b]" />
      {/* scrolling ribbon */}
      <div className="absolute bottom-[13%] left-0 right-0 -rotate-1 overflow-hidden bg-[#e64e24] py-1.5">
        <div className="anim-marquee flex w-max gap-6 whitespace-nowrap font-hand text-xl text-white">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>home ✦ programs ✦ results ✦ candidates ✦ teams ✦ gallery ✦ updates ✦ downloads ✦ {themeLine} ✦&nbsp;</span>
          ))}
        </div>
      </div>
    </section>
  )
}
