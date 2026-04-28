import type { SkillInfo } from "../session";

export type SlashCommandKind = "skill" | "new" | "resume" | "exit";

export type SlashCommandItem = {
  kind: SlashCommandKind;
  name: string;
  label: string;
  description: string;
  skill?: SkillInfo;
};

export const BUILTIN_SLASH_COMMANDS: SlashCommandItem[] = [
  {
    kind: "new",
    name: "new",
    label: "/new",
    description: "Start a fresh conversation"
  },
  {
    kind: "resume",
    name: "resume",
    label: "/resume",
    description: "Pick a previous conversation to continue"
  },
  {
    kind: "exit",
    name: "exit",
    label: "/exit",
    description: "Quit Deep Code CLI"
  }
];

export function buildSlashCommands(skills: SkillInfo[]): SlashCommandItem[] {
  const skillItems: SlashCommandItem[] = skills.map((skill) => ({
    kind: "skill",
    name: skill.name,
    label: `/${skill.name}`,
    description: skill.description || "(no description)",
    skill
  }));
  return [...skillItems, ...BUILTIN_SLASH_COMMANDS];
}

export function filterSlashCommands(
  items: SlashCommandItem[],
  token: string
): SlashCommandItem[] {
  if (!token.startsWith("/")) {
    return [];
  }
  const query = token.slice(1).toLowerCase();
  if (!query) {
    return items;
  }
  return items.filter((item) => item.name.toLowerCase().includes(query));
}

export function findExactSlashCommand(
  items: SlashCommandItem[],
  token: string
): SlashCommandItem | null {
  if (!token.startsWith("/")) {
    return null;
  }
  const query = token.slice(1);
  return items.find((item) => item.name === query) ?? null;
}
