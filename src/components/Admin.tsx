import { useState } from 'react'
import { X } from 'lucide-react'
import { checkPasscode, hasPasscode, setPasscode, uid } from '../lib/store'
import type { Candidate, DownloadItem, GalleryItem, Program, ResultItem, SiteData, Team, UpdateItem } from '../lib/store'

type Tab = 'settings' | 'programs' | 'results' | 'candidates' | 'teams' | 'gallery' | 'updates' | 'downloads'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export default function Admin({ data, onChange, onClose }: { data: SiteData; onChange: (d: SiteData) => void; onClose: () => void }) {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState<Tab>('settings')
  const isSetup = !hasPasscode()

  const submitPass = async () => {
    if (isSetup) {
      if (newPass.length < 4) { setErr('Choose a passcode of at least 4 characters.'); return }
      await setPasscode(newPass)
      setAuthed(true)
    } else {
      if (await checkPasscode(pass)) setAuthed(true)
      else setErr('Wrong passcode. Try again.')
    }
  }

  if (!authed) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/70 p-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">🔒 Admin Access</h2>
            <button onClick={onClose} aria-label="Close admin"><X /></button>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {isSetup ? 'No passcode is set yet. Choose one now — it is stored only in this browser, never hardcoded.' : 'Enter the admin passcode you set.'}
          </p>
          <input
            type="password"
            value={isSetup ? newPass : pass}
            onChange={(e) => isSetup ? setNewPass(e.target.value) : setPass(e.target.value)}
            placeholder={isSetup ? 'Choose a passcode' : 'Passcode'}
            className="mt-4 w-full rounded-xl border px-4 py-3"
            onKeyDown={(e) => { if (e.key === 'Enter') void submitPass() }}
          />
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          <button onClick={() => void submitPass()} className="mt-4 w-full rounded-full bg-orange-500 py-3 font-bold text-white">{isSetup ? 'Set passcode & open admin' : 'Open admin'}</button>
          <p className="mt-2 text-center text-xs text-slate-400">Passcode is set on first use. Never share it.</p>
        </div>
      </div>
    )
  }

  const s = data.settings
  const setSettings = (patch: Partial<typeof s>) => onChange({ ...data, settings: { ...s, ...patch } })

  const tabs: { id: Tab; label: string }[] = [
    { id: 'settings', label: 'Website Settings' },
    { id: 'programs', label: 'Programs' },
    { id: 'results', label: 'Results' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'teams', label: 'Teams' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'updates', label: 'Updates' },
    { id: 'downloads', label: 'Downloads' },
  ]

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/70 p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-serif text-2xl font-bold">Admin Panel</h2>
          <button onClick={onClose} aria-label="Close admin"><X /></button>
        </div>
        <div className="flex flex-wrap gap-2 border-b p-3">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full px-3 py-1 text-sm font-bold ${tab === t.id ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>
              {t.label}{t.id === 'candidates' ? ` (${data.candidates.length})` : ''}{t.id === 'results' ? ` (${data.results.length})` : ''}{t.id === 'programs' ? ` (${data.programs.length})` : ''}{t.id === 'teams' ? ` (${data.teams.length})` : ''}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto p-4">
          {tab === 'settings' && <SettingsForm data={data} setSettings={setSettings} />}
          {tab === 'programs' && <ProgramsForm data={data} onChange={onChange} />}
          {tab === 'results' && <ResultsForm data={data} onChange={onChange} />}
          {tab === 'candidates' && <CandidatesForm data={data} onChange={onChange} />}
          {tab === 'teams' && <TeamsForm data={data} onChange={onChange} />}
          {tab === 'gallery' && <GalleryForm data={data} onChange={onChange} />}
          {tab === 'updates' && <UpdatesForm data={data} onChange={onChange} />}
          {tab === 'downloads' && <DownloadsForm data={data} onChange={onChange} />}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}<span className="mt-1 block font-normal">{children}</span></label>
}
const inputCls = 'w-full rounded-xl border px-3 py-2'

