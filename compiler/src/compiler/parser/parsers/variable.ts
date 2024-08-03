import { parseUntilScopeEnd, parseUntilSemicolon } from "..";
import { log, LogType } from "../../../utils/log";
import { TokenType } from "../../lexer/tokens";
import { ASTNodeType } from "../definitions";

export default function parseVariable(
  token: {
    type: TokenType;
    value: string;
  },
  tokens: {
    type: TokenType;
    value: string;
  }[],
  i: number,
) {
  const r = parseUntilSemicolon(token, tokens, i);

  if (token.type != TokenType.keyword || token.value != "var") {
    log(LogType.ERROR, "Expected 'var' keyword");

    return process.exit();
  }

  let local_index = 1;
  const name_token = r.tokens[local_index];

  if (name_token.type != TokenType.identifier) {
    log(LogType.ERROR, "Expected identifier");

    return process.exit();
  }

  const type_sep_token = r.tokens[local_index + 1];
  const type_token = r.tokens[local_index + 2];

  if (type_sep_token.type != TokenType.separator) {
    log(LogType.ERROR, "Expected separator");

    return process.exit();
  }

  if (type_token.type != TokenType.keyword) {
    log(LogType.ERROR, "Expected keyword");

    return process.exit();
  }

  const operator_token = r.tokens[local_index + 3];

  if (
    operator_token.type != TokenType.operator ||
    operator_token.value != "="
  ) {
    log(LogType.ERROR, "Expected operator");

    return process.exit();
  }

  const expression = r.tokens.slice(local_index + 4, r.tokens.length);

  if (expression.length > 1) {
    return {
      index: r.index,
      out: {
        type: ASTNodeType.variable,
        name: name_token.value,
        var_type: type_token.value,
        value: {
          type: ASTNodeType.expression,
          value: expression,
        },
      },
    };
  }

  return {
    index: r.index,
    out: {
      type: ASTNodeType.variable,
      name: name_token.value,
      var_type: type_token.value,
      value: expression[0],
    },
  };
}
