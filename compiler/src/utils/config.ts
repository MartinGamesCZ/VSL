import { TOML } from "bun";
import { existsSync, readFileSync } from "fs";
import path from "path";

export function getConfig(root_path: string): {
  [key: string]: any;
} {
  const config_path = path.join(root_path, "project.toml");

  if (!existsSync(config_path))
    return {
      error: "No project.toml found",
    };

  const content = readFileSync(config_path, "utf-8");
  const parsed = TOML.parse(content);

  return parsed;
}
