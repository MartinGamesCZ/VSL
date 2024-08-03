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

  compileProject(config, root_dir);

  const idx = config.main.split("/").reverse()[0].split(".")[0];

  await $`llc -filetype=obj -relocation-model=pic build/${idx}.ll -o build/${idx}.o`;
  await $`clang build/${idx}.o -pie -fPIE -o build/${idx}`;

  log(LogType.INFO, `Project '${config.name}' compiled successfully`);
  log(LogType.INFO, "Running...\n");

  await $`./build/${idx}`.catch((e) => e.stdout);
}
