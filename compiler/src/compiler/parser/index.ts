import { log, LogType } from "../../utils/log";
import { TokenType } from "../lexer/tokens";
import { separatorPairs } from "./definitions";
import parseDeclaration from "./parsers/declaration";
import parseFunction from "./parsers/function";
import parseImport from "./parsers/import";
import parseInstruction from "./parsers/instruction";
import parseVariable from "./parsers/variable";

export default function parser(tokens: { type: TokenType; value: string }[]) {
  let ast = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type == TokenType.keyword) {
      if (token.value == "import") {
        const o = parseImport(token, tokens, i);

        i = o.index;

        ast.push(o.out);

        continue;
      } else if (token.value == "fun") {
        const o = parseFunction(token, tokens, i);

        i = o.index;

        ast.push(o.out);

        continue;
      } else if (token.value == "declare") {
        const o = parseDeclaration(token, tokens, i);

        i = o.index;

        ast.push(o.out);

        continue;
      } else if (token.value == "var") {
        const o = parseVariable(token, tokens, i);

        i = o.index;

        ast.push(o.out);

        continue;
      }
    } else if (token.type == TokenType.identifier) {
      const o = parseInstruction(token, tokens, i);

      i = o.index;

      ast.push(o.out);

      continue;
    }

    /*const o = parseUntilSemicolon(token, tokens, i);

    i = o.index;

    ast.push(o.tokens);*/

    log(LogType.ERROR, "Unexpected token");
    console.log(token);

    return process.exit();
  }

  return ast;
}

export function parseUntilSemicolon(
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
  let index = i;

  const out: {
    type: TokenType;
    value: string;
  }[] = [];

  while (index < tokens.length) {
    const token = tokens[index];

    if (token.type == TokenType.separator && token.value === ";") break;

    out.push(token);
    index++;
  }

  return {
    tokens: out,
    index,
  };
}

export function parseUntilScopeEnd(
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
  let index = i + 1;

  if (token.type != TokenType.separator) {
    log(LogType.ERROR, "Expected separator");

    return process.exit();
  }

  const out: {
    type: TokenType;
    value: string;
  }[] = [];

  const lookingFor = separatorPairs[token.value as keyof typeof separatorPairs];

  if (!lookingFor) {
    log(LogType.ERROR, "Invalid separator");

    return process.exit();
  }

  while (index < tokens.length) {
    const token = tokens[index];

    if (token.type == TokenType.separator && token.value === lookingFor) break;

    out.push(token);
    index++;
  }

  return {
    tokens: out,
    index,
  };
}
