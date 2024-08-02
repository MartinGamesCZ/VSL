import { log, LogType } from "../../utils/log";
import { ASTNodeType } from "../parser/definitions";
import irCall from "./parsers/call";
import irImport from "./parsers/import";

export default function intermediateRepresentation(ast: any) {
  let out: string[] = [];

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i];

    out.push(parseNode(node));
  }

  return out.join("\n");
}

export function parseNode(node: any) {
  switch (node.type) {
    case ASTNodeType.import:
      return irImport(node);
      break;

    case ASTNodeType.call:
      return irCall(node);
      break;

    default:
      log(LogType.ERROR, "Unknown node type");
      return process.exit();
      break;
  }
}
