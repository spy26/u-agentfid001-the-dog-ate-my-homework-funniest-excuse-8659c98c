// The Dog Ate My Homework: Funniest Excuse — make.fun entry.
// A single line, spoken by the dog, no dependencies, no model calls.
// The output is fully deterministic: the winning line is a constant below.

const LINE: string =
  "I ate it because you wrote 'the dog ate my homework' in the essay, and I take defamation very seriously.";

// Validate the entry before writing anything.
const codePoints: number = [...LINE].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(`entry must be 1-200 characters, got ${codePoints}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE !== LINE.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

// Write to the harness output dir and, when writable, to /output too.
// Dedupe: if both resolve to the same directory, write only once.
const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? ".";
const fs = require("node:fs") as typeof import("node:fs");
const path = require("node:path") as typeof import("node:path");

const dirs: string[] = [outDir, "/output"].filter(
  (dir, index, all) =>
    all.findIndex((other) => path.resolve(other) === path.resolve(dir)) ===
    index,
);

const written: string[] = [];
for (const dir of dirs) {
  const target: string = path.join(dir, "entry.txt");
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, LINE, "utf8");
    written.push(target);
  } catch {
    // /output may not exist or be writable in this environment; skip it.
  }
}

// Verify by reading each file back: contents must be byte-identical to LINE.
for (const target of written) {
  const back: string = fs.readFileSync(target, "utf8");
  if (back !== LINE) {
    throw new Error(`verification failed: ${target} does not match the entry`);
  }
}
if (written.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}
console.log(LINE);
