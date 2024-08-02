import path from "path";

export function getWorkingDir(): string {
  return process.cwd();
}

export function getLibPath(): string {
  return path.join(process.argv[1], "..", "..", "lib");
}

export function getBuildDiPath(root_dir: string): string {
  return path.join(root_dir, "build");
}
