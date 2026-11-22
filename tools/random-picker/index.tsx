"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  pickRandomItems,
  shuffleList,
  flipCoin,
  rollDice,
  PickerMode,
} from "./process";
import { Dices, Sparkles, RefreshCw, Copy, Check } from "lucide-react";

export default function RandomPickerTool() {
  const [mode, setMode] = useState<PickerMode>("pick");
  const [textInput, setTextInput] = useState<string>(
    "Aarav\nDiya\nIshaan\nAnanya\nKabir\nRhea\nVivaan\nMyra"
  );
  const [pickCount, setPickCount] = useState<number>(1);
  const [diceSides, setDiceSides] = useState<number>(6);
  const [diceCount, setDiceCount] = useState<number>(2);

  const [pickedResult, setPickedResult] = useState<string[]>(["Aarav"]);
  const [copied, setCopied] = useState<boolean>(false);

  const parsedItems = useMemo(() => {
    return textInput
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [textInput]);

  const handleAction = () => {
    if (mode === "pick") {
      if (!parsedItems.length) return;
      const picked = pickRandomItems(parsedItems, pickCount, false);
      setPickedResult(picked);
    } else if (mode === "shuffle") {
      if (!parsedItems.length) return;
      const shuffled = shuffleList(parsedItems);
      setPickedResult(shuffled);
    } else if (mode === "coin") {
      setPickedResult([flipCoin()]);
    } else if (mode === "dice") {
      const rolls = rollDice(diceSides, diceCount);
      setPickedResult(rolls.map(String));
    }
  };

  const handleCopy = () => {
    if (!pickedResult.length) return;
    navigator.clipboard.writeText(pickedResult.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#121828] border border-[#232C42] rounded-lg">
        {[
          { id: "pick" as PickerMode, label: "Pick Winner" },
          { id: "shuffle" as PickerMode, label: "Shuffle List" },
          { id: "coin" as PickerMode, label: "Coin Flip" },
          { id: "dice" as PickerMode, label: "Roll Dice" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              if (m.id === "coin") setPickedResult(["Heads"]);
              else if (m.id === "dice") setPickedResult(["4", "6"]);
            }}
            className={`py-1.5 px-1 text-xs font-medium rounded transition-all text-center ${
              mode === m.id
                ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
                : "text-[#8B95AD] hover:text-[#E6EAF2]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Mode-specific Controls */}
      {(mode === "pick" || mode === "shuffle") && (
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#8B95AD]">
              <span>Enter Items / Names (One per line)</span>
              <span>{parsedItems.length} items</span>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={6}
              placeholder="Aarav&#10;Diya&#10;Ishaan..."
              className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE] resize-y"
            />
          </div>

          {mode === "pick" && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#8B95AD]">Number of winners to pick:</span>
              <input
                type="number"
                min={1}
                max={Math.max(1, parsedItems.length)}
                value={pickCount}
                onChange={(e) => setPickCount(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2.5 py-1 text-center font-mono bg-[#121828] border border-[#232C42] rounded text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          )}
        </div>
      )}

      {mode === "dice" && (
        <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-3 text-xs">
          <div className="space-y-1.5">
            <span className="text-[#8B95AD]">Dice Type:</span>
            <div className="flex gap-2">
              {[6, 12, 20, 100].map((sides) => (
                <button
                  key={sides}
                  type="button"
                  onClick={() => setDiceSides(sides)}
                  className={`px-3 py-1 rounded border font-mono ${
                    diceSides === sides
                      ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]"
                      : "bg-[#121828] border-[#232C42] text-[#8B95AD]"
                  }`}
                >
                  D{sides}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8B95AD]">Number of Dice:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={diceCount}
              onChange={(e) => setDiceCount(Math.max(1, Number(e.target.value)))}
              className="w-16 px-2 py-1 text-center font-mono bg-[#121828] border border-[#232C42] rounded text-[#E6EAF2]"
            />
          </div>
        </div>
      )}

      {/* Main Action Button */}
      <button
        type="button"
        onClick={handleAction}
        className="w-full py-2.5 px-4 rounded-lg bg-[#22D3EE] text-[#0B0F1A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#22D3EE]/90 transition-all shadow-lg shadow-[#22D3EE]/10"
      >
        <RefreshCw className="w-4 h-4" />
        <span>
          {mode === "pick"
            ? `Pick ${pickCount} Random Winner(s)`
            : mode === "shuffle"
            ? "Shuffle List Now"
            : mode === "coin"
            ? "Flip Coin"
            : `Roll ${diceCount} D${diceSides} Dice`}
        </span>
      </button>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Big Result Card */}
      <div className="p-5 rounded-xl bg-[#121828] border border-[#232C42] text-center space-y-3">
        <div className="text-xs text-[#8B95AD] uppercase tracking-wider font-medium flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#22D3EE]" />
          <span>
            {mode === "pick"
              ? "Selected Winner(s)"
              : mode === "shuffle"
              ? "Shuffled Order"
              : mode === "coin"
              ? "Coin Result"
              : "Dice Outcome"}
          </span>
        </div>

        {mode === "coin" ? (
          <div className="text-5xl font-black font-mono text-[#22D3EE] py-4">
            🪙 {pickedResult[0]}
          </div>
        ) : mode === "dice" ? (
          <div className="space-y-2 py-2">
            <div className="flex justify-center gap-3">
              {pickedResult.map((val, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 rounded-xl bg-[#0B0F1A] border-2 border-[#22D3EE] flex items-center justify-center text-2xl font-black font-mono text-[#22D3EE]"
                >
                  {val}
                </div>
              ))}
            </div>
            <div className="text-xs text-[#8B95AD]">
              Total Sum:{" "}
              <span className="font-bold text-[#E6EAF2]">
                {pickedResult.reduce((a, b) => a + Number(b), 0)}
              </span>
            </div>
          </div>
        ) : (
          <div className="max-h-56 overflow-y-auto space-y-1.5 text-left p-2 bg-[#0B0F1A] rounded-lg border border-[#232C42]">
            {pickedResult.map((item, idx) => (
              <div
                key={idx}
                className="py-1.5 px-3 rounded bg-[#121828] border border-[#232C42]/60 text-sm font-medium text-[#E6EAF2] flex items-center justify-between"
              >
                <span>
                  {mode === "pick" && <span className="text-[#22D3EE] font-bold mr-2">#{idx + 1}</span>}
                  {item}
                </span>
                {mode === "pick" && idx === 0 && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    Winner
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy Result"}
        </button>
      </div>

      {/* CSPRNG Notice */}
      <div className="p-3.5 rounded-xl bg-[#0B0F1A] border border-[#232C42] text-xs text-[#8B95AD] flex items-start gap-2">
        <Dices className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
        <div>
          Powered by browser Web Crypto API (crypto.getRandomValues). Generates mathematically unbiased, cryptographically secure random selections.
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="random-picker"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={handleAction}
    />
  );
}
