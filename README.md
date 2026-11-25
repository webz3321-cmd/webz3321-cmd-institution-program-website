# Institution Program Website — MAKE YOUR MAGIC

A Sibaq-style illustrated institution program website, built as a standalone
Vite + React + TypeScript + Tailwind app.

## What it is

- **Hero:** deep-blue sky, peach clouds and sparkles, a giant orange hand
  from the top with white puppet threads, a marionette footballer in a
  yellow kit and a marionette singer with a mic. Timed opening animation:
  hand in, threads draw, footballer shoots, the ball flies and writes
  **MAKE YOUR MAGIC** letter by letter in the sky (MAKE white, YOUR lime,
  MAGIC white), then the singer rises in. The ball loop repeats.
- **Home page only:** creative hero + welcome/about + count-up stats +
  Creativity Corner. Results, Gallery and Candidates are **not** stacked on
  the home page — they live behind the Menu.
- **Menu:** round orange button, opens a small rounded deep-blue panel
  sliding in from the right over a navy scrim, numbered hand-lettered
  links: Home, Programs, Results, Candidates, Teams, Gallery, Updates,
  Downloads.
- **Theme song:** play/pause. While it plays, an animated singing man
  appears in the Creativity Corner near the song button (orange jacket,
  lime scarf, mic, mouth moving, music notes). He disappears when paused.
  The tune is an original WebAudio-generated melody — no copyrighted song,
  no audio file.
- **Pencil / Creativity studio:** big tilted pencil button with a
  “create!” label. Opens a full-screen drawing canvas over the hero
  scene, orange frame, X top-left, green Export pill bottom-left, and a
  small compact white toolbar at the bottom (pencil, eraser, fill,
  8 colours + colour wheel, 3 brush sizes, undo, redo, Clear) so Export
  stays visible. Export opens a poster preview: tilted cream poster,
  gold seal, “Marked as my own”, an “Add your name” box that prints the
  name live, and Share / Insta story (tall 1080×1920) / Download PNG.
- **Results game:** when no results are published, the Results page shows
  a full-screen orange “WE'RE MAKING IT” intro with a yellow Play Now
  button. Play opens a penalty shootout: drag/tap to shoot 5 penalties
  against a strong goalkeeper (orange No. 1 jersey, big gold gloves,
  face) who reads shots, dives left/right/centre, gets faster and
  smarter and levels up Lv 1–5 after goals, feints from Lv 2, with a
  save sparkle burst, celebration and a sad reaction on a goal.
  Scoreboard + full-time card with Play again.
- **Launch page (admin-controlled, default OFF):** when enabled, the site
  first shows a launch page with a man standing and a Launch button, plus
  a rocket going up creatively — tap Launch, he shoots the ball and the
  rocket lifts off with fire/smoke/sparkles, then the site opens. When
  disabled, the site opens straight to home.
- **Admin panel:** tap the small gold dot at the bottom-right. Set a
  passcode on first use — **nothing is hardcoded, and no passcode value
  is in this code**. Tabs: Website Settings, Programs, Results,
  Candidates, Teams, Gallery, Updates, Downloads.
- **Candidates:** register with name, admission number, team and photo
  (photo upload, stored as a data URL).
- **Results:** enter the admission number only — the candidate's photo,
  name and team fill in automatically. Result fields also include
  variety/category, team name and points. When results are published,
  the football game on the Results page disappears and real results show.
  Admin also has a game on/off checkbox.
- **Teams:** admin manages teams (name + colour; 4 teams expected).
  The Teams page shows all teams with their candidates, then a live
  leaderboard bar graph ranked 1st/2nd/3rd and a topper list, both
  summed automatically from points on real published results.

## Data — starts empty

This standalone version stores everything in the browser
(`localStorage`, key `institution-program-website-v1`). There is no
server, no Supabase and no invented keys.

It starts **empty**: no institution name, no teams, no candidates, no
results, no programs, no date and no venue. No team names, candidate
names, admission numbers, photos, results or points are invented
anywhere — fill them in from the admin panel. “Our Grand Fest” is only
a placeholder label in older notes, not a real name in this code.

## Run it

```bash
npm install
npm run dev      # open the local address it prints
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build locally
```

## Admin passcode

1. Tap the small gold dot (bottom-right).
2. On first use, choose a passcode. It is stored only in your browser
   (as a SHA-256 hash in `localStorage`) — it is never in the code and
   never sent anywhere.
3. Use that passcode to open the admin panel afterwards. If you clear
   the browser data for this site, the passcode and the saved data are
   cleared with it, and you set a passcode again on first use.

## Deploying

`npm run build` produces a static `dist/` folder. Serve that folder
from any static host (for example Vercel, Netlify or GitHub Pages).
Because data lives in each visitor's own browser localStorage, admin
changes made in one browser do not automatically appear for other
visitors — for a shared live site, connect a shared backend (for
example Supabase/Firebase) before publishing.
