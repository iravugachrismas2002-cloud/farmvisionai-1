import {
  BarChart3,
  BellRing,
  Boxes,
  Brain,
  Cpu,
  LayoutDashboard,
  Lightbulb,
  Sprout,
  Stethoscope,
  Store,
  Tractor,
  Wheat,
  Zap,
  Box,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

/**
 * Only routes that exist in `frontend/app` belong here. Add an entry when a new
 * page ships so the sidebar never links to a 404.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { title: "Farms", href: "/farms", icon: Tractor },
      { title: "Devices", href: "/devices", icon: Cpu },
      { title: "Alerts", href: "/alerts", icon: BellRing },
      { title: "Recommendations", href: "/recommendations", icon: Lightbulb },
      { title: "Fields", href: "/fields", icon: Wheat },
      { title: "Livestock", href: "/livestock", icon: Boxes },
      { title: "Actuators", href: "/actuators", icon: Zap },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "Intelligence", href: "/intelligence", icon: Brain },
      { title: "Digital twin", href: "/digital-twin", icon: Box },
    ],
  },
  {
    label: "Services",
    items: [
      { title: "Agronomist", href: "/agronomist", icon: Sprout },
      { title: "Veterinary", href: "/veterinary", icon: Stethoscope },
      { title: "Marketplace", href: "/marketplace", icon: Store },
    ],
  },
];

export function findNavItem(pathname: string): NavItem | undefined {
  const all = NAV_SECTIONS.flatMap((section) => section.items);
  return all
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

