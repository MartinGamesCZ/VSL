import { randomUUID } from "crypto";
import { types } from "./types";
import {
  llvmStringifyDeclaration,
  llvmStringifyDeclarationCall,
} from "./declaration";
import { log, LogType } from "../../../utils/log";
import type LLVM from ".";

export default function llvmFunction(
  name: string,
  out_type: "string" | "void",
  body: any,
) {
  const id = `fun_${out_type}_${randomUUID().replace(/-/g, "")}`;

  return {
    name,
    id,
    out_type,
    body,
  };
}

export function llvmStringifyFunction(
  fun: {
    name: string;
    id: string;
    out_type: "string" | "void";
    body: any;
  },
  llvm: LLVM,
) {
  const body = llvmStringifyFunctionBody(fun.body, llvm);

  return `define ${types[fun.out_type]} @${fun.name == "@main" ? "main" : fun.id}() {\nentry:\n${body}\n\n  ret ${types[fun.out_type]}\n}`;
}

function llvmStringifyFunctionBody(body: any, llvm: LLVM) {
  const out = [];

  for (let i = 0; i < body.length; i++) {
    const call = body[i];

    if (call.type == "dec") {
      out.push(llvmStringifyDeclarationCall(call.declaration, call.args, llvm));
    } else {
      log(LogType.ERROR, `Unknown call type ${call.type}`);

      return process.exit();
    }
  }

  return out.join("\n");
}
