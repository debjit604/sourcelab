export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[var(--sl-bg)] text-[var(--sl-text)]">
      <div className="w-full max-w-[var(--max-w-home)] flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--sl-border)] bg-[var(--sl-surface)] text-xs text-[var(--sl-accent)]">
          <span className="w-2 h-2 rounded-full bg-[var(--sl-accent)] animate-pulse" />
          <span>SourceLab • Phase 0 Scaffold</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-heading text-[var(--sl-text)]">
          Tumhari file tumhare browser me hi process hoti hai
        </h1>
        <p className="max-w-xl text-lg text-[var(--sl-muted)]">
          Zero server uploads. 100% private. 200+ browser utilities.
        </p>
      </div>
    </main>
  );
}
