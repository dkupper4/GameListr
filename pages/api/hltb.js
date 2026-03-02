const cache = new Map();

const HLTB_HEADERS = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9",
  origin: "https://howlongtobeat.com",
  referer: "https://howlongtobeat.com/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
};

function toHours(seconds) {
  if (!seconds || seconds <= 0) return null;
  return Math.round((seconds / 3600) * 10) / 10;
}

async function getFinderToken() {
  const res = await fetch(
    `https://howlongtobeat.com/api/finder/init?t=${Date.now()}`,
    { headers: HLTB_HEADERS },
  );
  if (!res.ok) throw new Error(`HLTB init failed (${res.status})`);
  const json = await res.json();
  return json.token;
}

async function searchHltb(query, token) {
  const payload = {
    searchType: "games",
    searchTerms: query.trim().split(/\s+/),
    searchPage: 1,
    size: 20,
    searchOptions: {
      games: {
        userId: 0,
        platform: "",
        sortCategory: "popular",
        rangeCategory: "main",
        rangeTime: { min: 0, max: 0 },
        gameplay: { perspective: "", flow: "", genre: "", difficulty: "" },
        rangeYear: { min: "", max: "" },
        modifier: "",
      },
      users: { sortCategory: "postcount" },
      lists: { sortCategory: "follows" },
      filter: "",
      sort: 0,
      randomizer: 0,
    },
    useCache: true,
  };

  const res = await fetch("https://howlongtobeat.com/api/finder", {
    method: "POST",
    headers: {
      ...HLTB_HEADERS,
      "content-type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HLTB finder failed (${res.status})`);
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const q = (req.query.q || "").trim();
  if (!q) return res.status(200).json({ hltb: null });

  const key = q.toLowerCase();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return res.status(200).json({ hltb: cached.data });
  }

  try {
    const token = await getFinderToken();
    const result = await searchHltb(q, token);
    const items = result?.data || [];

    if (!items.length) return res.status(200).json({ hltb: null });

    const best =
      items.find((x) => x.game_name?.toLowerCase() === key) ||
      items.find((x) => x.game_name?.toLowerCase().includes(key)) ||
      items[0];

    const data = {
      id: best.game_id,
      name: best.game_name,
      main: toHours(best.comp_main),
      mainExtra: toHours(best.comp_plus),
      completionist: toHours(best.comp_100),
    };

    cache.set(key, { data, expiresAt: Date.now() + 1000 * 60 * 60 * 12 });
    return res.status(200).json({ hltb: data });
  } catch (err) {
    return res.status(200).json({ hltb: null, error: err.message });
  }
}
