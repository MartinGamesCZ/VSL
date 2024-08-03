import { readFileSync } from "fs";
import { getBuildDiPath, getLibPath, getWorkingDir } from "../../../utils/path";
import { compileFile } from "../..";
import LLVM from "../llvm";
import { parseNode } from "..";
import { ASTNodeType } from "../../parser/definitions";

export default function irImport(node: any, llvm: LLVM) {
  const lib_path = getLibPath();
  const module = node.module;

  const file_path = `${lib_path}/${module}/main.vsl`;

  const compiled = compileFile(
    file_path,
    module,
    getBuildDiPath(getWorkingDir()),
    {
      no_function_rename: true,
      no_main_function: true,
    },
  );

  if (!compiled.ast) return;

  const functions = compiled.ast.filter((n: any) =>
    node.features == "everything"
      ? n.type == ASTNodeType.function
      : n.type == ASTNodeType.function && node.features.includes(n.name),
  );

  for (const fn of functions) {
    llvm.declare(
      fn.name,
      fn.out_type,
      fn.args.map((a: any) => a.type),
    );
  }
}
