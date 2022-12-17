export function logParseError(procedurePath: string, error: string) {
  console.warn(
    `trpc-panel: Failed to parse procedure ${procedurePath}, ${error}`
  );
}
