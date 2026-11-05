// Local-preview stand-in for the Airtable REST API, so every page renders
// with sample content without real keys. Never used in production.
//
//   node scripts/dev-airtable-stub.mjs          (listens on :4010)
//   AIRTABLE_API_ROOT=http://localhost:4010/v0 AIRTABLE_PAT=stub AIRTABLE_BASE_ID=stub npm run dev
//
// Images: borrows the live site's current Airtable attachment URLs (they
// expire after a few hours). Form writes are accepted and logged, not stored.
import http from "node:http";

const LIVE = "https://www.9thwardrecording.com";
async function liveImages(path) {
  try {
    const html = await (await fetch(LIVE + path)).text();
    return [...new Set([...html.matchAll(/url=(https%3A%2F%2Fv5\.airtableusercontent[^&"]+)/g)].map((m) => decodeURIComponent(m[1])))];
  } catch {
    return [];
  }
}
const [artistImgs, musicImgs, eventImgs, blogImgs] = await Promise.all(
  ["/artists", "/music", "/events", "/blog"].map(liveImages)
);
const att = (list, i) => (list[i] ? [{ url: list[i], width: 1000, height: 1000 }] : undefined);
const rec = (id, fields) => ({ id, createdTime: "2026-01-01T00:00:00.000Z", fields });

const names = ["Blaquestalyon", "Dj 2Klean", "Songbird", "Babygirl", "Var Don"];
const genres = ["Hip-Hop", "Hip-Hop", "R&B", "R&B", "Reggae"];
const TABLES = {
  Artists: names.map((n, i) =>
    rec(`recA${i}`, {
      Name: n, Slug: n.toLowerCase().replace(/[^a-z0-9]+/g, "-"), Bio: `${n} bio (stub).`,
      Genre: genres[i], Hometown: ["Houston", "Houston", "El Paso", "Houston", "The Bronx"][i],
      Photo: att(artistImgs, i), Featured: i < 3, "Sort Order": i, Status: "Active",
      "YouTube URL": "https://www.youtube.com/@blaquestalyon",
    })
  ),
  Releases: ["Caribbean Connection", "Shaq-Fu", "Sinful Taboo", "Dreamin' Bout U", "Oye Mamita"].map((t, i) =>
    rec(`recR${i}`, {
      Title: t, Slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-"), Artist: ["recA0"],
      "Release Date": `202${5 - (i % 3)}-0${i + 1}-15`, "Cover Art": att(musicImgs.length ? musicImgs : artistImgs, i % Math.max(1, musicImgs.length || 1)),
      Type: ["Single", "Single", "EP", "Album", "Single"][i], Featured: i === 0,
      "YouTube URL": "https://www.youtube.com/watch?v=h1gZeqiUZyQ",
    })
  ),
  Events: [
    rec("recE0", { Title: "Houston Showcase (stub)", "Date/Time": "2026-12-12T20:00:00.000Z", Venue: "Studio 9", City: "Houston, TX", "Artist(s)": ["recA0", "recA2"], "Ticket URL": "https://example.com", Flyer: att(eventImgs, 0), Status: "Upcoming" }),
    rec("recE1", { Title: "El Paso Night (stub)", "Date/Time": "2027-01-20T20:00:00.000Z", Venue: "The Foundation", City: "El Paso, TX", "Artist(s)": ["recA1"], Status: "Upcoming" }),
    rec("recE2", { Title: "Houston Nexten Micro-Summit - October 23", "Date/Time": "2026-10-23T19:00:00.000Z", Venue: "Downtown", City: "Houston, TX", Flyer: att(eventImgs, 1), Status: "Past" }),
  ],
  Services: [],
  BlogPosts: [
    rec("recB0", { Title: "What Happened to Hip Hop? Pt.1", Slug: "what-happened-to-hip-hop-pt-1", Author: "CL", "Published Date": "2026-07-09", "Cover Image": att(blogImgs, 0), Excerpt: "Stub excerpt for local preview.", Body: "Stub body paragraph one.\nStub body paragraph two.", Tags: ["Culture"], Status: "Published" }),
    rec("recB1", { Title: "Inside the Studio (stub)", Slug: "inside-the-studio", Author: "9th Ward", "Published Date": "2026-06-01", "Cover Image": att(blogImgs, 1), Excerpt: "Second stub post.", Body: "Body.", Tags: ["Studio"], Status: "Published" }),
  ],
};

http
  .createServer((req, res) => {
    const table = decodeURIComponent(new URL(req.url, "http://x").pathname.split("/")[3] || "");
    res.setHeader("content-type", "application/json");
    if (req.method === "POST") {
      let body = "";
      req.on("data", (c) => (body += c)).on("end", () => {
        console.log(`[stub] write ${table}: ${body.slice(0, 200)}`);
        res.end(JSON.stringify({ id: "recSTUB", records: [{ id: "recSTUB" }] }));
      });
      return;
    }
    res.end(JSON.stringify({ records: TABLES[table] ?? [] }));
  })
  .listen(4010, () => console.log("airtable stub on http://localhost:4010/v0"));
