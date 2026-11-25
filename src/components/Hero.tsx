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
      // Low arc band BELOW the headline (headline sits ~12-35%): letters
      // sweep left->right at 50-66%, form the phrase, hold, then fade.
      const left = 36 + t * 52
      const top = 66 - Math.sin(t * Math.PI) * 16
      const colour = i < 4 ? colours[0] : i < 8 ? colours[1] : colours[2]
      chars.push({ ch, colour, left, top, delay: 0.9 + t * 1.3 })
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
            animation: `magicLetter 5s ease-in-out ${l.delay}s infinite`,
            opacity: 0,
          }}
        >
          {l.ch}
        </span>
      ))}
    </div>
  )
}

export default function Hero({ programName, themeLine, date, time, venue, institutionName }: { programName: string; themeLine: string; date?: string; time?: string; venue?: string; institutionName?: string }) {
  const words = themeLine.trim() ? themeLine.trim().split(/\s+/).slice(0, 3) : WORDS.map((w) => w.text)
  const detailPills = [institutionName, date, time, venue].filter(Boolean)
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#2b6cff] text-white">
      {/* fluffy clouds: overlapping circles, not flat pills */}
      <div className="anim-cloud absolute left-[10%] top-[14%] opacity-90" aria-hidden>
        <span className="absolute left-0 top-3 h-8 w-20 rounded-full bg-pink-200/90" />
        <span className="absolute left-4 -top-1 h-9 w-9 rounded-full bg-pink-200/90" />
        <span className="absolute left-10 top-0 h-7 w-7 rounded-full bg-pink-200/90" />
      </div>
      <div className="anim-cloud absolute right-[8%] top-[22%] opacity-90" style={{ animationDelay: '1.2s' }} aria-hidden>
        <span className="absolute left-0 top-3 h-7 w-16 rounded-full bg-pink-200/80" />
        <span className="absolute left-3 -top-1 h-8 w-8 rounded-full bg-pink-200/80" />
        <span className="absolute left-9 top-0 h-6 w-6 rounded-full bg-pink-200/80" />
      </div>
      <div className="anim-cloud absolute left-[4%] top-[44%] opacity-70" style={{ animationDelay: '2s' }} aria-hidden>
        <span className="absolute left-0 top-2 h-6 w-16 rounded-full bg-white/60" />
        <span className="absolute left-3 -top-1 h-7 w-7 rounded-full bg-white/60" />
      </div>
      <span className="anim-sparkle absolute left-[30%] top-[30%] text-2xl">✦</span>
      <span className="anim-sparkle absolute right-[22%] top-[14%] text-2xl" style={{ animationDelay: '.7s' }}>✦</span>
      <span className="anim-sparkle absolute left-[55%] top-[55%] text-xl" style={{ animationDelay: '1.4s' }}>✦</span>

      {/* giant orange hand from the top, with puppet threads */}
      <div className="anim-hand-in absolute -left-4 -top-2 z-10 w-56 md:w-72" aria-hidden>
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

      {/* puppet threads — routed BEHIND the headline (z-0, bent down the
          left and right edges, below the headline) so they never cross it */}
      <svg className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d="M14 8 L26 42 L38 66" fill="none" stroke="white" strokeWidth="0.35" className="string-line" pathLength={100} style={{ animationDelay: '.2s' }} />
        <path d="M17 10 L30 44 L44 64" fill="none" stroke="white" strokeWidth="0.35" className="string-line" pathLength={100} style={{ animationDelay: '.35s' }} />
        <path d="M20 12 L33 46 L48 68" fill="none" stroke="white" strokeWidth="0.35" className="string-line" pathLength={100} style={{ animationDelay: '.5s' }} />
        <path d="M16 9 C40 12 68 30 84 52 L88 72" fill="none" stroke="white" strokeWidth="0.3" className="string-line" pathLength={100} style={{ animationDelay: '.9s' }} />
        <path d="M19 11 C44 14 72 32 86 54 L90 70" fill="none" stroke="white" strokeWidth="0.3" className="string-line" pathLength={100} style={{ animationDelay: '1.05s' }} />
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
        <svg viewBox="0 0 300 14" className="mt-3 h-3 w-56 md:w-72" aria-hidden>
          <path d="M4 9 Q 75 2 150 7 T 296 6" fill="none" stroke="#a3e635" strokeWidth="5" strokeLinecap="round" />
          <path d="M20 12 Q 150 6 280 10" fill="none" stroke="#f5a623" strokeWidth="3" strokeLinecap="round" opacity=".8" />
        </svg>
        {detailPills.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {detailPills.map((p) => (
              <span key={p} className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur">{p}</span>
            ))}
          </div>
        )}
        {programName && (
          <p className="mt-3 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur">{programName}</p>
        )}
      </div>

      {/* flying ball + magic letters */}
      <div className="anim-ball-fly absolute z-30 h-9 w-9 rounded-full border-2 border-slate-700 bg-white shadow-lg" aria-hidden>
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
      </div>
      <MagicLetters />

      {/* marionette footballer — BIG, in a kicking pose, ball at his boot */}
      <div className="anim-foot-in absolute bottom-[15%] left-1/2 z-20 -translate-x-1/2" aria-label="Marionette footballer shooting a football">
        <div className="anim-sway flex flex-col items-center">
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-[#8d5a2b] shadow" />
            <span className="absolute left-3 top-5 h-2 w-2 rounded-full bg-slate-900" />
            <span className="absolute right-3 top-5 h-2 w-2 rounded-full bg-slate-900" />
            <div className="absolute -top-1 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full bg-slate-900" />
          </div>
          {/* arms out, yellow kit */}
          <div className="mt-1 flex items-start">
            <span className="mt-3 h-2.5 w-10 -rotate-45 rounded-full bg-[#f59e0b]" />
            <div className="h-24 w-16 rounded-t-3xl bg-yellow-400 shadow">
              <span className="mx-auto mt-2 block h-1 w-8 rounded-full bg-white/60" />
              <span className="mx-auto mt-1 block font-hand text-xl font-bold leading-none text-orange-700">9</span>
            </div>
            <span className="mt-3 h-2.5 w-10 rotate-45 rounded-full bg-[#f59e0b]" />
          </div>
          <div className="flex items-start gap-2">
            <div className="h-16 w-5 rounded bg-blue-900" />
            <div className="anim-kick-leg h-16 w-5 rounded bg-blue-900" />
          </div>
          <div className="-mt-1 flex gap-4">
            <span className="h-4 w-8 rounded-full bg-yellow-300 shadow" />
            <span className="h-4 w-8 rounded-full bg-yellow-300 shadow" />
          </div>
          {/* ball at his boot */}
          <span className="absolute -bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-700 bg-white text-xs shadow-lg">⚽</span>
        </div>
      </div>

      {/* marionette singer — BIG, singing with mic held up */}
      <div className="anim-singer-in absolute bottom-[13%] right-[4%] z-20" aria-label="Marionette singer with a microphone">
        <div className="anim-sway flex flex-col items-center">
          <span className="anim-note absolute -top-10 left-2 text-2xl">♪</span>
          <span className="anim-note absolute -top-8 right-0 text-xl" style={{ animationDelay: '.8s' }}>♫</span>
          <div className="h-12 w-12 rounded-full bg-amber-900 shadow">
            <span className="mx-auto mt-7 block h-2 w-4 rounded-full bg-red-400" />
          </div>
          <div className="mt-1 h-20 w-14 rounded-t-3xl bg-pink-500 shadow" />
          <div className="mt-1 flex items-center gap-1">
            <span className="h-2.5 w-10 -rotate-12 rounded-full bg-[#8d5a2b]" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            </span>
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
