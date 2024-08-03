export const separatorPairs = {
  "{": "}",
  "(": ")",
  "[": "]",
  "<": ">",

  "}": "{",
  ")": "(",
  "]": "[",
  ">": "<",
};

export enum ASTNodeType {
  "import" = "import",
  "call" = "call",
  "function" = "function",
  "declaration" = "declaration",
  "variable" = "variable",
  "expression" = "expression",
}
