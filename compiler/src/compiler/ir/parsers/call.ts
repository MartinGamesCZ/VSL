import { getLiteralType, stripQuotationMarks } from "..";
import { TokenType } from "../../lexer/tokens";
import type LLVM from "../llvm";

export default function irCall(
  node: any,
  llvm: LLVM,
  parentFun: string = "@main",
) {
  node.args.forEach((arg: any) => {
    if (arg.type == TokenType.literal) {
      // TODO: Implement all types
      llvm.declareValue(
        getLiteralType(arg) as "string",
        stripQuotationMarks(arg.value),
      );
    }
  });

  llvm.addFunctionBody(parentFun, node.name, node.args);
}
