import { readFileSync } from "fs";
import { getBuildDiPath, getLibPath, getWorkingDir } from "../../../utils/path";
import { compileFile } from "../..";
import LLVM from "../llvm";
import { parseNode } from "..";

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

  for (let node of compiled.ast) {
    //parseNode(node, llvm);
  }
}
