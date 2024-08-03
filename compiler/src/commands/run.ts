import { $ } from "bun";
import compileProject from "../compiler";
import { getConfig } from "../utils/config";
import { log, LogType } from "../utils/log";
import { getWorkingDir } from "../utils/path";

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
    await $`llc -filetype=obj -relocation-model=pic build/${index}.ll -o build/${index}.o`;
  }

  await $`clang ${indexes.map((i) => `build/${i}.o`)} -pie -fPIE -o build/${main_idx}`;

  log(LogType.INFO, `Project '${config.name}' compiled successfully`);
  log(LogType.INFO, "Running...\n");

  await $`./build/${main_idx}`.catch((e) => e.stdout);
}
