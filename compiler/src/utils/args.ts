export function getArgs(): string[] {
  const all = process.argv;

  return all.slice(2);
}
