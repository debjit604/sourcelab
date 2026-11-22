import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const toolComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  "json-formatter": dynamic(() => import("@/tools/json-formatter")),
  "base64": dynamic(() => import("@/tools/base64")),
  "url-encoder": dynamic(() => import("@/tools/url-encoder")),
  "jwt-decoder": dynamic(() => import("@/tools/jwt-decoder")),
  "hash-generator": dynamic(() => import("@/tools/hash-generator")),
  "password-generator": dynamic(() => import("@/tools/password-generator")),
  "word-counter": dynamic(() => import("@/tools/word-counter")),
  "qr-code": dynamic(() => import("@/tools/qr-code")),
  "emi-calculator": dynamic(() => import("@/tools/emi-calculator")),
  "image-compress": dynamic(() => import("@/tools/image-compress")),
  "case-converter": dynamic(() => import("@/tools/case-converter")),
  "uuid-generator": dynamic(() => import("@/tools/uuid-generator")),
};
