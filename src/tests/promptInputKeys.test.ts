import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTerminalInput } from "../ui/PromptInput";

test("parseTerminalInput treats DEL bytes as backspace", () => {
  const { input, key } = parseTerminalInput("\u007F");
  assert.equal(input, "");
  assert.equal(key.backspace, true);
  assert.equal(key.delete, false);
});

test("parseTerminalInput treats CSI 3 tilde as forward delete", () => {
  const { input, key } = parseTerminalInput("\u001B[3~");
  assert.equal(input, "");
  assert.equal(key.delete, true);
  assert.equal(key.backspace, false);
});

test("parseTerminalInput does not mark plain arrow keys as meta", () => {
  const { key } = parseTerminalInput("\u001B[A");
  assert.equal(key.upArrow, true);
  assert.equal(key.meta, false);
});
