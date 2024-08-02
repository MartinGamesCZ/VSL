import { existsSync, mkdirSync, rmSync } from "fs";
import path from "path";
import { log, LogType } from "../utils/log";

export default function compileProject(
  config: {
    [key: string]: any;
  },
  root_dir: string,
) {
  const main = config.main;
  const main_path = main.startsWith("/") ? main : path.join(root_dir, main);

  const build_dir = path.join(root_dir, "build");

  if (existsSync(build_dir))
    rmSync(build_dir, {
      recursive: true,
    });

  mkdirSync(build_dir);

  compileFile(main_path, config.main);
}

export function compileFile(file_path: string, file_name: string) {
  log(LogType.INFO, `Compiling file '${file_name}'...`);

  return;
}
