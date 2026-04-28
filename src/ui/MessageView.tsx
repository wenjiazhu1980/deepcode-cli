import React from "react";
import { Box, Text } from "ink";
import { renderMarkdown } from "./markdown";
import type { SessionMessage } from "../session";

type Props = {
  message: SessionMessage;
  collapsed?: boolean;
};

export function MessageView({ message, collapsed }: Props): React.ReactElement | null {
  if (!message.visible) {
    return null;
  }

  if (message.role === "user") {
    const text = message.content || "(no content)";
    return (
      <Box flexDirection="column" marginY={0}>
        <Text color="green">{`❯ ${text}`}</Text>
        {Array.isArray(message.contentParams) && message.contentParams.length > 0 ? (
          <Text color="green">{`  📎 ${message.contentParams.length} image attachment(s)`}</Text>
        ) : null}
      </Box>
    );
  }

  if (message.role === "assistant") {
    const isThinking = Boolean(message.meta?.asThinking);
    const content = (message.content || "").trim();

    if (isThinking && collapsed) {
      const summary = firstNonEmptyLine(content) || "(thinking…)";
      return (
        <Box marginY={0}>
          <Text dimColor>▸ Assistant (thinking) · {truncate(summary, 100)}</Text>
        </Box>
      );
    }

    return (
      <Box flexDirection="column" marginY={0}>
        <Text color="cyan" bold>{isThinking ? "Assistant (thinking)" : "Assistant"}</Text>
        <Box marginLeft={2} flexDirection="column">
          {content ? <Text>{renderMarkdown(content)}</Text> : null}
        </Box>
      </Box>
    );
  }

  if (message.role === "tool") {
    const meta = message.meta;
    const fnName =
      meta?.function && typeof (meta.function as { name?: unknown }).name === "string"
        ? ((meta.function as { name: string }).name)
        : "tool";
    const params = meta?.paramsMd ?? "";
    return (
      <Box marginY={0}>
        <Text color="yellow">▸ {fnName}{params ? `: ${truncate(params, 120)}` : ""}</Text>
      </Box>
    );
  }

  if (message.role === "system") {
    if (message.meta?.skill) {
      return (
        <Box marginY={0}>
          <Text color="magenta">⚡ Loaded skill: {message.meta.skill.name}</Text>
        </Box>
      );
    }
    if (message.meta?.isSummary) {
      return (
        <Box marginY={0}>
          <Text dimColor italic>(conversation summary inserted)</Text>
        </Box>
      );
    }
    return null;
  }

  return null;
}

function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max)}…`;
}

function firstNonEmptyLine(value: string): string {
  for (const line of value.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return "";
}
