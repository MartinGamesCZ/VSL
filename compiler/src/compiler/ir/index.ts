import { log, LogType } from "../../utils/log";
import { quotationMarks } from "../lexer/definitions";
import { TokenType } from "../lexer/tokens";
import { ASTNodeType } from "../parser/definitions";
import LLVM from "./llvm";
import irBinding from "./parsers/binding";
import irCall from "./parsers/call";
import irDeclaration from "./parsers/declaration";
import irFunction from "./parsers/function";
import irImport from "./parsers/import";
import irVariable from "./parsers/variable";

export default function intermediateRepresentation(
  ast: any,
  config: { [key: string]: any } = {},
) {
  let out: string[] = [];

  const llvm = new LLVM();

  if (!config.no_main_function) llvm.declareFunction("@main", "void", [], []);

  llvm.setConfig(config);

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i];

    parseNode(node, llvm);
  }

  return llvm.get();
}

export function parseNode(
  node: any,
  llvm: LLVM,
  parentFunction: string = "@main",
) {
  switch (node.type) {
    case ASTNodeType.import:
      return irImport(node, llvm);
      break;

    case ASTNodeType.call:
      return irCall(node, llvm, parentFunction);
      break;

    case ASTNodeType.function:
      return irFunction(node, llvm);
      break;

    case ASTNodeType.declaration:
      return irDeclaration(node, llvm);
      break;

    case ASTNodeType.variable:
      return irVariable(node, llvm);
      break;

    case ASTNodeType.binding:
      return irBinding(node, llvm);
      break;

    default:
      log(LogType.ERROR, "Unknown node type");
      return process.exit();
      break;
  }
}

export function getLiteralType(token: { type: TokenType; value: string }) {
  if (token.type != TokenType.literal) {
    log(LogType.ERROR, "Expected literal");

    return process.exit();
  }

  if (quotationMarks.some((v) => token.value.includes(v))) {
    return "string";
  }

  if (token.value == "true" || token.value == "false") {
    return "boolean";
  }

  if (token.value.includes(".")) {
    return "float";
  }

  return "int";
}

export function stripQuotationMarks(value: string) {
  return value.slice(1, value.length - 1);
}
