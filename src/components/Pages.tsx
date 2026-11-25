import { teamPoints, toppers } from '../lib/store'
import type { SiteData } from '../lib/store'
import PenaltyGame from './PenaltyGame'

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow">
      <p className="text-3xl">✦</p>
      <p className="mt-1 font-hand text-3xl font-bold text-orange-600">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  )
}

export function PageShell({ title, onHome, children }: { title: string; onHome: () => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fdf6e3]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-4">
        <button onClick={onHome} className="rounded-full bg-white px-4 py-2 font-bold shadow">← Home</button>
        <h1 className="font-serif text-3xl font-bold md:text-4xl">{title}</h1>
        <span className="w-20" />
      </div>
      {children}
    </div>
  )
}

export function ProgramsPage({ data, onHome }: { data: SiteData; onHome: () => void }) {
  return (
    <PageShell title="Programs" onHome={onHome}>
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 md:grid-cols-2">
        {data.programs.map((p) => (
          <article key={p.id} className="rounded-3xl bg-white p-5 shadow">
            <h2 className="font-serif text-2xl font-bold">{p.title}</h2>
            {p.variety && <p className="mt-1 rounded-full bg-orange-100 px-3 py-0.5 text-sm font-bold text-orange-700 inline-block">{p.variety}</p>}
            <p className="mt-2 text-sm text-slate-600">{p.date} {p.venue && `• ${p.venue}`}</p>
            {p.description && <p className="mt-2">{p.description}</p>}
          </article>
        ))}
        {!data.programs.length && <div className="md:col-span-2"><EmptyState title="Programs coming soon!" text="No programs added yet — add them in the admin panel and they will appear here." /></div>}
      </div>
    </PageShell>
  )
}

export function ResultsPage({ data, onHome }: { data: SiteData; onHome: () => void }) {
  if (!data.results.length && data.settings.gameEnabled) {
    return (
      <PageShell title="Results" onHome={onHome}>
        <PenaltyGame />
      </PageShell>
    )
  }
  return (
    <PageShell title="Results" onHome={onHome}>
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-8">
        {data.results.map((r) => (
          <article key={r.id} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow">
            {r.photo ? <img src={r.photo} alt={r.candidateName} className="h-14 w-14 rounded-full object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-xl">👤</span>}
            <div className="flex-1">
              <h2 className="font-serif text-xl font-bold">{r.candidateName}</h2>
              <p className="text-sm text-slate-600">{r.variety} • {r.team} • Adm. {r.admissionNo}</p>
            </div>
            <div className="text-right">
              <p className="font-hand text-3xl font-bold text-orange-600">{r.position || ''}</p>
              <p className="text-sm font-bold">{r.points} pts</p>
            </div>
          </article>
        ))}
        {!data.results.length && <EmptyState title="No results yet!" text="Results will appear here as soon as they are published." />}
      </div>
    </PageShell>
  )
}

