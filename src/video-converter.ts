import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import minimist from "minimist";
import ffmpegPath from "ffmpeg-static";

const args = minimist(process.argv.slice(2));
const overwrite = args.overwrite || false;
const format = String(args.format || "webm");
const extraFlags = args._; // array of additional FFmpeg flags

const inputDir = path.resolve("input");
const outputDir = path.resolve("output");

if (!ffmpegPath) {
  throw new Error("FFmpeg binary not found. Install ffmpeg-static properly.");
}

const ffmpegCmd = ffmpegPath as string;

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}

async function convert() {
  await fs.mkdir(outputDir, { recursive: true });
  const files = await fs.readdir(inputDir);
  const videoFiles = files.filter((f) =>
    /\.(mp4|mov|mkv|avi|webm|m4v)$/i.test(f)
  );

  console.log(`Found ${videoFiles.length} videos.`);

  for (const file of videoFiles) {
    const inputPath = path.join(inputDir, file);
    const basename = path.parse(file).name;
    const outputPath = path.join(outputDir, `${basename}.${format}`);

    const ffmpegArgs = [
      ...(overwrite ? ["-y"] : []),
      "-i",
      inputPath,
      ...extraFlags,
      outputPath,
    ];

    console.log("\nRunning:", ffmpegCmd, ffmpegArgs.join(" "));
    await run(ffmpegCmd, ffmpegArgs);
    console.log(`✔ Converted: ${file} → ${basename}.${format}`);
  }

  console.log("\nAll conversions complete.");
}

convert().catch((err) => console.error("❌ Error:", err));
