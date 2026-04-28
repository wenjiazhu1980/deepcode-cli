import React from "react";
import { render } from "ink";
import { App } from "./ui/App";

const args = process.argv.slice(2);

if (args.includes("--version") || args.includes("-v")) {
  // version is replaced at build time below if needed; fallback to package.json read
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require("../package.json");
    process.stdout.write(`${pkg.version}\n`);
  } catch {
    process.stdout.write("unknown\n");
  }
  process.exit(0);
}

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(
    [
      "deepcode - Deep Code CLI",
      "",
      "Usage:",
      "  deepcode               Launch the interactive TUI in the current directory",
      "  deepcode --version     Print the version",
      "  deepcode --help        Show this help",
      "",
      "Configuration:",
      "  ~/.deepcode/settings.json   API key, model, base URL",
      "  ~/.agents/skills/*/SKILL.md  User-level skills",
      "  ./.deepcode/skills/*/SKILL.md Project-level skills",
      "",
      "Inside the TUI:",
      "  Enter            Send the prompt",
      "  Shift+Enter      Insert a newline",
      "  Ctrl+V           Paste an image from the clipboard",
      "  Esc              Interrupt the current model turn",
      "  /                Open the skills/commands menu",
      "  /new             Start a fresh conversation",
      "  /resume          Pick a previous conversation to continue",
      "  /exit            Quit",
      "  Ctrl+D twice     Quit"
    ].join("\n") + "\n"
  );
  process.exit(0);
}

const projectRoot = process.cwd();

if (!process.stdin.isTTY) {
  process.stderr.write(
    "deepcode requires an interactive terminal (TTY). " +
      "Re-run from a real terminal session.\n"
  );
  process.exit(1);
}

const inkInstance = render(<App projectRoot={projectRoot} />, {
  exitOnCtrlC: false
});

inkInstance.waitUntilExit().then(() => {
  process.exit(0);
});
