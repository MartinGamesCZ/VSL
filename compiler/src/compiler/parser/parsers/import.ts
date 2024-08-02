import { parseUntilScopeEnd, parseUntilSemicolon } from "..";
import { log, LogType } from "../../../utils/log";
import { TokenType } from "../../lexer/tokens";

export default function parseImport(
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

  let features: string[] | "everything" = [];
  let module: string = "";

  if (token.type != TokenType.keyword || token.value != "import") {
    log(LogType.ERROR, "Expected 'import' keyword");

    return process.exit();
  }

  let local_index = 1;
  const next_token = r.tokens[local_index];

  if (next_token.type == TokenType.operator && next_token.value == "*") {
    features = "everything";
  } else {
    const res = parseUntilScopeEnd(next_token, r.tokens, local_index);

    local_index = res.index;

    for (let i = 0; i < res.tokens.length; i += 2) {
      const token = res.tokens[i];
      const next_token = i < res.tokens.length - 1 ? res.tokens[i + 1] : null;

      if (
        token.type != TokenType.identifier ||
        (next_token && next_token.type != TokenType.separator)
      ) {
        log(LogType.ERROR, "Expected identifier");

        return process.exit();
      }

      features.push(token.value);
    }
  }

  const from_token = r.tokens[local_index + 1];

  if (from_token.type != TokenType.keyword || from_token.value != "from") {
    log(LogType.ERROR, "Expected 'from' keyword");

    return process.exit();
  }

  const module_token = r.tokens[local_index + 2];

  if (
    module_token.type != TokenType.literal &&
    module_token.type != TokenType.identifier
  ) {
    log(LogType.ERROR, "Expected literal");

    return process.exit();
  }

  module = module_token.value;

  return {
    index: r.index,
    out: {
      type: "import",
      module,
      features,
    },
  };
}
