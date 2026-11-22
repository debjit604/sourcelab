"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import {
  splitGraphemes,
  calculateMetrics,
  getMostMissedKeys,
  loadPersonalBests,
  savePersonalBest,
  SAMPLE_TEXTS,
  PersonalBest,
} from "./process";
import { TypingResults } from "./TypingResults";

type Phase = "setup" | "countdown" | "typing" | "results";

export default function TypingTestTool() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [practiceText, setPracticeText] = useState("");
  const [timeLimit, setTimeLimit] = useState<number>(60); // 60s default
  const [allowBackspace, setAllowBackspace] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [showLiveWpm, setShowLiveWpm] = useState(true);
  const [wordMode, setWordMode] = useState<"standard" | "actual-words">("standard");

  const [countdown, setCountdown] = useState(3);
  const [graphemes, setGraphemes] = useState<string[]>([]);
  const [charStatus, setCharStatus] = useState<("correct" | "wrong" | "pending")[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [elapsed, setElapsed] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [missedKeysMap, setMissedKeysMap] = useState<Record<string, number>>({});
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>(() => loadPersonalBests());

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const historyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (historyTimerRef.current) clearInterval(historyTimerRef.current);
    setPhase("results");

    const metrics = calculateMetrics(
      currentIndex,
      errorsCount,
      totalKeystrokes,
      elapsed,
      wordMode
    );
    const pb: PersonalBest = {
      date: new Date().toISOString().split("T")[0],
      netWpm: metrics.netWpm,
      accuracy: metrics.accuracy,
      timeLimit,
    };
    savePersonalBest(pb);
    setPersonalBests(loadPersonalBests());
  }, [currentIndex, errorsCount, totalKeystrokes, elapsed, wordMode, timeLimit]);

  // Handle countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    const cd = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(cd);
          setPhase("typing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cd);
  }, [phase]);

  // Main typing timer
  useEffect(() => {
    if (phase !== "typing") return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (timeLimit > 0 && next >= timeLimit) {
          finishTest();
        }
        return next;
      });
    }, 1000);

    // Track WPM history every 2 seconds for chart
    historyTimerRef.current = setInterval(() => {
      setElapsed((curElapsed) => {
        const m = calculateMetrics(currentIndex, errorsCount, totalKeystrokes, curElapsed, wordMode);
        setWpmHistory((hist) => [...hist, m.netWpm]);
        return curElapsed;
      });
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (historyTimerRef.current) clearInterval(historyTimerRef.current);
    };
  }, [phase, timeLimit, finishTest, currentIndex, errorsCount, totalKeystrokes, wordMode]);

  // Focus input when typing begins
  useEffect(() => {
    if (phase === "typing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const handleStart = () => {
    if (!practiceText.trim()) return;
    const segments = splitGraphemes(practiceText.trim());
    setGraphemes(segments);
    setCharStatus(new Array(segments.length).fill("pending"));
    setCurrentIndex(0);
    setElapsed(0);
    setTotalKeystrokes(0);
    setErrorsCount(0);
    setMissedKeysMap({});
    setWpmHistory([]);
    setCountdown(3);
    setPhase("countdown");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (phase !== "typing") return;

    if (e.key === "Backspace") {
      if (!allowBackspace) {
        e.preventDefault();
        return;
      }
      if (currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
        setCharStatus((prev) => {
          const next = [...prev];
          next[currentIndex - 1] = "pending";
          return next;
        });
      }
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const typedChar = e.key;
      const expectedChar = graphemes[currentIndex];
      setTotalKeystrokes((k) => k + 1);

      if (typedChar === expectedChar) {
        setCharStatus((prev) => {
          const next = [...prev];
          next[currentIndex] = "correct";
          return next;
        });
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        if (nextIndex >= graphemes.length) {
          finishTest();
        }
      } else {
        setErrorsCount((c) => c + 1);
        setMissedKeysMap((map) => ({ ...map, [expectedChar]: (map[expectedChar] || 0) + 1 }));
        setCharStatus((prev) => {
          const next = [...prev];
          next[currentIndex] = "wrong";
          return next;
        });
        if (!strictMode) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          if (nextIndex >= graphemes.length) {
            finishTest();
          }
        }
      }
    }
  };

  const liveMetrics = calculateMetrics(currentIndex, errorsCount, totalKeystrokes, elapsed, wordMode);
  const remainingTime = timeLimit > 0 ? Math.max(0, timeLimit - elapsed) : elapsed;

  return (
    <ToolShell
      toolId="typing-test"
      input={
        <div className="space-y-5">
          {phase === "setup" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--sl-muted)]">
                  Practice Text (Max 5,000 Chars)
                </label>
                <div className="flex gap-2 text-xs">
                  <span className="text-[var(--sl-muted)]">Samples:</span>
                  <button onClick={() => setPracticeText(SAMPLE_TEXTS.english)} className="text-[var(--sl-accent)] hover:underline">
                    English
                  </button>
                  <span className="text-[var(--sl-border)]">|</span>
                  <button onClick={() => setPracticeText(SAMPLE_TEXTS.hindi)} className="text-[var(--sl-accent)] hover:underline">
                    Hindi
                  </button>
                  <span className="text-[var(--sl-border)]">|</span>
                  <button onClick={() => setPracticeText(SAMPLE_TEXTS.bengali)} className="text-[var(--sl-accent)] hover:underline">
                    Bengali
                  </button>
                </div>
              </div>

              <Textarea
                value={practiceText}
                onChange={(e) => setPracticeText(e.target.value.slice(0, 5000))}
                placeholder="Apna custom paragraph yahan paste karo..."
                rows={7}
                className="font-sans text-sm resize-y"
              />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <span className="block text-[var(--sl-muted)] mb-1">Time Limit</span>
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full bg-[var(--sl-bg)] border border-[var(--sl-border)] rounded-md p-1.5 text-xs text-[var(--sl-text)]"
                  >
                    <option value={0}>No Limit</option>
                    <option value={60}>1 Minute</option>
                    <option value={120}>2 Minutes</option>
                    <option value={300}>5 Minutes</option>
                  </select>
                </div>
                <div>
                  <span className="block text-[var(--sl-muted)] mb-1">Backspace</span>
                  <button
                    onClick={() => setAllowBackspace(!allowBackspace)}
                    className={`w-full p-1.5 rounded-md border text-xs font-medium ${allowBackspace ? "border-[var(--sl-accent)] text-[var(--sl-accent)] bg-cyan-950/20" : "border-[var(--sl-border)] text-[var(--sl-muted)]"}`}
                  >
                    {allowBackspace ? "Allowed" : "Locked"}
                  </button>
                </div>
                <div>
                  <span className="block text-[var(--sl-muted)] mb-1">Strict Mode</span>
                  <button
                    onClick={() => setStrictMode(!strictMode)}
                    className={`w-full p-1.5 rounded-md border text-xs font-medium ${strictMode ? "border-amber-400 text-amber-400 bg-amber-950/20" : "border-[var(--sl-border)] text-[var(--sl-muted)]"}`}
                  >
                    {strictMode ? "Fix Mistakes" : "Flexible"}
                  </button>
                </div>
                <div>
                  <span className="block text-[var(--sl-muted)] mb-1">Live WPM</span>
                  <button
                    onClick={() => setShowLiveWpm(!showLiveWpm)}
                    className={`w-full p-1.5 rounded-md border text-xs font-medium ${showLiveWpm ? "border-[var(--sl-accent)] text-[var(--sl-accent)] bg-cyan-950/20" : "border-[var(--sl-border)] text-[var(--sl-muted)]"}`}
                  >
                    {showLiveWpm ? "Show Live" : "Hidden"}
                  </button>
                </div>
                <div>
                  <span className="block text-[var(--sl-muted)] mb-1">Formula</span>
                  <button
                    onClick={() => setWordMode(wordMode === "standard" ? "actual-words" : "standard")}
                    className="w-full p-1.5 rounded-md border border-[var(--sl-border)] text-xs text-[var(--sl-text)]"
                  >
                    {wordMode === "standard" ? "5 chars = 1 word" : "Actual words"}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleStart}
                disabled={!practiceText.trim()}
                className="w-full gap-2 bg-[var(--sl-accent)] text-[#0B0F1A] hover:bg-cyan-400 font-semibold"
              >
                <Play className="w-4 h-4 fill-current" /> Start Practice Test
              </Button>
            </div>
          )}

          {phase === "countdown" && (
            <div className="py-16 text-center space-y-4" aria-live="polite">
              <div className="text-7xl font-bold font-mono text-[var(--sl-accent)] animate-bounce">
                {countdown > 0 ? countdown : "GO!"}
              </div>
              <p className="text-xs text-[var(--sl-muted)]">Typing starts automatically on GO</p>
            </div>
          )}

          {phase === "typing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-[var(--sl-surface)] border border-[var(--sl-border)]">
                <span className="flex items-center gap-1.5 text-[var(--sl-muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                  {timeLimit > 0 ? `Time Left: ${remainingTime}s` : `Time: ${elapsed}s`}
                </span>
                {showLiveWpm && (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[var(--sl-success)] font-semibold">{liveMetrics.netWpm} WPM</span>
                    <span className="font-mono text-[var(--sl-accent)]">{liveMetrics.accuracy}% acc</span>
                  </div>
                )}
                <Button onClick={finishTest} variant="ghost" size="sm" className="h-6 text-[10px] text-red-400 hover:text-red-300">
                  End Test
                </Button>
              </div>

              <div
                onClick={() => inputRef.current?.focus()}
                className="p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] min-h-[140px] text-base leading-relaxed tracking-wide font-mono relative cursor-text select-none"
              >
                {graphemes.map((char, idx) => {
                  const status = charStatus[idx];
                  const isCurrent = idx === currentIndex;
                  return (
                    <span
                      key={idx}
                      className={`${
                        status === "correct"
                          ? "text-emerald-400"
                          : status === "wrong"
                          ? "text-rose-400 bg-rose-950/30 rounded"
                          : "text-[var(--sl-muted)] opacity-60"
                      } ${isCurrent ? "bg-cyan-500/20 border-b-2 border-[var(--sl-accent)]" : ""}`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute -z-10 pointer-events-none"
                onKeyDown={handleKeyDown}
                onPaste={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          )}

          {phase === "results" && (
            <TypingResults
              metrics={calculateMetrics(currentIndex, errorsCount, totalKeystrokes, elapsed, wordMode)}
              history={wpmHistory}
              missedKeys={getMostMissedKeys(missedKeysMap)}
              onRetrySame={handleStart}
              onRetryMistakes={() => {
                const mistakeSegments = graphemes.filter((_, idx) => charStatus[idx] === "wrong");
                setPracticeText(mistakeSegments.join(" ") || practiceText);
                setPhase("setup");
              }}
              hasMistakes={errorsCount > 0}
              personalBests={personalBests}
            />
          )}
        </div>
      }
      output={null}
    />
  );
}
