import type { LlmStreamProgress } from "../session";

export type LoadingTextInput = {
  progress: LlmStreamProgress | null;
  now: number;
};

const STALL_THRESHOLD_MS = 3000;

export function buildLoadingText(input: LoadingTextInput): string {
  const { progress, now } = input;
  if (!progress) {
    return "Thinking...";
  }

  const startedAt = parseTimestamp(progress.startedAt);
  if (startedAt === null) {
    return "Thinking...";
  }

  const elapsedMs = Math.max(0, now - startedAt);
  if (elapsedMs < STALL_THRESHOLD_MS) {
    return "Thinking...";
  }

  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const tokens = progress.formattedTokens || "0";
  return `Thinking... (${elapsedSeconds}s) · ↓ ${tokens} tokens`;
}

function parseTimestamp(value: string): number | null {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}
