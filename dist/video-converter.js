"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const minimist_1 = __importDefault(require("minimist"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const args = (0, minimist_1.default)(process.argv.slice(2));
const overwrite = args.overwrite || false;
const format = String(args.format || "webm");
const extraFlags = args._; // array of additional FFmpeg flags
const inputDir = path_1.default.resolve("input");
const outputDir = path_1.default.resolve("output");
if (!ffmpeg_static_1.default) {
    throw new Error("FFmpeg binary not found. Install ffmpeg-static properly.");
}
const ffmpegCmd = ffmpeg_static_1.default;
function run(cmd, args) {
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(cmd, args, { stdio: "inherit" });
        child.on("close", (code) => {
            if (code === 0)
                resolve();
            else
                reject(new Error(`FFmpeg exited with code ${code}`));
        });
    });
}
async function convert() {
    await promises_1.default.mkdir(outputDir, { recursive: true });
    const files = await promises_1.default.readdir(inputDir);
    const videoFiles = files.filter((f) => /\.(mp4|mov|mkv|avi|webm|m4v)$/i.test(f));
    console.log(`Found ${videoFiles.length} videos.`);
    for (const file of videoFiles) {
        const inputPath = path_1.default.join(inputDir, file);
        const basename = path_1.default.parse(file).name;
        const outputPath = path_1.default.join(outputDir, `${basename}.${format}`);
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