export function CandidatesPage({ data, onHome }: { data: SiteData; onHome: () => void }) {
  return (
    <PageShell title="Candidates" onHome={onHome}>
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:grid-cols-2 md:grid-cols-3">
        {data.candidates.map((c) => (
          <article key={c.id} className="rounded-3xl bg-white p-5 text-center shadow">
            {c.photo ? <img src={c.photo} alt={c.name} className="mx-auto h-20 w-20 rounded-full object-cover" /> : <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-3xl">👤</span>}
            <h2 className="mt-2 font-serif text-xl font-bold">{c.name}</h2>
            <p className="text-sm text-slate-600">Adm. {c.admissionNo}</p>
            {c.team && <p className="mt-1 inline-block rounded-full bg-orange-100 px-3 py-0.5 text-sm font-bold text-orange-700">{c.team}</p>}
          </article>
        ))}
        {!data.candidates.length && <div className="md:col-span-3"><EmptyState title="Candidates coming soon!" text="No candidates registered yet — register them in the admin panel and they will appear here." /></div>}
      </div>
    </PageShell>
  )
}

export function TeamsPage({ data, onHome }: { data: SiteData; onHome: () => void }) {
  const board = teamPoints(data)
  const tops = toppers(data)
  const max = Math.max(1, ...board.map((b) => b.points))
  return (
    <PageShell title="Teams" onHome={onHome}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {!data.teams.length && <EmptyState title="Teams coming soon!" text="The teams will line up here once the admin adds them." />}
        <div className="grid gap-4 md:grid-cols-2">
          {data.teams.map((t) => {
            const members = data.candidates.filter((c) => c.team === t.name)
            return (
              <section key={t.id} className="rounded-3xl bg-white p-5 shadow">
                <h2 className="flex items-center gap-2 font-serif text-2xl font-bold"><span className="h-5 w-5 rounded-full" style={{ background: t.colour }} />{t.name}</h2>
                <p className="text-sm text-slate-500">{members.length} candidate{members.length === 1 ? '' : 's'}</p>
                <ul className="mt-3 space-y-2">
                  {members.map((c) => (
                    <li key={c.id} className="flex items-center gap-2">
                      {c.photo ? <img src={c.photo} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">👤</span>}
                      <span><b>{c.name}</b> <span className="text-sm text-slate-500">• Adm. {c.admissionNo}</span></span>
                    </li>
                  ))}
                  {!members.length && <li className="text-sm text-slate-400">No candidates in this team yet.</li>}
                </ul>
              </section>
            )
          })}
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow">
          <h2 className="font-serif text-2xl font-bold">🏆 Team Leaderboard</h2>
          <p className="text-sm text-slate-500">Live from real published results — updates automatically when results are added.</p>
          {board.length ? (
            <div className="mt-4 space-y-3">
              {board.map((b, i) => (
                <div key={b.team}>
                  <div className="flex justify-between text-sm font-bold"><span>{i + 1}. {b.team}</span><span>{b.points} pts</span></div>
                  <div className="mt-1 h-5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.max(4, (b.points / max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="mt-3 text-sm text-slate-500">No points yet — publish results to fill the leaderboard.</p>}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow">
          <h2 className="font-serif text-2xl font-bold">⭐ Toppers</h2>
          {tops.length ? (
            <ol className="mt-3 space-y-2">
              {tops.map((t, i) => (
                <li key={t.admissionNo + t.name} className="flex items-center gap-3">
                  <span className="font-hand text-2xl font-bold text-orange-600">#{i + 1}</span>
                  {t.photo ? <img src={t.photo} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">👤</span>}
                  <span className="flex-1"><b>{t.name}</b> <span className="text-sm text-slate-500">• {t.team} • Adm. {t.admissionNo}</span></span>
                  <b>{t.points} pts</b>
                </li>
              ))}
            </ol>
          ) : <p className="mt-3 text-sm text-slate-500">No toppers yet — they appear automatically from results.</p>}
        </section>
      </div>
    </PageShell>
  )
}

export function GalleryPage({ data, onHome }: { data: SiteData; onHome: () => void }) {
  return (
    <PageShell title="Gallery" onHome={onHome}>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 py-8 md:grid-cols-3">
        {data.gallery.map((g) => (
          <figure key={g.id} className="overflow-hidden rounded-3xl bg-white shadow">
            <img src={g.image} alt={g.title} className="h-48 w-full object-cover" />
            <figcaption className="p-3 font-bold">{g.title}</figcaption>
          </figure>
        ))}
        {!data.gallery.length && <div className="md:col-span-3"><EmptyState title="Gallery coming soon!" text="No photos yet — add them in the admin panel and they will appear here." /></div>}
      </div>
    </PageShell>
  )
}

export function UpdatesPage({ data, onHome }: { data: SiteData; onHome: () => void }) {
  return (
    <PageShell title="Updates" onHome={onHome}>
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-8">
        {data.updates.map((u) => (
          <article key={u.id} className="rounded-3xl bg-white p-5 shadow">
            <h2 className="font-serif text-xl font-bold">{u.title}</h2>
            {u.date && <p className="text-sm text-slate-500">{u.date}</p>}
            {u.text && <p className="mt-1">{u.text}</p>}
          </article>
        ))}
        {!data.updates.length && <EmptyState title="No updates yet!" text="News and updates will appear here when they are added." />}
      </div>
    </PageShell>
  )
}

export function DownloadsPage({ data, onHome }: { data: SiteData; onHome: () => void }) {
  return (
    <PageShell title="Downloads" onHome={onHome}>
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-8">
        {data.downloads.map((d) => (
          <article key={d.id} className="flex items-center justify-between rounded-3xl bg-white p-5 shadow">
            <div><h2 className="font-serif text-xl font-bold">{d.title}</h2>{d.note && <p className="text-sm text-slate-600">{d.note}</p>}</div>
            {d.url ? <a href={d.url} target="_blank" rel="noreferrer" className="rounded-full bg-orange-500 px-4 py-2 font-bold text-white">Download</a> : <span className="text-sm text-slate-400">No link yet</span>}
          </article>
        ))}
        {!data.downloads.length && <EmptyState title="No downloads yet!" text="Files and brochures will appear here when they are added." />}
      </div>
    </PageShell>
  )
}