function SettingsForm({ data, setSettings }: { data: SiteData; setSettings: (p: Partial<SiteData['settings']>) => void }) {
  const s = data.settings
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Institution name"><input className={inputCls} value={s.institutionName} onChange={(e) => setSettings({ institutionName: e.target.value })} placeholder="Leave empty until you know it" /></Field>
      <Field label="Program / fest name"><input className={inputCls} value={s.programName} onChange={(e) => setSettings({ programName: e.target.value })} placeholder="e.g. Arts and Sports Programme" /></Field>
      <Field label="Theme line"><input className={inputCls} value={s.themeLine} onChange={(e) => setSettings({ themeLine: e.target.value })} /></Field>
      <Field label="Date"><input type="date" className={inputCls} value={s.date} onChange={(e) => setSettings({ date: e.target.value })} /></Field>
      <Field label="Time"><input className={inputCls} value={s.time} onChange={(e) => setSettings({ time: e.target.value })} placeholder="e.g. 6:45 AM" /></Field>
      <Field label="Venue"><input className={inputCls} value={s.venue} onChange={(e) => setSettings({ venue: e.target.value })} /></Field>
      <Field label="About"><textarea className={inputCls} value={s.about} onChange={(e) => setSettings({ about: e.target.value })} rows={3} /></Field>
      <div className="space-y-2 md:col-span-2">
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.showCountdown} onChange={(e) => setSettings({ showCountdown: e.target.checked })} /> Show countdown (needs a date)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.gameEnabled} onChange={(e) => setSettings({ gameEnabled: e.target.checked })} /> Show football game on empty Results page</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.launchEnabled} onChange={(e) => setSettings({ launchEnabled: e.target.checked })} /> Show the Launch page first</label>
      </div>
    </div>
  )
}

function ProgramsForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [title, setTitle] = useState('')
  const [variety, setVariety] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [desc, setDesc] = useState('')
  const add = () => {
    if (!title.trim()) return
    const p: Program = { id: uid(), title: title.trim(), variety, date, venue, description: desc }
    onChange({ ...data, programs: [...data.programs, p] })
    setTitle(''); setVariety(''); setDate(''); setVenue(''); setDesc('')
  }
  return (
    <div>
      <div className="grid gap-2 md:grid-cols-2">
        <input className={inputCls} placeholder="Program title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={inputCls} placeholder="Variety / category" value={variety} onChange={(e) => setVariety(e.target.value)} />
        <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        <input className={inputCls} placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
        <input className={`${inputCls} md:col-span-2`} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <button onClick={add} className="mt-3 rounded-full bg-orange-500 px-5 py-2 font-bold text-white">Add program</button>
      <ul className="mt-4 space-y-2">
        {data.programs.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <span><b>{p.title}</b> {p.variety && <span className="text-sm text-slate-500">• {p.variety}</span>}</span>
            <button className="text-red-600" onClick={() => onChange({ ...data, programs: data.programs.filter((x) => x.id !== p.id) })}>Delete</button>
          </li>
        ))}
        {!data.programs.length && <p className="text-sm text-slate-500">No programs yet — add one above.</p>}
      </ul>
    </div>
  )
}

function ResultsForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [admissionNo, setAdmissionNo] = useState('')
  const [variety, setVariety] = useState('')
  const [team, setTeam] = useState('')
  const [points, setPoints] = useState('')
  const [position, setPosition] = useState('')
  const found = data.candidates.find((c) => c.admissionNo.trim().toLowerCase() === admissionNo.trim().toLowerCase())
  const add = () => {
    if (!found) return
    const r: ResultItem = {
      id: uid(), admissionNo: found.admissionNo, candidateName: found.name, photo: found.photo,
      team: team || found.team, variety, points: Number(points) || 0, position,
    }
    onChange({ ...data, results: [...data.results, r] })
    setAdmissionNo(''); setVariety(''); setTeam(''); setPoints(''); setPosition('')
  }
  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">Enter the admission number only — the candidate's photo, name and team fill in automatically from Candidates.</p>
      <div className="grid gap-2 md:grid-cols-2">
        <input className={inputCls} placeholder="Admission number" value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} />
        <input className={inputCls} placeholder="Variety / category" value={variety} onChange={(e) => setVariety(e.target.value)} />
        <input className={inputCls} placeholder="Team name" value={team} onChange={(e) => setTeam(e.target.value)} list="team-names" />
        <datalist id="team-names">{data.teams.map((t) => <option key={t.id} value={t.name} />)}</datalist>
        <input className={inputCls} placeholder="Points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
        <input className={inputCls} placeholder="Position (e.g. 1st)" value={position} onChange={(e) => setPosition(e.target.value)} />
      </div>
      {admissionNo && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          {found ? (
            <>
              {found.photo && <img src={found.photo} alt={found.name} className="h-12 w-12 rounded-full object-cover" />}
              <span><b>{found.name}</b> • {found.team || 'No team'} • Adm. {found.admissionNo}</span>
            </>
          ) : <span className="text-red-600">No candidate with admission number “{admissionNo}” — register them in Candidates first.</span>}
        </div>
      )}
      <button onClick={add} disabled={!found} className="mt-3 rounded-full bg-orange-500 px-5 py-2 font-bold text-white disabled:opacity-40">Add result</button>
      <ul className="mt-4 space-y-2">
        {data.results.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <span className="flex items-center gap-2">{r.photo && <img src={r.photo} alt="" className="h-8 w-8 rounded-full object-cover" />}<b>{r.candidateName}</b> • {r.variety} • {r.team} • {r.points} pts {r.position && `• ${r.position}`}</span>
            <button className="text-red-600" onClick={() => onChange({ ...data, results: data.results.filter((x) => x.id !== r.id) })}>Delete</button>
          </li>
        ))}
        {!data.results.length && <p className="text-sm text-slate-500">No results published yet — the football game shows on the Results page until you publish one.</p>}
      </ul>
    </div>
  )
}

function CandidatesForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [name, setName] = useState('')
  const [admissionNo, setAdmissionNo] = useState('')
  const [team, setTeam] = useState('')
  const [photo, setPhoto] = useState('')
  const add = () => {
    if (!name.trim() || !admissionNo.trim()) return
    const c: Candidate = { id: uid(), name: name.trim(), admissionNo: admissionNo.trim(), team, photo }
    onChange({ ...data, candidates: [...data.candidates, c] })
    setName(''); setAdmissionNo(''); setTeam(''); setPhoto('')
  }
  return (
    <div>
      <div className="grid gap-2 md:grid-cols-2">
        <input className={inputCls} placeholder="Candidate name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={inputCls} placeholder="Admission number" value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} />
        <input className={inputCls} placeholder="Team name" value={team} onChange={(e) => setTeam(e.target.value)} list="team-names-2" />
        <datalist id="team-names-2">{data.teams.map((t) => <option key={t.id} value={t.name} />)}</datalist>
        <label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
          Photo <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await fileToDataUrl(f)) }} />
        </label>
      </div>
      {photo && <img src={photo} alt="Candidate preview" className="mt-2 h-16 w-16 rounded-full object-cover" />}
      <button onClick={add} className="mt-3 rounded-full bg-orange-500 px-5 py-2 font-bold text-white">Register candidate</button>
      <ul className="mt-4 space-y-2">
        {data.candidates.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <span className="flex items-center gap-2">{c.photo && <img src={c.photo} alt="" className="h-8 w-8 rounded-full object-cover" />}<b>{c.name}</b> • Adm. {c.admissionNo} • {c.team || 'No team'}</span>
            <button className="text-red-600" onClick={() => onChange({ ...data, candidates: data.candidates.filter((x) => x.id !== c.id) })}>Delete</button>
          </li>
        ))}
        {!data.candidates.length && <p className="text-sm text-slate-500">No candidates registered yet.</p>}
      </ul>
    </div>
  )
}

function TeamsForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [name, setName] = useState('')
  const [colour, setColour] = useState('#e64e24')
  const add = () => {
    if (!name.trim()) return
    const t: Team = { id: uid(), name: name.trim(), colour }
    onChange({ ...data, teams: [...data.teams, t] })
    setName('')
  }
  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">Add the 4 teams here (name + colour). You can add, edit by deleting and re-adding, or delete teams.</p>
      <div className="flex gap-2">
        <input className={inputCls} placeholder="Team name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="color" value={colour} onChange={(e) => setColour(e.target.value)} className="h-10 w-12 cursor-pointer" aria-label="Team colour" />
        <button onClick={add} className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white">Add team</button>
      </div>
      <ul className="mt-4 space-y-2">
        {data.teams.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <span className="flex items-center gap-2"><span className="h-5 w-5 rounded-full" style={{ background: t.colour }} /><b>{t.name}</b> • {data.candidates.filter((c) => c.team === t.name).length} candidates</span>
            <button className="text-red-600" onClick={() => onChange({ ...data, teams: data.teams.filter((x) => x.id !== t.id) })}>Delete</button>
          </li>
        ))}
        {!data.teams.length && <p className="text-sm text-slate-500">No teams yet.</p>}
      </ul>
    </div>
  )
}

function GalleryForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [title, setTitle] = useState('')
  const add = async (f: File | undefined) => {
    if (!f) return
    const image = await fileToDataUrl(f)
    const g: GalleryItem = { id: uid(), title: title || f.name, image }
    onChange({ ...data, gallery: [...data.gallery, g] })
    setTitle('')
  }
  return (
    <div>
      <div className="flex gap-2">
        <input className={inputCls} placeholder="Photo title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className="cursor-pointer rounded-full bg-orange-500 px-5 py-2 font-bold text-white">Upload <input type="file" accept="image/*" className="hidden" onChange={(e) => void add(e.target.files?.[0])} /></label>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {data.gallery.map((g) => (
          <div key={g.id} className="relative">
            <img src={g.image} alt={g.title} className="h-24 w-full rounded-xl object-cover" />
            <button className="absolute right-1 top-1 rounded bg-white px-1 text-xs text-red-600" onClick={() => onChange({ ...data, gallery: data.gallery.filter((x) => x.id !== g.id) })}>✕</button>
          </div>
        ))}
      </div>
      {!data.gallery.length && <p className="mt-3 text-sm text-slate-500">No gallery photos yet.</p>}
    </div>
  )
}

function UpdatesForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [text, setText] = useState('')
  const add = () => {
    if (!title.trim()) return
    const u: UpdateItem = { id: uid(), title: title.trim(), date, text }
    onChange({ ...data, updates: [...data.updates, u] })
    setTitle(''); setDate(''); setText('')
  }
  return (
    <div>
      <div className="grid gap-2">
        <input className={inputCls} placeholder="Update title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        <input className={inputCls} placeholder="Details" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button onClick={add} className="mt-3 rounded-full bg-orange-500 px-5 py-2 font-bold text-white">Add update</button>
      <ul className="mt-4 space-y-2">{data.updates.map((u) => (
        <li key={u.id} className="flex justify-between rounded-xl bg-slate-50 p-3"><span><b>{u.title}</b> {u.date && `• ${u.date}`}</span><button className="text-red-600" onClick={() => onChange({ ...data, updates: data.updates.filter((x) => x.id !== u.id) })}>Delete</button></li>
      ))}</ul>
    </div>
  )
}

function DownloadsForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const add = () => {
    if (!title.trim()) return
    const dl: DownloadItem = { id: uid(), title: title.trim(), url, note }
    onChange({ ...data, downloads: [...data.downloads, dl] })
    setTitle(''); setUrl(''); setNote('')
  }
  return (
    <div>
      <div className="grid gap-2">
        <input className={inputCls} placeholder="File title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={inputCls} placeholder="Link / URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <input className={inputCls} placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <button onClick={add} className="mt-3 rounded-full bg-orange-500 px-5 py-2 font-bold text-white">Add download</button>
      <ul className="mt-4 space-y-2">{data.downloads.map((d) => (
        <li key={d.id} className="flex justify-between rounded-xl bg-slate-50 p-3"><span><b>{d.title}</b> {d.note && `• ${d.note}`}</span><button className="text-red-600" onClick={() => onChange({ ...data, downloads: data.downloads.filter((x) => x.id !== d.id) })}>Delete</button></li>
      ))}</ul>
    </div>
  )
}
