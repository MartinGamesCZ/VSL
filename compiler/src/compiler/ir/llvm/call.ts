import type LLVM from ".";
import { log, LogType } from "../../../utils/log";
import type { TokenType } from "../../lexer/tokens";

export default function llvmCall(name: string, args: any, llvm: LLVM) {
  const declaration = llvm.declarations.get(name);

  if (declaration) {
    return {
      name,
      args,
      type: "dec",
      declaration,
    };
  }

  const fun = llvm.functions.get(name);

  if (fun) {
    return {
      name,
      args,
      type: "fun",
      fun,
    };
  }

  log(LogType.ERROR, `'${name}' is not declared`);
  process.exit();
}
