"use client";

import React, { useRef, useState, useCallback, KeyboardEvent, ClipboardEvent } from "react";
import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { matchFileType } from "@/lib/file-types";
import { cn } from "@/lib/utils";

export interface DropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  maxFiles?: number;
  camera?: boolean;
  onFiles: (files: File[]) => void;
  onReject?: (errorMsg: string) => void;
  label?: string;
  className?: string;
}

export function Dropzone({
  accept = "*",
  multiple = false,
  maxSizeMB = 25,
  maxFiles = 10,
  camera = false,
  onFiles,
  onReject,
  label = "Files yahan drop karo ya click karke choose karo",
  className,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndDispatch = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (!multiple && fileArray.length > 1) {
        onReject?.("Sirf ek file upload kar sakte ho.");
        return;
      }

      if (maxFiles && fileArray.length > maxFiles) {
        onReject?.(`Ek baar me sirf ${maxFiles} files select kar sakte ho.`);
        return;
      }

      const validFiles: File[] = [];

      for (const file of fileArray) {
        // Size validation
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
          onReject?.(
            `"${file.name}" ${maxSizeMB}MB se badi hai (${sizeMB.toFixed(1)}MB). Pehle resize karo.`
          );
          return;
        }

        // Type validation
        if (accept && accept !== "*" && !matchFileType(file, accept)) {
          onReject?.(`"${file.name}" ka format valid nahi hai. Allowed: ${accept}`);
          return;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onFiles(validFiles);
      }
    },
    [accept, multiple, maxSizeMB, maxFiles, onFiles, onReject]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndDispatch(e.dataTransfer.files);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    // Only capture paste when dropzone is focused
    if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      validateAndDispatch(e.clipboardData.files);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="File upload area"
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 rounded-[16px] border-2 border-dashed transition-all cursor-pointer select-none",
        "bg-[var(--sl-surface)] border-[var(--sl-border)] hover:border-[var(--sl-accent)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--sl-accent)] focus-visible:outline-offset-2",
        isDragOver && "border-[var(--sl-accent)] bg-[rgba(34,211,238,0.06)] shadow-[0_0_20px_rgba(34,211,238,0.2)]",
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndDispatch(e.target.files);
            // Reset input so same file can be re-selected
            e.target.value = "";
          }
        }}
      />

      {camera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndDispatch(e.target.files);
              e.target.value = "";
            }
          }}
        />
      )}

      <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
        <div className="p-3 rounded-full bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]">
          <Upload className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm md:text-base font-medium text-[var(--sl-text)]">{label}</p>
          <p className="text-xs text-[var(--sl-muted)]">
            Max size: {maxSizeMB}MB • {multiple ? `Up to ${maxFiles} files` : "Single file"} •{" "}
            <span className="text-[var(--sl-accent)] font-mono">100% Client-Side</span>
          </p>
        </div>
      </div>

      {camera && (
        <div
          className="flex items-center gap-3 mt-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.2)] border border-[var(--sl-border)] transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(255,255,255,0.05)] text-[var(--sl-text)] hover:bg-[rgba(255,255,255,0.1)] border border-[var(--sl-border)] transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>
        </div>
      )}
    </div>
  );
}
