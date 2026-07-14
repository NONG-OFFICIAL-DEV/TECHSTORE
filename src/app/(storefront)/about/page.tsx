import type { Metadata } from "next";
import { CtaSection } from "@/components/home/cta-section";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Us | Nova",
  description:
    "Learn about Nova's mission to design technology that moves with you — precision engineering meets everyday usability.",
};

export default function AboutPage() {
  return (
    <>
      <AboutContent />
      <CtaSection />
    </>
  );
}
