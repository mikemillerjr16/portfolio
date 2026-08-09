"use client";

import { useState } from "react";
import { Check, Download, Github, Link2, Linkedin, Mail, Printer } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/** Resume download/view link. Opens the PDF in a new tab; no gate. */
export function ResumeButton({
  variant = "primary",
  size = "md",
  label = "Download Resume",
  className,
}: {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={siteConfig.resumePath}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("resume_downloaded", { source: label })}
      className={cn("btn", `btn-${variant}`, `btn-${size}`, className)}
    >
      <Download className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}

/**
 * Prints the actual résumé PDF (not the web page). Loads the same-origin PDF in
 * a hidden iframe and opens the print dialog for it; falls back to opening the
 * PDF in a new tab if a browser blocks iframe printing (e.g. some Safari builds).
 */
export function PrintButton({
  label = "Print résumé",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const printResume = () => {
    document.getElementById("resume-print-frame")?.remove();
    const iframe = document.createElement("iframe");
    iframe.id = "resume-print-frame";
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    iframe.src = siteConfig.resumePath;
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.open(siteConfig.resumePath, "_blank", "noopener,noreferrer");
      }
    };
    document.body.appendChild(iframe);
    trackEvent("resume_printed");
  };

  return (
    <button
      type="button"
      onClick={printResume}
      className={cn("btn btn-ghost btn-md no-print", className)}
    >
      <Printer className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

/** Copies the current page URL to the clipboard (with a fallback). */
export function ShareButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — no-op.
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className={cn("btn btn-secondary btn-sm no-print", className)}
      aria-label="Copy link to this page"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" aria-hidden />
          Share
        </>
      )}
    </button>
  );
}

/** Row of social icon links (LinkedIn, GitHub) with analytics hooks. */
export function SocialLinks({
  className,
  showEmail = false,
}: {
  className?: string;
  showEmail?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <a
        href={siteConfig.socials.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn profile (opens in a new tab)"
        onClick={() => trackEvent("linkedin_clicked")}
        className="btn btn-ghost h-9 w-9 !px-0"
      >
        <Linkedin className="h-[1.15rem] w-[1.15rem]" aria-hidden />
      </a>
      <a
        href={siteConfig.socials.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub profile (opens in a new tab)"
        onClick={() => trackEvent("github_clicked")}
        className="btn btn-ghost h-9 w-9 !px-0"
      >
        <Github className="h-[1.15rem] w-[1.15rem]" aria-hidden />
      </a>
      {showEmail ? (
        <a
          href={`mailto:${siteConfig.email}`}
          aria-label={`Email ${siteConfig.name}`}
          className="btn btn-ghost h-9 w-9 !px-0"
        >
          <Mail className="h-[1.15rem] w-[1.15rem]" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
