import { useEffect, useRef, useState } from 'react'
import { X, Pencil, Eraser, PaintBucket, Undo2, Redo2 } from 'lucide-react'

const COLOURS = ['#1b1b1f', '#e64e24', '#f5a623', '#2fa84f', '#1c9bd8', '#5b4bdb', '#d6379b', '#ffffff']
const BACKGROUNDS = [
  { name: 'Fest cream', css: 'linear-gradient(135deg,#fdf6e3,#fde68a)' },
  { name: 'Magic sky', css: 'linear-gradient(135deg,#2b6cff,#93c5fd)' },
  { name: 'Sunset', css: 'linear-gradient(135deg,#f97316,#fbbf24)' },
  { name: 'Garden', css: 'linear-gradient(135deg,#22c55e,#a3e635)' },
  { name: 'Night stars', css: 'linear-gradient(135deg,#1e1b4b,#7c3aed)' },
  { name: 'Stage lights', css: 'linear-gradient(135deg,#db2777,#f97316)' },
]

function drawPosterFromImage(imgSrc: string, name: string, bgCss: string, story: boolean): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const w = story ? 1080 : 1200
    const h = story ? 1920 : 900
    const out = document.createElement('canvas')
    out.width = w; out.height = h
    const ctx = out.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, '#fdf6e3'); grad.addColorStop(1, '#fde68a')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)
    const pad = story ? 70 : 50
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, pad, pad, w - pad * 2, h * 0.55)
      ctx.fillStyle = '#1b1b1f'
      ctx.font = `bold ${story ? 110 : 72}px cursive`
      ctx.textAlign = 'center'
      ctx.fillText('MAKE YOUR MAGIC', w / 2, h * 0.68)
      ctx.font = `${story ? 44 : 28}px sans-serif`
      ctx.fillText('Marked as my own', w / 2, h * 0.74)
      if (name) { ctx.font = `bold ${story ? 56 : 36}px cursive`; ctx.fillText(name, w / 2, h * 0.82) }
      resolve(out)
    }
    img.onerror = () => resolve(out)
    img.src = imgSrc
  })
}

