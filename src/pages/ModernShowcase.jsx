import React from "react";
import { ThemeProvider } from "../components/modern/theme-provider";
import { ModernNavbar } from "../components/modern/navbar";
import { HeroSection } from "../components/modern/hero";
import { ProjectGrid } from "../components/modern/project-grid";
import { ContactForm } from "../components/modern/contact-form";

export default function ModernShowcase() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ModernNavbar />
        <main>
          <HeroSection />
          <ProjectGrid />
          <ContactForm />
        </main>
      </div>
    </ThemeProvider>
  );
}
