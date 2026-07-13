"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Contact submission failed");

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-12 h-full"
      >
        <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-lg font-semibold text-foreground">
          {t("contact.sentTitle")}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          {t("contact.sentDesc")}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          {t("contact.sendAnother")}
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 md:p-8"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            {t("contact.nameLabel")}
          </label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t("contact.namePlaceholder")}
            className="mt-1.5"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            {t("contact.emailFieldLabel")}
          </label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t("contact.emailPlaceholder")}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          {t("contact.messageLabel")}
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={t("contact.messagePlaceholder")}
          className="mt-1.5 flex w-full rounded-lg border border-border/60 bg-background/60 px-4 py-3 text-sm backdrop-blur-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 resize-none"
        />
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{t("contact.errorGeneric")}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="gap-2 self-start"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("contact.sending")}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> {t("contact.send")}
          </>
        )}
      </Button>
    </form>
  );
}