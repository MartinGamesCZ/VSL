import { randomUUID } from "crypto";
import { types } from "./types";
import { TokenType } from "../../lexer/tokens";
import { getLiteralType, stripQuotationMarks } from "..";
import { llvmStringifyConstantUse } from "./constant";
import type LLVM from ".";
import { log, LogType } from "../../../utils/log";

export default function llvmDeclaration(
  name: string,
  out_type: "string" | "void",
  args: string[],
) {
  return {
    name,
    out_type,
    args,
  };
}

export function llvmStringifyDeclaration(dec: {
  name: string;
  out_type: "string" | "void";
  args: string[];
}) {
  const args = llvmStringifyDeclarationArgs(dec.args);

  return `declare ${types[dec.out_type]} @${dec.name}(${args})`;
}

function llvmStringifyDeclarationArgs(args: string[]) {
  return args
    .map((arg) => `  ${types[arg as unknown as keyof typeof types]}`)
    .join(", ");
}

export function llvmStringifyDeclarationCall(
  dec: {
    name: string;
    out_type: "string" | "void";
    args: any[];
  },
  args: any,
  llvm: LLVM,
  fun_name: string,
) {
  const arg_types = dec.args.map(
    (arg) => types[arg as unknown as keyof typeof types],
  );

  const headers: string[] = [];

  const p_args = args.map((arg: any) => {
    if (arg.type == TokenType.literal) {
      const t = getLiteralType(arg);

      if (t == "string") {
        const dec = llvm.constants.get(stripQuotationMarks(arg.value));

        if (!dec) {
          log(LogType.ERROR, `Use of undeclared variable`);

          return;
        }

        const r = llvmStringifyConstantUse(dec);

        headers.push(r.header);

        return r.use;
      }
    } else if (arg.type == TokenType.identifier) {
      const parent_fun = llvm.functions.get(fun_name);

      if (!parent_fun) {
        log(LogType.ERROR, `Use of undeclared variable '${arg.value}'`);

        return process.exit();
      }

      const pf_args = parent_fun.args;

      const index = pf_args.find((a) => a.name == arg.value);

      if (!index) {
        log(LogType.ERROR, `Use of undeclared variable '${arg.value}'`);

        return process.exit();
      }

      return `${types[index.type as unknown as keyof typeof types]} %${arg.value}`;
    }
  });

  return `${headers.join("\n")}\ncall ${types[dec.out_type]} (${arg_types.join(",")}) @${dec.name}(${p_args.join(",")})`;
}
