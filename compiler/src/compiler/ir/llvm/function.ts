import { randomUUID } from "crypto";
import { types } from "./types";
import {
  llvmStringifyDeclaration,
  llvmStringifyDeclarationCall,
} from "./declaration";
import { log, LogType } from "../../../utils/log";
import type LLVM from ".";
import { TokenType } from "../../lexer/tokens";
import { getLiteralType, parseNode, stripQuotationMarks } from "..";
import { llvmStringifyConstantUse } from "./constant";

export default function llvmFunction(
  name: string,
  out_type: "string" | "void",
  args: any,
  body: any,
) {
  const id = `fun_${out_type}_${randomUUID().replace(/-/g, "")}`;

  return {
    name,
    id,
    out_type,
    args,
    body,
  };
}

export function llvmStringifyFunction(
  fun: {
    name: string;
    id: string;
    out_type: "string" | "void";
    body: any;
    args: any;
  },
  llvm: LLVM,
) {
  const body = llvmStringifyFunctionBody(fun.body, llvm, fun.name);

  const args = fun.args.map((arg: any) => {
    return `${types[arg.type as unknown as keyof typeof types]} %${arg.name}`;
  });

  return `define ${types[fun.out_type]} @${fun.name == "@main" ? "main" : fun.id}(${args.join("\n")}) {\nentry:\n${body}\n\n  ret ${types[fun.out_type]}\n}`;
}

function llvmStringifyFunctionBody(body: any, llvm: LLVM, fun_name: string) {
  const out = [];

  for (let i = 0; i < body.length; i++) {
    const call = body[i];

    if (call.type == "dec") {
      out.push(
        llvmStringifyDeclarationCall(
          call.declaration,
          call.args,
          llvm,
          fun_name,
        ),
      );
    } else if (call.type == "fun") {
      out.push(llvmStringifyFunctionCall(call.fun, call.args, llvm));
    } else if (call.type == "call") {
      parseNode(call, llvm, fun_name);
    } else {
      log(LogType.ERROR, `Unknown call type ${call.type}`);

      return process.exit();
    }
  }

  return out.join("\n");
}

export function llvmStringifyFunctionCall(
  fun: {
    name: string;
    id: string;
    out_type: "string" | "void";
    body: any;
    args: any;
  },
  args: any,
  llvm: LLVM,
) {
  const arg_types = fun.args.map((arg: any) => {
    return types[arg.type as unknown as keyof typeof types];
  });

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
    }
  });

  return `${headers.join("\n")}\n  call ${types[fun.out_type]} (${arg_types.join(",")}) @${fun.id}(${p_args.join(",")})`;
}
