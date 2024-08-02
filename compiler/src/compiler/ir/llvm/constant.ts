import { randomUUID } from "crypto";
import { types } from "./types";

export default function llvmConstant(
  name: string,
  type: "string",
  value: string,
) {
  const id = `val_${type}_${randomUUID().replace(/-/g, "")}`;

  return {
    name,
    id,
    type,
    value,
  };
}

export function llvmStringifyConstant(constant: {
  name: string;
  id: string;
  type: "string";
  value: string;
}) {
  const str = processString(constant.value);

  return `@${constant.id} = private unnamed_addr constant [${str.len + 1} x i8] c"${str.str}\\00"`;
}

export function llvmStringifyConstantUse(constant: {
  name: string;
  id: string;
  type: "string";
  value: string;
}) {
  const ptr_id = randomUUID().replace(/-/g, "");
  const ptr = `ptr_${ptr_id}`;

  const str = processString(constant.value);

  const header = `%${ptr} = getelementptr [${str.len + 1} x i8], [${str.len + 1} x i8]* @${constant.id}, i32 0, i32 0`;
  const use = `${types[constant.type]} %${ptr}`;

  return { header, use };
}

export function processString(str: string) {
  const mapped = {
    "\n": {
      replace: "\\0A",
      length: 1,
    },
    "\\n": {
      replace: "\\0A",
      length: 1,
    },
  };

  let out = str;
  let len = str.length;

  for (const key in mapped) {
    const val = mapped[key as keyof typeof mapped];

    let n = out.split(key).length - 1;

    out = out.replaceAll(key, val.replace);

    len += n * (val.length - 2);
  }

  return {
    str: out,
    len,
  };
}
