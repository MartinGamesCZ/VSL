import { getLiteralType, stripQuotationMarks } from "..";
import { TokenType } from "../../lexer/tokens";
import type LLVM from "../llvm";

export default function irVariable(node: any, llvm: LLVM) {
  llvm.declareVariable(node.name, node.var_type, node.value);
}
