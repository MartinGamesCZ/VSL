import compileProject from "../compiler";
import { getConfig } from "../utils/config";
import { log, LogType } from "../utils/log";
import { getWorkingDir } from "../utils/path";

export default function commandRun(args: string[]) {
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
}
