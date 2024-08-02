import commandRun from "./commands/run";
import { getArgs } from "./utils/args";
import { log, LogType } from "./utils/log";

const commands = {
  run: commandRun,
};

const args = getArgs();

const command = args[0] as keyof typeof commands;

log(LogType.INFO, `VSL Compiler // Version 0.0.1`);

if (commands[command]) {
  commands[command](args.slice(1));

  process.exit();
}

log(LogType.ERROR, "Command not found");
