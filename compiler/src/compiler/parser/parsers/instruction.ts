import { parseUntilSemicolon } from "..";
import { log, LogType } from "../../../utils/log";
import { TokenType } from "../../lexer/tokens";
import { ASTNodeType } from "../definitions";

export default function parseInstruction(
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
  if (token.type == TokenType.keyword) {
    //TODO: Implement instruction parsing
  }

  if (token.type != TokenType.identifier) {
    log(LogType.ERROR, "Expected identifier");

    return process.exit();
  }

  const instruction = parseUntilSemicolon(token, tokens, i);

  const local_index = 1;
  const next_token = instruction.tokens[local_index];

  if (next_token.type == TokenType.operator) {
    // TODO: Implement operator parsing
  }

  if (next_token.type != TokenType.separator) {
    log(LogType.ERROR, "Expected separator");

    return process.exit();
  }

  let name = token.value;
  let args = [];

  for (let i = 2; i < instruction.tokens.length; i += 2) {
    const token = instruction.tokens[i];

    if (token.type != TokenType.identifier && token.type != TokenType.literal) {
      log(LogType.ERROR, "Expected identifier");

      return process.exit();
    }

    args.push(token);

    if (i < instruction.tokens.length - 1) {
      const next_token = instruction.tokens[i + 1];

      if (next_token.type != TokenType.separator) {
        log(LogType.ERROR, "Expected separator");

        return process.exit();
      }
    }
  }

  return {
    index: instruction.index + 1,
    out: {
      type: ASTNodeType.call,
      name,
      args,
    },
  };
}
