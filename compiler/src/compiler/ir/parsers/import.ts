import { readFileSync } from "fs";
import { getBuildDiPath, getLibPath, getWorkingDir } from "../../../utils/path";
import { compileFile } from "../..";

export default function irImport(node: any) {
  const lib_path = getLibPath();
  const module = node.module;

  const file_path = `${lib_path}/${module}/main.vsl`;

  const compiled = compileFile(
    file_path,
    module,
    getBuildDiPath(getWorkingDir()),
  );

  return compiled.compiled;
}
