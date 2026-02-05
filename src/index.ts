#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";

const REPO_URL = "https://github.com/ArunachalamSelvam/LibraryManagement.git";
const DEFAULT_DIR = "AstraMig";

function readVersion(): string {
  const pkgPath = path.join(__dirname, "..", "package.json");
  const raw = fs.readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as { version?: string };
  return pkg.version ?? "0.0.0";
}

function printHelp(): void {
  console.log(`
astramig - AstraMig CLI

Usage:
  astramig init [dir]
  astramig --version
  astramig help

Commands:
  init [dir]    Clone the project into ./AstraMig (default) or ./<dir>
`);
}

function ensureGit(): void {
  const result = spawnSync("git", ["--version"], { stdio: "ignore" });
  if (result.status !== 0) {
    console.error("Git is required but not found in PATH.");
    process.exit(1);
  }
}

function initCommand(targetDir?: string): void {
  const dir = targetDir?.trim() || DEFAULT_DIR;
  const destination = path.resolve(process.cwd(), dir);
  if (fs.existsSync(destination)) {
    console.error(`Target directory already exists: ${destination}`);
    process.exit(1);
  }
  ensureGit();
  const result = spawnSync("git", ["clone", REPO_URL, dir], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const args = process.argv.slice(2);
const [command, ...rest] = args;

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (command === "--version" || command === "-v") {
  console.log(readVersion());
  process.exit(0);
}

if (command === "init") {
  initCommand(rest[0]);
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
printHelp();
process.exit(1);
