import {
  comments,
  includedSeparators,
  keywords,
  literals,
  literalsNumber,
  operators,
  quotationMarks,
  separators,
} from "./definitions";
import { TokenType } from "./tokens";

export default function lexer(code: string) {
  const characters = code.split("");

  const tokens: {
    type: TokenType;
    value: string;
  }[] = [];

  for (let x = 0; x < characters.length; x++) {
    const character = characters[x];

    if (comments.includes(character)) {
      const line = getUntlineNewline(character, characters, x);

      x = line.index;

      continue;
    }

    const t = getUntilSeparator(character, characters, x);

    x = t.index;

    if (t.value === "") continue;

    if (keywords.includes(t.value)) {
      tokens.push({
        type: TokenType.keyword,
        value: t.value,
      });
    } else if (includedSeparators.includes(t.value)) {
      tokens.push({
        type: TokenType.separator,
        value: t.value,
      });
    } else if (operators.includes(t.value)) {
      tokens.push({
        type: TokenType.operator,
        value: t.value,
      });
    } else if (
      literals.includes(t.value) ||
      includesQuotationMark(t.value) ||
      literalsNumber.test(t.value)
    ) {
      tokens.push({
        type: TokenType.literal,
        value: t.value,
      });
    } else {
      tokens.push({
        type: TokenType.identifier,
        value: t.value,
      });
    }
  }

  return tokens;
}

export function getUntilSeparator(
  c: string,
  chars: string[],
  i: number,
): {
  value: string;
  index: number;
} {
  let out = "";
  let index = i;

  let openQuotationMarks = false;

  if (separators.includes(c) && includedSeparators.includes(c))
    return { value: c, index: i };

  for (let x = i; x < chars.length; x++) {
    const char = chars[x];

    if (quotationMarks.includes(char)) openQuotationMarks = !openQuotationMarks;

    if (separators.includes(char) && !openQuotationMarks) {
      if (includedSeparators.includes(char)) index = x - 1;
      else index = x;

      break;
    }

    out += char;
  }

  return {
    value: out,
    index,
  };
}

export function includesQuotationMark(value: string) {
  return quotationMarks.some((q) => value.includes(q));
}

export function getUntlineNewline(c: string, chars: string[], i: number) {
  let out = "";
  let index = i;

  for (let x = i; x < chars.length; x++) {
    const char = chars[x];

    if (char === "\n") {
      index = x;

      break;
    }

    out += char;
  }

  return {
    value: out,
    index,
  };
}
