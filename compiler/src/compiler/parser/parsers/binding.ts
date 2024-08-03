import parser, { parseUntilScopeEnd, parseUntilSemicolon } from "..";
import { log, LogType } from "../../../utils/log";
import { TokenType } from "../../lexer/tokens";
import { ASTNodeType } from "../definitions";

export default function parseBinding(
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
  if (token.type != TokenType.keyword || token.value != "bind") {
    log(LogType.ERROR, "Expected keyword 'bind'");

    return process.exit();
  }

  const next = tokens[i + 1];

  if (next.type != TokenType.identifier) {
    log(LogType.ERROR, "Expected identifier");

    return process.exit();
  }

  const name = next.value;
  const args = [];

  let local_index = i + 2;

  const args_res = parseUntilScopeEnd(tokens[i + 2], tokens, i + 2);

  for (let i = 0; i < args_res.tokens.length; i += 2) {
    const type = args_res.tokens[i];
    const div = i < args_res.tokens.length - 1 ? args_res.tokens[i + 1] : null;

    if (type.type != TokenType.keyword) {
      log(LogType.ERROR, "Expected keyword");

      return process.exit();
    }

    if (div && div.type != TokenType.separator) {
      log(LogType.ERROR, "Expected separator");

      return process.exit();
    }

    args.push(type.value);

    local_index += 2;
  }

  local_index++;

  const type_sep = tokens[local_index];
  const type = tokens[local_index + 1];

  local_index += 2;

  if (type_sep.type != TokenType.separator || type.type != TokenType.keyword) {
    log(LogType.ERROR, "Expected type");

    return process.exit();
  }

  return {
    index: local_index,
    out: {
      type: ASTNodeType.binding,
      name,
      out_type: type.value,
      args,
    },
  };
}
