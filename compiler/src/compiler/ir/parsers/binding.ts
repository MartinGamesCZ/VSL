import { readFileSync } from "fs";
import { getBuildDiPath, getLibPath, getWorkingDir } from "../../../utils/path";
import { compileFile } from "../..";
import LLVM from "../llvm";
import { parseNode } from "..";
import { ASTNodeType } from "../../parser/definitions";
import path from "path";
import { log, LogType } from "../../../utils/log";

export default function irBinding(node: any, llvm: LLVM) {
  const binding_path = path.join(llvm.config.file_path, "../binding.ll");
  const func = node.name;
  const args = node.args;
  const out_type = node.out_type;

  log(
    LogType.INFO,
    `Including ${func} from binding '${binding_path.split("/").slice(-2).join("/")}'`,
  );

  const code = readFileSync(binding_path, "utf-8");

  const definition = code
    .split("\n")
    .filter((l) => /define .* @[A-Za-z0-9]*\(/gm.test(l));

  const func_def = definition.find((l) => l.includes(`@${func}(`));

  if (!func_def) {
    log(LogType.ERROR, `Function '${func}' not found in binding`);
    return;
  }

  const func_code = code.split(func_def)[1].split("}")[0];

  const full_func = func_def + func_code + "}";

  llvm.addHeader(full_func);
}
