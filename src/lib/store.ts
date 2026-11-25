export interface Settings {
  institutionName: string
  programName: string
  themeLine: string
  date: string
  time: string
  venue: string
  about: string
  showCountdown: boolean
  gameEnabled: boolean
  launchEnabled: boolean
}

export interface Program {
  id: string
  title: string
  variety: string
  date: string
  venue: string
  description: string
}

export interface Candidate {
  id: string
  name: string
  admissionNo: string
  team: string
  photo: string
}

export interface Team {
  id: string
  name: string
  colour: string
}

export interface ResultItem {
  id: string
  admissionNo: string
  candidateName: string
  photo: string
  team: string
  variety: string
  points: number
  position: string
}

export interface GalleryItem { id: string; title: string; image: string }
export interface UpdateItem { id: string; title: string; date: string; text: string }
export interface DownloadItem { id: string; title: string; url: string; note: string }

export interface SiteData {
  settings: Settings
  programs: Program[]
  results: ResultItem[]
  candidates: Candidate[]
  teams: Team[]
  gallery: GalleryItem[]
  updates: UpdateItem[]
  downloads: DownloadItem[]
}

export const emptySettings: Settings = {
  institutionName: '',
  programName: '',
  themeLine: 'MAKE YOUR MAGIC',
  date: '',
  time: '',
  venue: '',
  about: '',
  showCountdown: true,
  gameEnabled: true,
  launchEnabled: false,
}

export const emptyData: SiteData = {
  settings: emptySettings,
  programs: [],
  results: [],
  candidates: [],
  teams: [],
  gallery: [],
  updates: [],
  downloads: [],
}

const KEY = 'institution-program-website-v1'

export function loadData(): SiteData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(emptyData)
    const parsed = JSON.parse(raw) as Partial<SiteData>
    return {
      ...structuredClone(emptyData),
      ...parsed,
      settings: { ...emptySettings, ...(parsed.settings ?? {}) },
    }
  } catch {
    return structuredClone(emptyData)
  }
}

export function saveData(data: SiteData) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* storage full / unavailable */ }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

/** Points per team, summed from real published results. */
export function teamPoints(data: SiteData): { team: string; points: number }[] {
  const map = new Map<string, number>()
  for (const r of data.results) {
    const t = r.team || '—'
    map.set(t, (map.get(t) ?? 0) + (Number(r.points) || 0))
  }
  for (const t of data.teams) if (!map.has(t.name)) map.set(t.name, 0)
  return [...map.entries()]
    .map(([team, points]) => ({ team, points }))
    .sort((a, b) => b.points - a.points)
}

/** Topper list: candidates ranked by total points from real results. */
export function toppers(data: SiteData): { name: string; admissionNo: string; photo: string; team: string; points: number }[] {
  const map = new Map<string, { name: string; admissionNo: string; photo: string; team: string; points: number }>()
  for (const r of data.results) {
    const key = r.admissionNo || r.candidateName
    const cur = map.get(key) ?? { name: r.candidateName, admissionNo: r.admissionNo, photo: r.photo, team: r.team, points: 0 }
    cur.points += Number(r.points) || 0
    map.set(key, cur)
  }
  return [...map.values()].sort((a, b) => b.points - a.points)
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const PASS_KEY = 'institution-program-website-passcode'
export function hasPasscode(): boolean { return !!localStorage.getItem(PASS_KEY) }
export async function setPasscode(p: string) { localStorage.setItem(PASS_KEY, await sha256(p)) }
export async function checkPasscode(p: string): Promise<boolean> {
  return localStorage.getItem(PASS_KEY) === (await sha256(p))
}
