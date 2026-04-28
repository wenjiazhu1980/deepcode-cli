import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLoadingText } from "../ui/loadingText";

test("buildLoadingText returns plain Thinking... when no progress", () => {
  assert.equal(buildLoadingText({ progress: null, now: Date.now() }), "Thinking...");
});

test("buildLoadingText returns plain Thinking... while elapsed below 3s", () => {
  const startedAt = "2026-04-28T00:00:00.000Z";
  const now = Date.parse(startedAt) + 1500;
  const text = buildLoadingText({
    progress: {
      requestId: "r",
      startedAt,
      estimatedTokens: 12,
      formattedTokens: "12",
      phase: "update"
    },
    now
  });
  assert.equal(text, "Thinking...");
});

test("buildLoadingText shows elapsed seconds and tokens once past the threshold", () => {
  const startedAt = "2026-04-28T00:00:00.000Z";
  const now = Date.parse(startedAt) + 5_750;
  const text = buildLoadingText({
    progress: {
      requestId: "r",
      startedAt,
      estimatedTokens: 850,
      formattedTokens: "850",
      phase: "update"
    },
    now
  });
  assert.equal(text, "Thinking... (5s) · ↓ 850 tokens");
});

test("buildLoadingText falls back to '0' when formattedTokens is missing", () => {
  const startedAt = "2026-04-28T00:00:00.000Z";
  const now = Date.parse(startedAt) + 4_000;
  const text = buildLoadingText({
    progress: {
      requestId: "r",
      startedAt,
      estimatedTokens: 0,
      formattedTokens: "",
      phase: "update"
    },
    now
  });
  assert.equal(text, "Thinking... (4s) · ↓ 0 tokens");
});

test("buildLoadingText falls back to Thinking... when timestamp is unparseable", () => {
  const text = buildLoadingText({
    progress: {
      requestId: "r",
      startedAt: "not-a-date",
      estimatedTokens: 0,
      formattedTokens: "0",
      phase: "update"
    },
    now: Date.now()
  });
  assert.equal(text, "Thinking...");
});
