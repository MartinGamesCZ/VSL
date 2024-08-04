import { randomUUID } from "crypto";
import type LLVM from ".";
import { stripQuotationMarks } from "..";
import { log, LogType } from "../../../utils/log";
import { TokenType } from "../../lexer/tokens";
import { llvmStringifyConstantUse, processString } from "./constant";
import { types } from "./types";
import { llvmStringifyFunctionCall } from "./function";
import { llvmStringifyDeclarationCall } from "./declaration";

export default function llvmVariable(
  name: string,
  type: "string" | "int",
  value: any,
  llvm: LLVM,
) {
  if (value.type == "literal") {
    const p_val = processString(stripQuotationMarks(value.value)).str;
    const con = llvm.constants.get(p_val);

    if (!con && type == "string") {
      llvm.declareValue(type, p_val);
    }
  }

  return {
    type: "variable",
    name,
    var_type: type,
    value: value,
  };
}

export function llvmStringifyVariable(
  variable: {
    name: string;
    var_type: "string";
    value: any;
  },
  llvm: LLVM,
) {
  return `  %${variable.name} = alloca ${types[variable.var_type]}`;
}

export function llvmStringifyVariableAssign(
  variable: {
    name: string;
    var_type: "string" | "int";
    value: any;
  },
  llvm: LLVM,
) {
  if (variable.value.type == "literal") {
    if (variable.var_type == "string") {
      const p_val = processString(
        stripQuotationMarks(variable.value.value),
      ).str;
      const val = llvm.constants.get(p_val);

      if (!val) {
        log(LogType.ERROR, `Use of undeclared variable '${p_val}'`);

        return process.exit();
      }

      const r = llvmStringifyConstantUse(val);

      return `${r.header}\n  store ${r.use}, ${types[variable.var_type]}* %${variable.name}`;
    } else {
      return `  store ${types[variable.var_type]} ${variable.value.value}, ${types[variable.var_type]}* %${variable.name}`;
    }
  } else {
    if (variable.value.type == "call") {
      const dec = llvm.declarations.get(variable.value.name);
      const fun = llvm.functions.get(variable.value.name);

      if (dec) {
        const d = llvmStringifyDeclarationCall(
          dec,
          variable.value.args,
          llvm,
          "@main",
          true,
        ) as any;

        return `${d.header}
  store ${d.use}, ${types[variable.var_type]}* %${variable.name}`;
      }

      if (fun) {
        return llvmStringifyFunctionCall(fun, variable.value.args, llvm);
      }
    }

    log(LogType.ERROR, `Invalid variable assignment - right side not found`);

    return process.exit();
  }
}

export function llvmStringifyVariableUse(
  variable: {
    name: string;
    var_type: "string";
    value: any;
  },
  llvm: LLVM,
) {
  const id = `var_u_${randomUUID().replace(/-/g, "")}`;

  return {
    header: `  %${id} = load ${types[variable.var_type]}, ${types[variable.var_type]}* %${variable.name}`,
    use: `${types[variable.var_type]}  %${id}`,
  };
}
