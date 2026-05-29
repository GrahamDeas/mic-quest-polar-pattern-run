# Mic Quest Beta Testing Checklist

Use this checklist when you are ready to put the game online for testers.

## What Codex Has Already Prepared

- The game files are ready for static hosting.
- The online leaderboard is wired for Supabase.
- The Vercel endpoint `api/leaderboard-config.js` can pass the public Supabase settings to the game.
- The Supabase table setup is in `supabase/schema.sql`.
- Local browser leaderboard fallback still works if Supabase is unavailable.

## Supabase

1. Go to Supabase and create a project.
2. Open the SQL editor.
3. Paste and run the contents of `supabase/schema.sql`.
4. Copy your Project URL.
5. Copy your anon/public publishable key.

Important: do not use the service role key.

## GitHub

1. Create a new GitHub repository.
2. Upload or push this whole project folder.
3. Make sure these folders are included:
   - `api`
   - `assets`
   - `data`
   - `src`
   - `supabase`

## Vercel

1. Import the GitHub repository into Vercel.
2. Use these project settings:
   - Framework preset: Other
   - Build command: leave blank
   - Output directory: `.`
3. Add these environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - Optional: `SUPABASE_LEADERBOARD_TABLE`
4. Deploy.

## Quick Beta Test

1. Open the Vercel URL.
2. Check the home screen says the leaderboard is online.
3. Play a short run.
4. Save a score using a team name, not a full student name.
5. Refresh the leaderboard.
6. Open Supabase and confirm a new row appears in `mic_quest_scores`.
