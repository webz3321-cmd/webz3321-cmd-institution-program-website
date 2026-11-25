import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Play, Pause, Music } from 'lucide-react'
import Hero from './components/Hero'
import Admin from './components/Admin'
import CreativityStudio from './components/CreativityStudio'
import LaunchPage from './components/LaunchPage'
import { CandidatesPage, DownloadsPage, GalleryPage, ProgramsPage, ResultsPage, TeamsPage, UpdatesPage } from './components/Pages'
import { loadData, saveData } from './lib/store'
import type { SiteData } from './lib/store'
import { ThemeSong } from './lib/audio'

type View = 'home' | 'programs' | 'results' | 'candidates' | 'teams' | 'gallery' | 'updates' | 'downloads'

const MENU: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'programs', label: 'Programs' },
  { id: 'results', label: 'Results' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'teams', label: 'Teams' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'updates', label: 'Updates' },
  { id: 'downloads', label: 'Downloads' },
]

function useCountdown(dateStr: string) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  return useMemo(() => {
    if (!dateStr) return null
    const diff = new Date(dateStr + 'T00:00:00').getTime() - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }, [dateStr, now])
}

function SingingMan() {
  return (
    <div className="anim-pop relative flex flex-col items-center" aria-label="Singing man">
      <span className="anim-note absolute -top-8 left-0 text-2xl">♪</span>
      <span className="anim-note absolute -top-6 right-0 text-xl" style={{ animationDelay: '.7s' }}>♫</span>
      <span className="anim-note absolute -top-4 left-6 text-lg" style={{ animationDelay: '1.3s' }}>♩</span>
      {/* head with open singing mouth */}
      <div className="relative h-12 w-12 rounded-full bg-[#8d5a2b] shadow">
        <span className="absolute left-3 top-4 h-1.5 w-1.5 rounded-full bg-slate-900" />
        <span className="absolute right-3 top-4 h-1.5 w-1.5 rounded-full bg-slate-900" />
        <span className="anim-sing-mouth absolute bottom-2 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-full bg-red-500" />
        <span className="absolute -top-1 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full bg-slate-900" />
      </div>
      {/* lime scarf */}
      <div className="relative z-10 -mt-1 h-3 w-16 -rotate-2 rounded-full bg-lime-400 shadow" />
      <div className="h-1.5 w-3 rotate-12 self-end rounded-full bg-lime-500" />
      {/* orange jacket */}
      <div className="mt-1 h-16 w-16 rounded-t-3xl bg-orange-500 shadow">
        <span className="mx-auto mt-2 block h-8 w-1 rounded-full bg-white/50" />
      </div>
      {/* arm holding a microphone */}
      <div className="mt-1 flex items-center gap-1">
        <span className="h-2 w-8 -rotate-12 rounded-full bg-[#8d5a2b]" />
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800">
          <span className="h-2 w-2 rounded-full bg-slate-400" />
        </span>
      </div>
      <p className="mt-2 rounded-full bg-white px-3 py-0.5 font-hand text-lg text-orange-600 shadow">singing along!</p>
    </div>
  )
}