export default function CreativityStudio({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [colour, setColour] = useState('#e64e24')
  const [size, setSize] = useState(6)
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'fill'>('pencil')
  const [bg, setBg] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [redo, setRedo] = useState<string[]>([])
  const [showPoster, setShowPoster] = useState(false)
  const [posterImg, setPosterImg] = useState('')
  const [name, setName] = useState('')
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const fit = () => {
      const parent = canvas.parentElement!
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const snapshot = () => {
    const c = canvasRef.current!
    setHistory((h) => [...h.slice(-19), c.toDataURL()])
    setRedo([])
  }
  const restore = (url: string) => {
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    const img = new Image()
    img.onload = () => { ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0) }
    img.src = url
  }
  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h
      const prev = h[h.length - 1]
      setRedo((r) => [canvasRef.current!.toDataURL(), ...r])
      restore(prev)
      return h.slice(0, -1)
    })
  }
  const redoFn = () => {
    setRedo((r) => {
      if (!r.length) return r
      restore(r[0])
      return r.slice(1)
    })
  }

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const onDown = (e: React.PointerEvent) => {
    if (tool === 'fill') {
      const ctx = canvasRef.current!.getContext('2d')!
      snapshot()
      ctx.fillStyle = colour
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      return
    }
    drawing.current = true
    last.current = pos(e)
    snapshot()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const p = pos(e)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : colour
    // Eraser rubs through to the background: use destination-out on a transparent canvas
    // over the coloured background div, so it looks like rubbing through.
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.lineWidth = size * 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'
    last.current = p
  }
  const onUp = () => { drawing.current = false; last.current = null }

  const download = async (story: boolean) => {
    const out = await drawPosterFromImage(posterImg, name, BACKGROUNDS[bg].css, story)
    const a = document.createElement('a')
    a.download = story ? 'make-your-magic-story.png' : 'make-your-magic-poster.png'
    a.href = out.toDataURL('image/png')
    a.click()
  }
  const share = async () => {
    const out = await drawPosterFromImage(posterImg, name, BACKGROUNDS[bg].css, false)
    out.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'make-your-magic-poster.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'MAKE YOUR MAGIC' }).catch(() => undefined)
      } else {
        await download(false)
      }
    })
  }
  const openPoster = () => { setPosterImg(canvasRef.current!.toDataURL()); setShowPoster(true) }

  if (showPoster) {
    return (
      <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-y-auto bg-slate-900/80 p-4">
        <div className="anim-pop w-full max-w-sm rotate-2 rounded-2xl bg-[#fdf6e3] p-4 shadow-2xl">
          <div className="relative overflow-hidden rounded-xl" style={{ background: BACKGROUNDS[bg].css }}>
            {posterImg && <img src={posterImg} alt="Your drawing" className="h-56 w-full object-contain" />}
            <div className="flex items-center justify-center p-4 text-center">
              <p className="font-hand text-4xl font-bold text-white drop-shadow">MAKE YOUR MAGIC</p>
            </div>
            <span className="absolute right-2 top-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold">★ GOLD SEAL</span>
          </div>
          <p className="mt-3 text-center text-sm italic">Marked as my own</p>
          {name && <p className="text-center font-hand text-3xl font-bold">{name}</p>}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add your name"
          className="mt-4 w-full max-w-sm rounded-xl border px-4 py-3 text-center"
        />
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <button onClick={share} className="rounded-full bg-green-500 px-5 py-2 font-bold text-white shadow">⇪ Share</button>
          <button onClick={() => download(true)} className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white shadow">Insta story</button>
          <button onClick={() => download(false)} className="rounded-full bg-green-600 px-5 py-2 font-bold text-white shadow">⬇ Download</button>
          <button onClick={() => setShowPoster(false)} className="rounded-full bg-white px-5 py-2 font-bold shadow">Back to drawing</button>
          <button onClick={onClose} className="rounded-full bg-slate-800 px-5 py-2 font-bold text-white shadow">Close</button>
        </div>
        <p className="mt-2 max-w-sm text-center text-xs text-white/70">Note: the poster preview shows your drawing area and name. Download saves a real PNG.</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col border-8 border-orange-500 bg-[#2b6cff]">
      <button onClick={onClose} className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow" aria-label="Close drawing"><X /></button>
      <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-orange-500 px-3 py-1 font-hand text-xl text-white">MAKE IT YOUR OWN</div>
      <p className="pointer-events-none absolute right-4 top-16 z-10 font-hand text-3xl text-white drop-shadow">MAKE YOUR MAGIC</p>
      <div className="relative flex-1" style={{ background: BACKGROUNDS[bg].css }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <p className="font-hand text-6xl text-white">Draw here ✎</p>
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
      </div>
      {/* compact toolbar — small so Export stays visible */}
      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-2 py-1 shadow-xl">
        <button onClick={() => setTool('pencil')} className={`flex h-7 w-7 items-center justify-center rounded-full ${tool === 'pencil' ? 'bg-orange-500 text-white' : ''}`} aria-label="Pencil"><Pencil size={15} /></button>
        <button onClick={() => setTool('eraser')} className={`flex h-7 w-7 items-center justify-center rounded-full ${tool === 'eraser' ? 'bg-orange-500 text-white' : ''}`} aria-label="Eraser"><Eraser size={15} /></button>
        <button onClick={() => setTool('fill')} className={`flex h-7 w-7 items-center justify-center rounded-full ${tool === 'fill' ? 'bg-orange-500 text-white' : ''}`} aria-label="Fill"><PaintBucket size={15} /></button>
        {COLOURS.map((c) => (
          <button key={c} onClick={() => setColour(c)} className={`h-5 w-5 rounded-full border ${colour === c ? 'ring-2 ring-orange-500' : ''}`} style={{ background: c }} aria-label={`Colour ${c}`} />
        ))}
        <input type="color" value={colour} onChange={(e) => setColour(e.target.value)} className="h-6 w-6 cursor-pointer rounded-full" aria-label="Pick any colour" />
        {[3, 6, 12].map((s) => (
          <button key={s} onClick={() => setSize(s)} className={`flex h-6 w-6 items-center justify-center rounded-full ${size === s ? 'bg-slate-200' : ''}`} aria-label={`Brush size ${s}`}>
            <span className="rounded-full bg-slate-800" style={{ width: s, height: s }} />
          </button>
        ))}
        <button onClick={undo} className="flex h-7 w-7 items-center justify-center rounded-full" aria-label="Undo"><Undo2 size={15} /></button>
        <button onClick={redoFn} className="flex h-7 w-7 items-center justify-center rounded-full" aria-label="Redo"><Redo2 size={15} /></button>
        <button
          onClick={() => { const c = canvasRef.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); snapshot() }}
          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold"
        >Clear</button>
      </div>
      <button onClick={openPoster} className="absolute bottom-2 left-2 z-10 rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white shadow-lg">Export</button>
      <div className="absolute bottom-2 right-2 z-10 flex gap-1">
        {BACKGROUNDS.map((b, i) => (
          <button key={b.name} onClick={() => setBg(i)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${bg === i ? 'bg-white text-slate-900' : 'bg-black/30 text-white'}`}>{b.name}</button>
        ))}
      </div>
    </div>
  )
}
