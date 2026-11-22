"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  textToMorse,
  morseToText,
  getAudioSchedule,
  ToneEvent,
} from "./process";
import { Play, Square, Volume2, Copy, Check, Radio } from "lucide-react";

export default function MorseCodeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState<string>("SOS SOURCE LAB");
  const [wpm, setWpm] = useState<number>(20);
  const [freq, setFreq] = useState<number>(600);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const morseString = useMemo(() => {
    return mode === "encode" ? textToMorse(input) : input;
  }, [input, mode]);

  const decodedString = useMemo(() => {
    return mode === "encode" ? input : morseToText(input);
  }, [input, mode]);

  const outputValue = mode === "encode" ? morseString : decodedString;

  const audioSchedule = useMemo(() => {
    return getAudioSchedule(morseString, wpm);
  }, [morseString, wpm]);

  const stopAudio = () => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    activeNodesRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0);
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    });
    activeNodesRef.current = [];
    setIsPlaying(false);
  };

  const playMorseAudio = async () => {
    stopAudio();
    if (!audioSchedule.tones.length) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const startTime = ctx.currentTime + 0.05;

      audioSchedule.tones.forEach((tone: ToneEvent) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const toneStart = startTime + tone.start;
        const toneEnd = toneStart + tone.duration;

        // Smooth envelope to prevent audio clicking
        gain.gain.setValueAtTime(0, toneStart);
        gain.gain.linearRampToValueAtTime(0.2, toneStart + 0.005);
        gain.gain.setValueAtTime(0.2, toneEnd - 0.005);
        gain.gain.linearRampToValueAtTime(0, toneEnd);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(toneStart);
        osc.stop(toneEnd + 0.01);

        activeNodesRef.current.push({ osc, gain });
      });

      setIsPlaying(true);
      stopTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
      }, (audioSchedule.totalDuration + 0.1) * 1000);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const copyResult = () => {
    navigator.clipboard.writeText(outputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-[#121828] border border-[#232C42] rounded-lg">
        <button
          type="button"
          onClick={() => {
            stopAudio();
            setMode("encode");
            setInput("SOS SOURCE LAB");
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
            mode === "encode"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Text → Morse Code
        </button>
        <button
          type="button"
          onClick={() => {
            stopAudio();
            setMode("decode");
            setInput("... --- ... / ... --- ..- .-. -.-. . .-.. .- -...");
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
            mode === "decode"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Morse Code → Text
        </button>
      </div>

      {/* Input Field */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">
          {mode === "encode" ? "Enter Text to Translate" : "Enter Morse Code (. - /)"}
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            stopAudio();
            setInput(e.target.value);
          }}
          rows={6}
          placeholder={mode === "encode" ? "Type your message..." : "... --- ..."}
          className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE] resize-y"
        />
      </div>

      {/* Quick Samples */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Presets:</span>
        <button
          type="button"
          onClick={() => {
            stopAudio();
            if (mode === "encode") setInput("SOS");
            else setInput("... --- ...");
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          SOS
        </button>
        <button
          type="button"
          onClick={() => {
            stopAudio();
            if (mode === "encode") setInput("CQ CQ CQ DE SOURCELAB");
            else setInput("-.-. --.- / -.-. --.- / -.-. --.- / -.. . / ... --- ..- .-. -.-. . .-.. .- -...");
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Radio CQ
        </button>
        <button
          type="button"
          onClick={() => {
            stopAudio();
            if (mode === "encode") setInput("I LOVE PRIVACY");
            else setInput(".. / .-.. --- ...- . / .--. .-. .. ...- .- -.-. -.--");
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Privacy
        </button>
      </div>

      {/* Audio Controls */}
      <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-[#E6EAF2]">
            <Radio className="w-4 h-4 text-[#22D3EE]" />
            <span>Morse Audio CW Generator</span>
          </div>
          <span className="text-[11px] text-[#8B95AD]">
            Est. {audioSchedule.totalDuration.toFixed(1)}s
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={isPlaying ? stopAudio : playMorseAudio}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isPlaying
                ? "bg-red-500/20 border border-red-500 text-red-400"
                : "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE]/30"
            }`}
          >
            {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? "Stop Beeps" : "Play Morse Audio"}
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-[#8B95AD]">
              <span>Speed</span>
              <span className="font-mono text-[#E6EAF2]">{wpm} WPM</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={wpm}
              onChange={(e) => {
                stopAudio();
                setWpm(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-[#8B95AD]">
              <span>Frequency</span>
              <span className="font-mono text-[#E6EAF2]">{freq} Hz</span>
            </div>
            <input
              type="range"
              min={400}
              max={900}
              step={50}
              value={freq}
              onChange={(e) => {
                stopAudio();
                setFreq(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Output Display Card */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <span>{mode === "encode" ? "Morse Code Output" : "Decoded Text"}</span>
          <button
            type="button"
            onClick={copyResult}
            className="flex items-center gap-1 text-[#22D3EE] hover:underline"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="font-mono text-sm text-[#E6EAF2] bg-[#0B0F1A] p-3 rounded-lg border border-[#232C42] break-all select-all min-h-[90px] whitespace-pre-wrap">
          {outputValue || <span className="text-[#8B95AD]">Output yahan aayega...</span>}
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[10px] text-[#8B95AD]">Length</div>
          <div className="text-base font-bold font-mono text-[#E6EAF2]">
            {outputValue.length}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[10px] text-[#8B95AD]">Audio Tones</div>
          <div className="text-base font-bold font-mono text-[#22D3EE]">
            {audioSchedule.tones.length}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[10px] text-[#8B95AD]">Duration</div>
          <div className="text-base font-bold font-mono text-green-400">
            {audioSchedule.totalDuration.toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Guide Card */}
      <div className="p-3 rounded-lg bg-[#0B0F1A] border border-[#232C42] text-xs text-[#8B95AD] space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#E6EAF2] font-medium">
          <Volume2 className="w-4 h-4 text-[#22D3EE]" />
          <span>Morse Code Conventions:</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <div>• Dot (<span className="text-[#22D3EE]">.</span>) = 1 time unit</div>
          <div>• Dash (<span className="text-[#22D3EE]">-</span>) = 3 time units</div>
          <div>• Char gap = 3 units</div>
          <div>• Word gap (<span className="text-[#22D3EE]">/</span>) = 7 units</div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="morse-code"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={isPlaying ? stopAudio : playMorseAudio}
    />
  );
}
