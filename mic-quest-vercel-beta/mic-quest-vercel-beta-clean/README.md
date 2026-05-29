# Mic Quest: Polar Pattern Run

Classroom-ready static browser game for Fife College Sound Production microphone recognition.

## Run Locally

From this folder, start any small static web server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

You can also open `index.html` directly in a browser. The live game uses `src/app.js`, which includes an embedded fallback copy of the microphone data for direct file opening. On static hosting, `data/microphones.json` remains the source of truth.

## Game Modes

- Practice Run: untimed self-paced revision mode.
- Arcade Run: 3-minute classroom challenge.
- Test All 15 Mics: fixed-order run through the complete microphone set.
- Flashcards: microphone image first, tap/click to reveal manufacturer, model, type and polar pattern.

## Scoring

There are 15 microphones. Each checkpoint is worth 4 points:

- Manufacturer
- Model
- Dynamic or condenser
- Polar pattern

Total score: 60 points.

## Beta Test Online with Supabase, GitHub and Vercel

The game can run as a static site on Vercel with a Supabase-backed online leaderboard. This copy is already wired to the Supabase project `GrahamDeas's Project` using its public publishable key. Local browser scores still work if Supabase is temporarily unavailable.

### 1. Create the Supabase table

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the SQL in `supabase/schema.sql`.
4. Copy these values from the Supabase project settings:
   - Project URL
   - anon/public publishable key

Do not use the Supabase service role key in the browser or in Vercel public settings.

### 2. Push to GitHub

1. Create a new GitHub repository.
2. Push this project folder to the repository.
3. Keep `.env` files out of GitHub; `.gitignore` already excludes them.

### 3. Deploy on Vercel

1. Import the GitHub repository into Vercel.
2. Use these settings if Vercel asks:
   - Build command: leave blank
   - Publish directory: `.`
3. Optional: add these Vercel environment variables if you want to override the bundled Supabase settings later:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - Optional: `SUPABASE_LEADERBOARD_TABLE` if you rename the table
4. Deploy.

The Vercel function at `api/leaderboard-config.js` exposes only the public Supabase URL/key needed by the browser game. It also accepts `SUPABASE_PUBLISHABLE_KEY` if your Supabase project uses publishable keys instead of the older anon key name. The leaderboard table is protected by the Row Level Security policies in `supabase/schema.sql`.

### 4. Local Supabase testing

When running locally, you can paste the Supabase Project URL and anon/publishable key into the Online Leaderboard panel on the home screen. Those settings are saved only in your browser with `localStorage`.

If the Supabase settings are missing or a request fails, scores are saved to the local browser leaderboard.

## Project Structure

```text
.env.example
index.html
api/
  leaderboard-config.js
assets/
  microphones/
  sprites/
  sounds/
data/
  microphones.json
  answer_key.md
  answer_key.csv
src/
  app.js
  main.js
  game.js
  quiz.js
  leaderboard.js
  styles.css
google-apps-script/
  Code.gs
supabase/
  schema.sql
README.md
```

`data/microphones.json` is the source of truth for microphone labels and image paths.
