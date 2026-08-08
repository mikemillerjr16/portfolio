import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { capabilities } from "@/data/expertise";
import { ResumeButton } from "./SiteLinks";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background node/data-flow motif (decorative). */}
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-gradient-to-b from-accent-soft/40 to-transparent"
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Open to senior AI solutions architect &amp; engineer roles
          </p>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-[3.5rem]">
            {siteConfig.role}
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
            {siteConfig.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/projects" className="btn btn-primary btn-md">
              View My Work
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <ResumeButton variant="secondary" />
            <Link href="/contact" className="btn btn-ghost btn-md">
              Contact Me
            </Link>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-subtle">
            <MapPin className="h-4 w-4" aria-hidden />
            {siteConfig.location}
          </p>
        </div>

        {/* Headshot */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/15 to-transparent blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-lg">
            <Image
              src={siteConfig.headshotPath}
              alt={`Portrait of ${siteConfig.name}`}
              width={1200}
              height={1200}
              priority
              sizes="(min-width: 1024px) 34rem, (min-width: 640px) 24rem, 90vw"
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Credibility strip */}
      <div className="border-y border-border bg-surface/60 backdrop-blur">
        <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">
            Focus areas
          </span>
          {capabilities.map((cap) => (
            <span key={cap} className="text-sm font-medium text-muted">
              {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
