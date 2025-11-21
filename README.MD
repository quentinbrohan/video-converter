# 🎬 Video Converter CLI

**FFmpeg + TypeScript + ffmpeg-static**

A lightweight, portable CLI to batch-convert videos using FFmpeg.
Supports custom flags, presets, and both MP4 (H.264) and WebM (VP9) formats.

- 🟢 No system FFmpeg required — FFmpeg is bundled automatically via `ffmpeg-static`.
- 🟢 Cross-platform: macOS, Linux, Windows
- 🟢 Works with Node, Bun, or npm

---

## 🚀 Features

- Convert any number of videos from `input/` → `output/`
- Convert to:
  - WebM (VP9)
  - MP4 (H.264)
- Pass any FFmpeg flags
- Built-in recommended presets
- Self-contained (FFmpeg included)
- TypeScript-based CLI with auto-build
- Avoids upscaling — videos are only resized down if larger than the max preset resolution
- Ensures even width/height for proper encoding

---

## 📦 Installation

```bash
bun install
# or
npm install
```

No need to install FFmpeg on your system.
FFmpeg is bundled via `ffmpeg-static` and works out of the box.

---

## 📂 Folder Structure

```
input/    # place your source videos here
output/   # converted files appear here
src/      # TypeScript source files
dist/     # compiled JS output
```

---

## 🎮 Basic Usage

Convert to WebM:

```bash
bun run webm
# or
npm run webm
```

Convert to MP4:

```bash
bun run mp4
# or
npm run mp4
```

Convert with Overwrite (no prompts):

```bash
bun run mp4 --overwrite
# or
npm run mp4 --overwrite
```

Convert to both formats (using the same flags):

```bash
npm run both --flags="--crf 25 -preset medium"
```

---

## 🛠 Overwrite Behavior

By default, the script will **not overwrite existing files**.
Add the `--overwrite` flag to automatically overwrite any existing files without confirmation.

Example:

```bash
bun run mp4 --overwrite
# or
npm run mp4 --overwrite
```

---

## 🛠 Using Custom FFmpeg Flags

Pass any FFmpeg flags after `--`:

**WebM example**

```bash
npm run webm -- --crf 30 -b:v 0 -c:v libvpx-vp9
```

**MP4 example**

```bash
npm run mp4 -- --crf 23 -preset slow -c:v libx264
```

---

## 🎯 File Naming Conventions

By default, the input filename is preserved; only the extension changes (e.g., `.mp4`, `.webm`).

Optional: add `--preset` to append preset info to the output filename:

```bash
bun run mp4 --overwrite --preset
```

Resulting output:

```
video-name-mp4-preset.mp4
```

---

## 🎯 Recommended Settings (Web Performance)

For short (15–20s) website demos or portfolio clips:

| Format      | Codec      | Recommended Target (1080p) |
| ----------- | ---------- | -------------------------- |
| WebM (VP9)  | libvpx-vp9 | 1–2 Mbps                   |
| MP4 (H.264) | libx264    | 2–3 Mbps                   |

These settings provide optimal quality for modern browsers while keeping file sizes small.
The CLI automatically avoids upscaling smaller videos.

---

## 🔧 Built-in Presets

**WebM preset (VP9, 1080p-friendly)**

```bash
npm run webm:preset
```

Flags used:

```
-c:v libvpx-vp9 -b:v 1.5M -crf 32 -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,setsar=1,pad=ceil(iw/2)*2:ceil(ih/2)*2" -r 30 -c:a libopus -b:a 96k
```

**MP4 preset (H.264, general-purpose)**

```bash
npm run mp4:preset
```

Flags used:

```
-c:v libx264 -b:v 2.5M -crf 28 -preset slow -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,setsar=1,pad=ceil(iw/2)*2:ceil(ih/2)*2" -r 30 -c:a aac -b:a 128k
```

**Run both presets sequentially:**

```bash
npm run both:preset
```

---

## 🔨 Build

Compile TypeScript:

```bash
npm run build
```

Or automatically via the commands:

```bash
npm run webm
npm run mp4
```

---

## ▶ Run Script Directly

```bash
npm start -- --format=webm --crf 30
```

---

## 💡 Notes

- Only video files (`.mp4`, `.mov`, `.mkv`, `.avi`, `.webm`, `.m4v`) are processed.
- Output files are written to `output/`.
- If `input/` is empty, nothing will be converted.
- Videos are resized **only if larger than 1920×1080**; smaller videos retain original resolution.
- Even dimensions are ensured for H.264/VP9 compatibility.

---

## 📜 License

MIT License — free to use, modify, and share.
