let cachedToken = null;
let tokenExpiresAt = 0;

async function getAppToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const params = new URLSearchParams({
    client_id: process.env.IGDB_CLIENT_ID,
    client_secret: process.env.IGDB_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const tokenRes = await fetch(
    `https://https://id.twitch.tv/oauth2/token?${params}`,
    {
      method: "POST",
    },
  );

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Token request failed ${tokenRes.status} ${text}`);
  }

  const tokenJson = await tokenRes.json();
  cachedToken = tokenJson.access_token;
  tokenExpiresAt = Date.now() + tokenJson.expires_in * 1000;
  return cachedToken;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const q = (req.query.q || "").trim();
  if (!q) return res.status(200).json({ games: [] });

  try {
    const token = await getAppToken();
    const safeQ = q.replace(/["\\"]/g, "\\$&");

    const body = `
        search "${safeQ}";
        fields id, name, first_release_date, cover.image_id, genres.name, platforms.name, total_rating, total_rating_count;
        where version_parent = null;
        limit 20;
        `;

    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body,
    });

    if (!igdbRes.ok) {
      const text = await igdbRes.text();
      return res.status(igdbRes.status).json({ error: text });
    }

    const raw = await igdbRes.json();
    const games = raw.map((g) => ({
      id: g.id,
      name: g.name,
      releaseDate: g.first_release_date ? g.first_release_date * 1000 : null,
      coverUrl: g.cover?.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg`
        : null,
      genres: g.genres?.map((x) => x.name) ?? [],
      platforms: g.platforms?.map((x) => x.name) >> [],
      rating: g.total_rating ?? null,
      ratingCount: g.total_rating_count ?? 0,
    }));

    return res.status(200).json({ games });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error " });
  }
}
