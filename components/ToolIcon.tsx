import React from "react";
import {
  Binary,
  Braces,
  Calculator,
  Code,
  FileText,
  Hash,
  Headphones,
  Image as ImageIcon,
  KeyRound,
  Landmark,
  Link2,
  QrCode,
  ScanText,
  ShieldCheck,
  Sparkles,
  Type,
  Video,
  Wrench,
  LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  binary: Binary,
  braces: Braces,
  calculator: Calculator,
  code: Code,
  "file-text": FileText,
  hash: Hash,
  headphones: Headphones,
  image: ImageIcon,
  "key-round": KeyRound,
  landmark: Landmark,
  "link-2": Link2,
  "qr-code": QrCode,
  "scan-text": ScanText,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  type: Type,
  video: Video,
  wrench: Wrench,
};

export function ToolIcon({
  name,
  className,
  ...props
}: { name: string; className?: string } & LucideProps) {
  const IconComponent = ICON_MAP[name] || Wrench;
  return <IconComponent className={className} {...props} />;
}
