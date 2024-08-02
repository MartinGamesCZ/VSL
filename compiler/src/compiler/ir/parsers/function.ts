import { getLiteralType, stripQuotationMarks } from "..";
import { TokenType } from "../../lexer/tokens";
import type LLVM from "../llvm";

export default function irFunction(node: any, llvm: LLVM) {
  llvm.declareFunction(node.name, node.out_type, node.body, node.args);
}
