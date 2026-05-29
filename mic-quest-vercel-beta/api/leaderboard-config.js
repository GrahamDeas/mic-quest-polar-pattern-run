const DEFAULT_TABLE = "mic_quest_scores";

module.exports = function leaderboardConfig(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";
  const table = process.env.SUPABASE_LEADERBOARD_TABLE || DEFAULT_TABLE;

  response.setHeader("Cache-Control", "no-store");

  if (!supabaseUrl || !anonKey) {
    response.status(204).end();
    return;
  }

  response.status(200).json({
    supabaseUrl,
    anonKey,
    table
  });
};
