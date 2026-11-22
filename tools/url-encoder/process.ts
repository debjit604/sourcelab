export type UrlMode = "encode_component" | "encode_full" | "decode";

export interface UrlProcessInput {
  text: string;
  mode?: UrlMode;
}

export interface UrlParam {
  key: string;
  value: string;
}

export interface UrlProcessOutput {
  result: string;
  params?: UrlParam[];
  stats: {
    inputLength: number;
    outputLength: number;
    mode: UrlMode;
    paramCount: number;
  };
}

export function extractQueryParams(urlStr: string): UrlParam[] {
  try {
    const questionIndex = urlStr.indexOf("?");
    const queryString = questionIndex !== -1 ? urlStr.slice(questionIndex + 1) : urlStr;

    if (!queryString.includes("=") && !queryString.includes("&")) {
      return [];
    }

    // Split on hash if present in query string
    const cleanQuery = queryString.split("#")[0];

    const searchParams = new URLSearchParams(cleanQuery);
    const params: UrlParam[] = [];

    searchParams.forEach((value, key) => {
      params.push({ key, value });
    });

    return params;
  } catch {
    return [];
  }
}

export function processUrl(input: UrlProcessInput): UrlProcessOutput {
  const raw = input.text ?? "";
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new Error("URL input khali hai. Kripya pehle text ya link daalein.");
  }

  const mode = input.mode || "encode_component";
  let result = "";

  if (mode === "encode_component") {
    result = encodeURIComponent(trimmed);
  } else if (mode === "encode_full") {
    result = encodeURI(trimmed);
  } else if (mode === "decode") {
    try {
      result = decodeURIComponent(trimmed);
    } catch (err: unknown) {
      throw new Error(
        `Invalid percent-encoded string mila: ${err instanceof Error ? err.message : "URI malformed"}. Kripya check karein ki '%' ke baad valid hex characters hain.`
      );
    }
  }

  const params = extractQueryParams(mode === "decode" ? result : trimmed);

  return {
    result,
    params: params.length > 0 ? params : undefined,
    stats: {
      inputLength: raw.length,
      outputLength: result.length,
      mode,
      paramCount: params.length,
    },
  };
}

export const process = processUrl;
