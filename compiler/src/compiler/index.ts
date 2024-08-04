import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { log, LogType } from "../utils/log";
import lexer from "./lexer";
import parser from "./parser";
import intermediateRepresentation from "./ir";
import { getBuildDiPath } from "../utils/path";

let indexes: string[] = [];

export default function compileProject(
  config: {
    [key: string]: any;
  },
  root_dir: string,
) {
  const main = config.main;
  const main_path = main.startsWith("/") ? main : path.join(root_dir, main);

  const build_dir = getBuildDiPath(root_dir);

  if (existsSync(build_dir))
    rmSync(build_dir, {
      recursive: true,
    });

  mkdirSync(build_dir);
  mkdirSync(path.join(build_dir, "linux_x86-64"));
  mkdirSync(path.join(build_dir, "linux_x86-64/debug"));
  mkdirSync(path.join(build_dir, "linux_x86-64/build"));
  mkdirSync(path.join(build_dir, "linux_x86-64/build/llvm"));
  mkdirSync(path.join(build_dir, "linux_x86-64/build/object"));

  const res = compileFile(main_path, config.main, build_dir);

  if (res.error) {
    log(LogType.ERROR, res.error);
    return process.exit();
  }

  return indexes;
}

export function compileFile(
  file_path: string,
  file_name: string,
  build_dir: string,
  config: { [key: string]: any } = {},
): {
  error?: string | null;
  compiled?: string;
  ast?: any;
} {
  log(LogType.INFO, `Compiling ${file_name}`);

  config.file_path = file_path;

  const index_name = file_name.split("/").reverse()[0].split(".")[0];

  if (!indexes.includes(index_name)) indexes.push(index_name);

  if (!existsSync(file_path))
    return {
      error: `File '${file_name}' not found`,
    };

  const code = readFileSync(file_path, "utf-8");

  const tokens = lexer(code);
  writeFileSync(
    path.join(build_dir, "linux_x86-64/debug", index_name + ".tokenized.json"),
    JSON.stringify(tokens, null, 2),
  );

  const ast = parser(tokens);
  writeFileSync(
    path.join(build_dir, "linux_x86-64/debug", index_name + ".ast.json"),
    JSON.stringify(ast, null, 2),
  );

  const ir = intermediateRepresentation(ast, config);
  writeFileSync(
    path.join(build_dir, "linux_x86-64/build/llvm", index_name + ".ll"),
    ir,
  );

  return {
    error: null,
    compiled: ir,
    ast,
  };
}
