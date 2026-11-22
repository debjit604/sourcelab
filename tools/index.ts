import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const toolComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  "json-formatter": dynamic(() => import("@/tools/json-formatter")),
  "base64": dynamic(() => import("@/tools/base64")),
};
