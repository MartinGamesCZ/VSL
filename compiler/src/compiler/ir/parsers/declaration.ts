import { getLiteralType, stripQuotationMarks } from "..";
import { TokenType } from "../../lexer/tokens";
import type LLVM from "../llvm";

export default function irDeclaration(node: any, llvm: LLVM) {
  llvm.declare(node.name, node.out_type, node.args);
}
