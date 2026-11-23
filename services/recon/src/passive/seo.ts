export interface SeoAuditResult {
  title?: string;
  description?: string;
  canonical?: string;
  hasViewport: boolean;
  isHttps: boolean;
  h1Count: number;
  h1Text?: string;
  h2Count: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  openGraph: Record<string, string>;
  warnings: string[];
}

export function auditSeo(html: string, pageUrl: string): SeoAuditResult {
  const warnings: string[] = [];
  const openGraph: Record<string, string> = {};

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : undefined;
  if (!title) {
    warnings.push("Missing <title> tag.");
  } else if (title.length > 65) {
    warnings.push(`Title tag is ${title.length} characters long (recommended: <= 65).`);
  }

  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : undefined;
  if (!description) {
    warnings.push("Missing meta description tag.");
  } else if (description.length > 160) {
    warnings.push(`Meta description is ${description.length} characters long (recommended: <= 160).`);
  }

  // Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : undefined;

  // Viewport
  const hasViewport = /<meta\s+[^>]*name=["']viewport["']/i.test(html);
  if (!hasViewport) {
    warnings.push("Missing responsive <meta name='viewport'> tag.");
  }

  // HTTPS check
  const isHttps = pageUrl.startsWith("https://");
  if (!isHttps) {
    warnings.push("Site is served over insecure HTTP instead of HTTPS.");
  }

  // H1 and H2 counts
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  let h1Text: string | undefined;
  if (h1Count === 0) {
    warnings.push("Missing <h1> heading tag on page.");
  } else if (h1Count > 1) {
    warnings.push(`Multiple <h1> headings found (${h1Count}). Recommended: exactly one <h1> per page.`);
  } else {
    h1Text = h1Matches[0]?.replace(/<[^>]+>/g, "").trim();
  }

  const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h2Count = h2Matches.length;

  // Image alt check
  const imgMatches = html.match(/<img\s+[^>]*>/gi) || [];
  const imagesTotal = imgMatches.length;
  let imagesMissingAlt = 0;
  for (const img of imgMatches) {
    if (!/alt=["'][^"']*["']/i.test(img)) {
      imagesMissingAlt++;
    }
  }
  if (imagesMissingAlt > 0) {
    warnings.push(`${imagesMissingAlt} of ${imagesTotal} images are missing an alt description attribute.`);
  }

  // OpenGraph tags
  const ogMatches = html.matchAll(/<meta\s+property=["'](og:[^"']+)["']\s+content=["']([^"']*)["']/gi);
  for (const match of ogMatches) {
    openGraph[match[1]] = match[2];
  }

  return {
    title,
    description,
    canonical,
    hasViewport,
    isHttps,
    h1Count,
    h1Text,
    h2Count,
    imagesTotal,
    imagesMissingAlt,
    openGraph,
    warnings,
  };
}
