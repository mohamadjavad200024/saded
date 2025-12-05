export type NavigationGroup = "main" | "user" | "tools" | "help";

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  group: NavigationGroup;
  enabled: boolean;
  order: number;
}

