"use client";

import { useTheme } from "@/providers/theme-provider";
import { Settings2, Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useLanguage } from "@/providers/language-provider";

export function SettingsMenu() {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, toggleLocale, t } = useLanguage();
  // Avoid a hydration mismatch: theme and locale are both read from
  // client-only storage, so render a neutral placeholder until mounted.
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Settings" disabled>
        <Settings2 className="h-[1.1rem] w-[1.1rem]" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings2 className="h-[1.1rem] w-[1.1rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setTheme(isDark ? "light" : "dark");
          }}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="flex-1">
            {isDark ? t("nav.switchToLight") : t("nav.switchToDark")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            toggleLocale();
          }}
        >
          <Languages className="h-4 w-4" />
          <span className="flex-1">{t("nav.switchLanguage")}</span>
          <span className="text-xs font-medium text-muted-foreground">
            {locale === "en" ? "EN" : "ខ្មែរ"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
