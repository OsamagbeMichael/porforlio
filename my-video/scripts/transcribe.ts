// npm run transcribe -- <slug>
// public/reels/<slug>/raw.mp4 -> public/reels/<slug>/words.raw.json (one entry per word, seconds)
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import {
  WHISPER_WEBGPU_SAMPLE_RATE,
  canUseWhisperWebGpu,
  downloadWhisperModel,
  transcribe,
} from "@remotion/whisper-webgpu";

const slug = process.argv[2];
if (!slug) throw new Error("usage: npm run transcribe -- <slug>");
const dir = `public/reels/${slug}`;

const support = await canUseWhisperWebGpu();
if (!support.supported) throw new Error(support.detailedReason);

// ffmpeg decodes any container straight to the 16 kHz mono float32 Whisper wants.
const ff = spawnSync(
  "ffmpeg",
  ["-v", "error", "-i", `${dir}/raw.mp4`, "-vn", "-ac", "1", "-ar", String(WHISPER_WEBGPU_SAMPLE_RATE), "-f", "f32le", "-"],
  { maxBuffer: 2 ** 31 },
);
if (ff.status !== 0) throw new Error(`ffmpeg failed: ${ff.stderr}`);
const bytes = ff.stdout;
const channelWaveform = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);

const model = "small.en";
await downloadWhisperModel({ model });
const { words } = await transcribe({ channelWaveform, model });

writeFileSync(`${dir}/words.raw.json`, JSON.stringify(words, null, 1));
console.log(`${words.length} words -> ${dir}/words.raw.json`);
