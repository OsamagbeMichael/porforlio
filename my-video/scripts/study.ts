// npm run study -- <youtube-url> [<youtube-url> ...]
// Two layers per video -> research/<id>.md:
//   1. transcript: the captions YouTube already has (yt-dlp), as timestamped text
//   2. visuals: Gemini watches the actual video (it accepts YouTube links) - needs GEMINI_API_KEY in .env
// Claude then reads research/*.md and distills docs/editor-rules.md.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

try {
  process.loadEnvFile();
} catch {
  // no .env: transcript layer only
}

const PROMPT = `You are studying this video to learn how it is EDITED, not what it says.
Report concrete, measurable observations with timestamps:
- Hook (first 3 s): what is on screen and said, text overlays.
- Pacing: average shot length, where cuts land (on words, on beats), jump cuts.
- Zooms/punch-ins: how often, how much, hard or eased.
- Transitions: hard cuts vs effects, and when each is used.
- Captions: words per line, font, case, colour, outline, position, animation.
- B-roll/screenshots/overlays: how often, how long on screen, position (full screen vs card).
- Audio: music genre and level under speech, sound effects and where, silence handling.
- Structure: sections, labels, CTA wording and placement.
End with a "Rules" list: short imperative rules another editor could follow, with numbers.`;

const yt = (args: string[]) => execFileSync("yt-dlp", args, { encoding: "utf8" }).trim();

const transcript = (url: string) => {
  const tmp = mkdtempSync(join(tmpdir(), "study-"));
  try {
    yt(["--skip-download", "--write-subs", "--write-auto-subs", "--sub-langs", "en.*", "--sub-format", "vtt", "-o", join(tmp, "s"), url]);
    const vtt = readdirSync(tmp).find((f) => f.endsWith(".vtt"));
    if (!vtt) return "(no English captions on this video)";
    // Auto-captions repeat each line across rolling cues; keep each line once, stamped with its first cue time.
    const seen = new Set<string>();
    const out: string[] = [];
    let stamp = "";
    for (const line of readFileSync(join(tmp, vtt), "utf8").split("\n")) {
      const t = line.match(/^(\d+):(\d\d):(\d\d)\.\d+ -->/);
      if (t) {
        stamp = `[${String(+t[1] * 60 + +t[2]).padStart(2, "0")}:${t[3]}]`;
        continue;
      }
      const text = line.replace(/<[^>]+>/g, "").trim();
      if (!text || /^(WEBVTT|Kind:|Language:)/.test(text) || seen.has(text)) continue;
      seen.add(text);
      out.push(`${stamp} ${text}`);
    }
    return out.join("\n");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
};

const visuals = async (url: string) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "(skipped: set GEMINI_API_KEY in .env - free key at https://aistudio.google.com/apikey)";
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ parts: [{ file_data: { file_uri: url } }, { text: PROMPT }] }] }),
    },
  );
  if (!res.ok) return `(Gemini error ${res.status}: ${await res.text()})`;
  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") || "(empty Gemini reply)";
};

const urls = process.argv.slice(2);
if (!urls.length) throw new Error("usage: npm run study -- <youtube-url> [...]");
mkdirSync("research", { recursive: true });

for (const url of urls) {
  const [id, title] = yt(["--print", "id", "--print", "title", "--skip-download", url]).split("\n");
  console.log(`studying ${title}`);
  const [text, seen] = await Promise.all([transcript(url), visuals(url)]);
  writeFileSync(
    `research/${id}.md`,
    `# ${title}\n\n${url}\n\n## Visual analysis (Gemini)\n\n${seen}\n\n## Transcript\n\n${text}\n`,
  );
  console.log(`  -> research/${id}.md`);
}