export default function App() {
  const [data, setData] = useState<SiteData>(() => loadData())
  const [view, setView] = useState<View>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [launched, setLaunched] = useState(false)
  const songRef = useRef<ThemeSong | null>(null)
  const countdown = useCountdown(data.settings.date)

  useEffect(() => { saveData(data) }, [data])
  useEffect(() => () => { songRef.current?.stop() }, [])

  const toggleSong = () => {
    songRef.current ??= new ThemeSong()
    if (playing) { songRef.current.stop(); setPlaying(false) }
    else { songRef.current.start(); setPlaying(true) }
  }

  const go = (v: View) => { setView(v); setMenuOpen(false); window.scrollTo({ top: 0 }) }
  const s = data.settings

  // Launch page (admin-controlled, default OFF)
  if (s.launchEnabled && !launched) {
    return <LaunchPage onLaunch={() => setLaunched(true)} />
  }

  const stats = [
    { label: 'Programs', value: data.programs.length },
    { label: 'Candidates', value: data.candidates.length },
    { label: 'Teams', value: data.teams.length },
    { label: 'Results Out', value: data.results.length },
  ]

  return (
    <div className="min-h-screen bg-[#fdf6e3]">
      {/* round Menu button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed right-4 top-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#e64e24] font-hand text-xl font-bold text-white shadow-xl"
        aria-label="Open menu"
      >
        Menu
      </button>

      {/* Menu panel — small rounded deep-blue box, Sibaq-style */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-[#0f2a6b]/70" onClick={() => setMenuOpen(false)} />
          <div className="anim-pop absolute right-3 top-3 w-72 rounded-3xl bg-[#1d4ed8] p-5 text-white shadow-2xl md:right-6">
            <div className="flex justify-end"><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
            <nav className="mt-2 space-y-1">
              {MENU.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => go(m.id)}
                  className={`flex w-full items-baseline gap-3 rounded-xl px-3 py-2 text-left font-hand text-2xl hover:bg-white/10 ${view === m.id ? 'text-lime-400 underline' : ''}`}
                >
                  <span className="text-base">0{i + 1}</span><span>{m.label.toUpperCase()}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {view === 'home' && (
        <>
          <Hero programName={s.programName} themeLine={s.themeLine} date={s.date} time={s.time} venue={s.venue} institutionName={s.institutionName} />

          {/* countdown in glowing lantern bubbles */}
          {s.showCountdown && countdown && (
            <section className="bg-[#0f766e] py-8 text-center text-white">
              <p className="font-hand text-3xl">Countdown to the fest</p>
              <div className="mt-3 flex justify-center gap-3">
                {[['Days', countdown.days], ['Hours', countdown.hours], ['Minutes', countdown.minutes], ['Seconds', countdown.seconds]].map(([label, v]) => (
                  <div key={label} className="relative rounded-3xl border-2 border-amber-300/60 bg-white/10 px-4 py-3 shadow-[0_0_24px_rgba(245,166,35,.45)]">
                    <span className="absolute -top-2 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-amber-400" />
                    <p className="text-2xl font-bold">{v}</p>
                    <p className="text-xs">{label}</p>
                  </div>
                ))}
              </div>
              {(s.date || s.venue) && <p className="mt-3 text-white/80">{s.date} {s.time && `• ${s.time}`} {s.venue && `• ${s.venue}`}</p>}
            </section>
          )}

          {/* welcome / about + stats */}
          <section className="mx-auto max-w-4xl px-4 py-10 text-center">
            <h2 className="font-serif text-3xl font-bold">{s.institutionName || 'Welcome to our fest'}</h2>
            <p className="mt-3 text-slate-600">{s.about || 'A celebration of talent — programs, results, candidates and teams, all in one place. Come and make your magic with us!'}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((st) => (
                <div key={st.label} className="rounded-3xl bg-white p-4 shadow">
                  <p className="font-serif text-3xl font-bold text-orange-600">{st.value}</p>
                  <p className="text-sm text-slate-500">{st.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Creativity Corner */}
          <section className="bg-orange-500 px-4 py-10 text-center text-white">
            <h2 className="font-hand text-5xl font-bold">Creativity Corner</h2>
            <p className="mt-2 text-white/90">Draw, write and make your own poster — then download it.</p>
            <div className="relative mx-auto mt-6 flex max-w-2xl flex-col items-center gap-4">
              {/* singing man appears only while the theme song plays */}
              {playing && <SingingMan />}
              {!playing && <p className="font-hand text-2xl text-yellow-200">press play… a singer pops in here 🎤</p>}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => setStudioOpen(true)} className="rounded-full bg-white px-6 py-3 font-bold text-orange-600 shadow">Start creating</button>
                <button onClick={toggleSong} className="flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-3 font-bold text-orange-800 shadow">
                  {playing ? <Pause size={18} /> : <Play size={18} />} {playing ? 'Pause theme song' : 'Play theme song'}
                </button>
              </div>
              <p className="flex items-center gap-1 text-sm text-white/80"><Music size={14} /> Theme song is an original WebAudio tune in this standalone version.</p>
            </div>
            {/* big tilted wooden pencil, drawn — not an emoji */}
            <button onClick={() => setStudioOpen(true)} className="anim-sway mx-auto mt-6 block" aria-label="Open drawing studio">
              <svg viewBox="0 0 60 180" className="mx-auto h-28 w-10 -rotate-12 drop-shadow-xl" aria-hidden>
                <rect x="18" y="0" width="24" height="26" rx="6" fill="#ec4899" />
                <rect x="18" y="24" width="24" height="10" fill="#f59e0b" />
                <rect x="18" y="34" width="24" height="96" fill="#fde68a" />
                <rect x="26" y="34" width="8" height="96" fill="#fcd34d" />
                <polygon points="18,130 42,130 30,168" fill="#fde68a" />
                <polygon points="26,150 34,150 30,168" fill="#334155" />
              </svg>
              <span className="mt-1 inline-block rounded-full bg-white px-3 py-0.5 font-hand text-xl text-orange-600 shadow">create!</span>
            </button>
          </section>

        </>
      )}

      {view === 'programs' && <ProgramsPage data={data} onHome={() => go('home')} />}
      {view === 'results' && <ResultsPage data={data} onHome={() => go('home')} />}
      {view === 'candidates' && <CandidatesPage data={data} onHome={() => go('home')} />}
      {view === 'teams' && <TeamsPage data={data} onHome={() => go('home')} />}
      {view === 'gallery' && <GalleryPage data={data} onHome={() => go('home')} />}
      {view === 'updates' && <UpdatesPage data={data} onHome={() => go('home')} />}
      {view === 'downloads' && <DownloadsPage data={data} onHome={() => go('home')} />}

      {/* footer on EVERY page */}
      <footer className="bg-[#0f2a6b] px-4 py-8 text-center text-white">
        <p className="font-hand text-3xl">MAKE YOUR MAGIC</p>
        {s.institutionName && <p className="mt-1">{s.institutionName}</p>}
        {s.venue && <p className="text-white/70">{s.venue}</p>}
        <p className="mt-2 text-sm text-white/50">© Institution Program Website — made with MAKE YOUR MAGIC</p>
      </footer>

      {/* gold admin dot — fixed on every page */}
      <button
        onClick={() => setAdminOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-4 w-4 rounded-full bg-yellow-400 shadow ring-2 ring-yellow-200"
        aria-label="Open admin"
        title="Admin"
      />

      {studioOpen && <CreativityStudio onClose={() => setStudioOpen(false)} />}
      {adminOpen && <Admin data={data} onChange={setData} onClose={() => setAdminOpen(false)} />}
    </div>
  )
}
