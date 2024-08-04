import { $, spawnSync } from "bun";
import compileProject from "../compiler";
import { getConfig } from "../utils/config";
import { log, LogType } from "../utils/log";
import { getWorkingDir } from "../utils/path";
import { exec } from "child_process";

export default async function commandRun(args: string[]) {
  const root_dir = getWorkingDir();

  const config = getConfig(root_dir);

  if (config.error) {
    log(
      LogType.ERROR,
      "project.toml not found, ensure that you are in root directory",
    );

    return process.exit();
  }

  log(LogType.INFO, `Running project '${config.name}'...`);

  const indexes = compileProject(config, root_dir);

  const main_idx = config.main.split("/").reverse()[0].split(".")[0];

  for (const index of indexes) {
    await $`llc -filetype=obj -relocation-model=pic build/linux_x86-64/build/llvm/${index}.ll -o build/linux_x86-64/build/object/${index}.o`;
  }

  await $`clang ${indexes.map((i) => `build/linux_x86-64/build/object/${i}.o`)} -pie -fPIE -o build/linux_x86-64/${main_idx}`;

  log(LogType.INFO, `Project '${config.name}' compiled successfully`);
  log(LogType.INFO, "Running...\n");

  const out = spawnSync({
    cmd: [`./build/linux_x86-64/${main_idx}`],
    stdio: ["inherit", "inherit", "inherit"],
  });
}
