"use client"

import { useState } from "react";
import Link from "next/link";
import { Loader2, Check } from "lucide-react";
import { NAV_LINKS, CATEGORIES } from "@/data/nav";
import { Button } from "@/components/ui/button";

const SOCIALS = [
  { label: "GH", name: "GitHub", href: "#" },
  { label: "X", name: "Twitter", href: "#" },
  { label: "IG", name: "Instagram", href: "#" },
];

type NewsletterStatus = "idle" | "submitting" | "success" | "error";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Newsletter signup failed");
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand + newsletter */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_2px] shadow-primary/60" aria-hidden />
              TECHSTORE
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Gadgets chosen for how they&apos;re engineered, not just what they claim to do.
            </p>
            {status === "success" ? (
              <p className="mt-6 flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                <Check className="h-4 w-4" /> You&apos;re subscribed!
              </p>
            ) : (
              <form className="mt-6 flex max-w-sm gap-2" onSubmit={handleSubscribe}>
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="submit" disabled={status === "submitting"} className="shrink-0 gap-1.5">
                  {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
                  Subscribe
                </Button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs text-destructive">
                Something went wrong — please try again.
              </p>
            )}
          </div>

          {/* Nav column */}
          <div>
            <h3 className="font-display text-sm font-semibold">Navigate</h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories column */}
          <div>
            <h3 className="font-display text-sm font-semibold">Categories</h3>
            <ul className="mt-4 space-y-3">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display text-sm font-semibold">Follow</h3>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border font-mono text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} TECHSTORE. All rights reserved.
          </p>
          <div className="flex gap-6 font-mono text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}