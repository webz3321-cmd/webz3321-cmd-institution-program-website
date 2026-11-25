import { useMemo, useRef, useState } from 'react'

type Shot = 'goal' | 'saved' | 'miss'
const SHOTS = 5

function keeperRead(level: number): number {
  // Chance the keeper correctly reads the shot: Lv1 ~42% -> Lv5 ~85%
  return Math.min(0.85, 0.42 + (level - 1) * 0.11)
}

export default function PenaltyGame() {
  const [started, setStarted] = useState(false)
  const [shots, setShots] = useState<Shot[]>([])
  const [goals, setGoals] = useState(0)
  const [ball, setBall] = useState<{ x: number; y: number } | null>(null)
  const [ballFlying, setBallFlying] = useState(false)
  const [keeper, setKeeper] = useState<{ dive: 'left' | 'right' | 'centre'; saved: boolean; celebrating: boolean }>({ dive: 'centre', saved: false, celebrating: false })
  const [message, setMessage] = useState('')
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)
  const pitchRef = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)

  const level = Math.min(5, goals + 1)
  const reactionMs = Math.max(60, 150 - (level - 1) * 22)
  const finished = shots.length >= SHOTS

  const shoot = (clientX: number, clientY: number) => {
    if (!started || finished || busyRef.current || !pitchRef.current) return
    const rect = pitchRef.current.getBoundingClientRect()
    const x = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(8, Math.min(70, ((clientY - rect.top) / rect.height) * 100))
    busyRef.current = true
    setBallFlying(true)
    setBall({ x, y })
    setMessage('')
    // Keeper reads the shot: faster + smarter as level rises.
    const reads = Math.random() < keeperRead(level)
    const zone: 'left' | 'right' | 'centre' = x < 38 ? 'left' : x > 62 ? 'right' : 'centre'
    // From Lv2 the keeper sometimes feints the wrong way first.
    const feint = level >= 2 && Math.random() < 0.3
    const diveZone = feint ? (zone === 'left' ? 'right' : zone === 'right' ? 'left' : 'centre') : reads ? zone : (['left', 'right', 'centre'] as const)[Math.floor(Math.random() * 3)]
    const keeperX = diveZone === 'left' ? 28 : diveZone === 'right' ? 72 : 50
    const distance = Math.abs(x - keeperX)
    const reach = 16 + level * 2 // gloves reach grows with level
    const saved = distance < reach && y < 62
    const offTarget = x < 12 || x > 88 || y < 10

    window.setTimeout(() => {
      setKeeper({ dive: diveZone, saved, celebrating: saved })
      const outcome: Shot = offTarget ? 'miss' : saved ? 'saved' : 'goal'
      setShots((s) => [...s, outcome])
      if (outcome === 'goal') setGoals((g) => g + 1)
      setMessage(offTarget ? 'OFF TARGET!' : saved ? 'SAVED! What a keeper!' : 'GOAL!')
      window.setTimeout(() => {
        setBallFlying(false)
        setBall(null)
        setKeeper({ dive: 'centre', saved: false, celebrating: false })
        busyRef.current = false
      }, 1100)
    }, reactionMs + 380)
  }

  const reset = () => { setShots([]); setGoals(0); setMessage(''); setStarted(true) }

  const hint = useMemo(() => {
    if (finished) return ''
    return level >= 4 ? 'The keeper is lightning fast now — aim for the corners!' : level >= 2 ? 'Keeper Lv ' + level + ' — he is getting quicker. Place it well!' : 'Tap where the ball should fly — or drag and release to shoot.'
  }, [level, finished])

  if (!started) {
    return (
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-[#f97316] px-4 text-center text-white">
        {/* decorative circles must never block clicks */}
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute left-[8%] top-[12%] h-16 w-16 rounded-full border-2 border-white" />
          <div className="absolute right-[10%] top-[55%] h-24 w-24 rounded-full border-2 border-white" />
          <div className="absolute bottom-[8%] left-[20%] h-12 w-12 rounded-full border-2 border-white" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
        <p className="font-hand text-4xl text-yellow-200 md:text-6xl">WE'RE</p>
        <p className="font-hand text-6xl font-bold md:text-8xl">MAKING IT</p>
        <p className="mt-3 max-w-md text-white/90">Results are not out yet — beat the keeper instead. Five penalties, one strong keeper.</p>
        <button onClick={() => setStarted(true)} className="mt-6 rounded-full bg-yellow-300 px-8 py-3 font-hand text-2xl font-bold text-orange-700 shadow-lg hover:scale-105">
          Play Now
        </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-center font-hand text-3xl text-orange-600">while the results cook…</p>
      <h2 className="text-center font-serif text-4xl font-bold">Penalty Shootout!</h2>
      <p className="mt-2 text-center text-slate-600">Drag on the pitch and let go to shoot, or just tap where the ball should fly. Five shots!</p>
      <div className="mt-3 flex items-center justify-center gap-2">
        {Array.from({ length: SHOTS }).map((_, i) => (
          <span key={i} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm ${shots[i] === 'goal' ? 'border-green-500 bg-green-100' : shots[i] ? 'border-red-400 bg-red-100' : 'border-slate-300 bg-white'}`}>
            {shots[i] === 'goal' ? '⚽' : shots[i] ? '✕' : '•'}
          </span>
        ))}
        <span className="ml-2 font-bold">Goals: {goals}</span>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">Keeper Lv {level}</span>
      </div>
      <p className="mt-2 text-center text-sm text-slate-500">{hint}</p>

      <div
        ref={pitchRef}
        className="relative mt-4 h-80 cursor-crosshair overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-b from-sky-500 to-green-600 shadow-xl md:h-96"
        onPointerDown={(e) => setDrag({ x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => { if (drag) { shoot(e.clientX, e.clientY); setDrag(null) } }}
        onClick={(e) => { if (!drag) shoot(e.clientX, e.clientY) }}
      >
        {/* goal */}
        <div className="absolute left-1/2 top-6 h-44 w-3/4 -translate-x-1/2 rounded border-4 border-white bg-white/10 md:h-52">
          <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(#ffffff33 1px, transparent 1px), linear-gradient(90deg, #ffffff33 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        </div>
        {/* keeper — drawn: orange No.1 jersey, navy shorts, striped socks, big gold gloves, real face */}
        <div
          className="absolute left-1/2 top-[10%] z-10 -translate-x-1/2 text-center transition-all"
          style={{
            transform: `translateX(calc(-50% + ${keeper.dive === 'left' ? '-70px' : keeper.dive === 'right' ? '70px' : '0px'})) rotate(${keeper.dive === 'left' ? -38 : keeper.dive === 'right' ? 38 : 0}deg)`,
            transitionDuration: `${Math.max(240, 380 - (level - 1) * 35)}ms`,
          }}
          aria-label="Goalkeeper"
        >
          <div className="relative mx-auto h-16 w-16 rounded-full bg-[#8d5a2b] shadow">
            <span className="absolute left-4 top-6 h-2 w-2 rounded-full bg-slate-900" />
            <span className="absolute right-4 top-6 h-2 w-2 rounded-full bg-slate-900" />
            <span className="absolute bottom-3 left-1/2 h-1.5 w-5 -translate-x-1/2 rounded-full bg-slate-900/70" />
            <span className="absolute -top-1 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full bg-slate-900" />
          </div>
          <div className="relative z-10 mx-auto -mt-1 flex w-24 flex-col items-center rounded-t-2xl bg-orange-500 py-1 font-bold text-white shadow">
            <span className="rounded-full bg-white px-2 text-orange-600">1</span>
          </div>
          <div className="mx-auto flex w-20 justify-center gap-1">
            <span className="h-10 w-4 rounded bg-[#1e293b]" />
            <span className="h-10 w-4 rounded bg-[#1e293b]" />
          </div>
          <div className="mx-auto flex w-24 justify-between px-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-lg shadow ring-2 ring-yellow-200">✋</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-lg shadow ring-2 ring-yellow-200">✋</span>
          </div>
          <div className="mx-auto mt-1 flex w-20 justify-center gap-3">
            <span className="h-3 w-6 rounded-full bg-white shadow" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#1e293b 0 4px,#fff 4px 8px)' }} />
            <span className="h-3 w-6 rounded-full bg-white shadow" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#1e293b 0 4px,#fff 4px 8px)' }} />
          </div>
          {keeper.celebrating && <p className="mt-1 font-hand text-2xl font-bold text-yellow-300">What a save! 🎉</p>}
          {!keeper.celebrating && keeper.dive === 'centre' && message === 'GOAL!' && <p className="mt-1 font-hand text-xl font-bold text-white/90">oh no…</p>}
        </div>
        {/* ball */}
        {ball && (
          <div
            className="absolute z-20 h-8 w-8 rounded-full border-2 border-slate-700 bg-white shadow transition-all duration-500"
            style={{ left: `${ball.x}%`, top: `${ball.y}%`, opacity: ballFlying ? 1 : 0.4 }}
          >
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
          </div>
        )}
        {keeper.saved && <span className="absolute left-1/2 top-1/3 z-30 text-4xl">✨</span>}
        <p className="absolute bottom-2 left-0 right-0 text-center font-hand text-2xl text-white drop-shadow">beat the keeper!</p>
      </div>

      {message && <p className="anim-pop mt-4 text-center font-hand text-4xl font-bold text-orange-600">{message}</p>}

      {finished && (
        <div className="anim-pop mt-6 rounded-3xl bg-white p-6 text-center shadow-xl">
          <h3 className="font-serif text-3xl font-bold">Full time!</h3>
          <p className="mt-2 text-lg">You scored <b>{goals}</b> out of {SHOTS} against a Lv {level} keeper.</p>
          <p className="text-slate-600">{goals >= 4 ? 'Superstar finishing!' : goals >= 2 ? 'Good shooting — the keeper was strong!' : 'The keeper won this one. Try again!'}</p>
          <button onClick={reset} className="mt-4 rounded-full bg-orange-500 px-6 py-2 font-bold text-white shadow hover:bg-orange-600">Play again</button>
        </div>
      )}
    </div>
  )
}
