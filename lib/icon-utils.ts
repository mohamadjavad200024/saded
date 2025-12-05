import {
  Home,
  Package,
  Sparkles,
  Settings,
  User,
  History,
  Heart,
  FolderOpen,
  FileText,
  HelpCircle,
  Info,
  ShoppingCart,
  Car,
  LogIn,
  LogOut,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Package,
  Sparkles,
  Settings,
  User,
  History,
  Heart,
  FolderOpen,
  FileText,
  HelpCircle,
  Info,
  ShoppingCart,
  Car,
  LogIn,
  LogOut,
};

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Home;
}
