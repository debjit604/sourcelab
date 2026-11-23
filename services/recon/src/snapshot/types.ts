export type AssetFolder =
  | "html"
  | "css"
  | "js"
  | "images"
  | "fonts"
  | "docs"
  | "archives"
  | "other";

export interface SnapshotAsset {
  url: string;
  filename: string;
  folder: AssetFolder;
  size: number;
  contentType: string;
  data: Buffer;
}

export interface SourceMapRef {
  sourceUrl: string;
  mapUrl: string;
  data?: Buffer;
}

export interface SnapshotJobOptions {
  url: string;
  captureScreenshots?: boolean;
  collectAssets?: boolean;
  crawlPages?: boolean;
  ignoreRobots?: boolean;
  maxPages?: number; // default: 25
  maxDepth?: number; // default: 2
  jobTimeoutMs?: number; // default: 30_000
}

export interface SnapshotResult {
  targetUrl: string;
  rawHtml: string;
  renderedDom: string;
  screenshots: {
    desktop?: Buffer;
    mobile?: Buffer;
  };
  assets: SnapshotAsset[];
  pagesVisited: string[];
  sourceMaps: SourceMapRef[];
  durationMs: number;
}
