// Netlify serverless function — runs on Netlify's servers, not in the browser.
// This is what actually fixes the CORS problem: your page calls THIS function
// (same domain, so no CORS applies at all), and this function calls CounterAPI
// server-to-server (also no CORS — the same as the curl examples working fine).
//
// Setup required (one-time):
//   1. In your Netlify dashboard: Site configuration → Environment variables
//      → Add variable → name it exactly COUNTERAPI_KEY, paste your API key.
//   2. Redeploy (Netlify → Deploys → Trigger deploy) so the function picks up
//      the new environment variable.
//   3. Confirm the two counter names below match what you see in your
//      CounterAPI dashboard. You already have "portfolio-visits-nihalurrahiyan" —
//      create a second counter named "portfolio-unique-visits-nihalurrahiyan"
//      (or update UNIQUE_COUNTER below to whatever name you actually used).

const WORKSPACE = "nihalurrahiyans-portfolio";
const TOTAL_COUNTER = "portfolio-visits-nihalurrahiyan";
const UNIQUE_COUNTER = "portfolio-unique-visits-nihalurrahiyan";

exports.handler = async (event) => {
  const apiKey = process.env.COUNTERAPI_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "COUNTERAPI_KEY environment variable is not set in Netlify." }),
    };
  }

  const base = `https://api.counterapi.dev/v2/${WORKSPACE}`;
  const headers = { Authorization: `Bearer ${apiKey}` };

  // The browser tells us (via ?unique=1) whether THIS visitor has already
  // been counted before, using its own localStorage flag — the function
  // itself has no memory between requests, so the browser has to say.
  const isFirstVisitForThisBrowser =
    event.queryStringParameters && event.queryStringParameters.unique === "1";

  function extractValue(json) {
    // Defensive parsing — tries the field names CounterAPI is documented to
    // use. If this ever returns null, check a real response shape via the
    // Netlify function logs and adjust the field name list below.
    const d = json && json.data ? json.data : json;
    if (!d) return null;
    const candidates = [d.value, d.up_count, d.count];
    for (const c of candidates) {
      if (typeof c === "number") return c;
    }
    return null;
  }

  try {
    const totalRes = await fetch(`${base}/${TOTAL_COUNTER}/up`, { headers });
    if (!totalRes.ok) throw new Error(`total counter failed: ${totalRes.status}`);
    const totalValue = extractValue(await totalRes.json());

    const uniqueUrl = isFirstVisitForThisBrowser
      ? `${base}/${UNIQUE_COUNTER}/up`
      : `${base}/${UNIQUE_COUNTER}`;
    const uniqueRes = await fetch(uniqueUrl, { headers });
    if (!uniqueRes.ok) throw new Error(`unique counter failed: ${uniqueRes.status}`);
    const uniqueValue = extractValue(await uniqueRes.json());

    if (totalValue === null || uniqueValue === null) {
      return { statusCode: 502, body: JSON.stringify({ error: "Unexpected response shape from CounterAPI." }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total: totalValue, unique: uniqueValue }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
