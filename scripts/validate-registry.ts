import { allTools } from "../registry/generated";
import { CATEGORIES } from "../registry/categories";

function validateRegistry() {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const tool of allTools) {
    // 1. ID uniqueness and format
    if (!tool.id || typeof tool.id !== "string") {
      errors.push(`Tool has missing or invalid id: ${JSON.stringify(tool)}`);
      continue;
    }
    if (ids.has(tool.id)) {
      errors.push(`Duplicate tool id found: "${tool.id}"`);
    }
    ids.add(tool.id);

    // 2. Slug uniqueness and format
    if (!tool.slug || typeof tool.slug !== "string" || !tool.slug.startsWith("/")) {
      errors.push(`[${tool.id}] Invalid slug: "${tool.slug}". Must start with "/".`);
    }
    if (slugs.has(tool.slug)) {
      errors.push(`Duplicate slug found: "${tool.slug}"`);
    }
    slugs.add(tool.slug);

    // 3. Category validity
    if (!CATEGORIES[tool.category]) {
      errors.push(`[${tool.id}] Invalid category: "${tool.category}".`);
    }

    // 4. SEO Constraints
    if (!tool.seo?.title || tool.seo.title.length > 65) {
      errors.push(
        `[${tool.id}] SEO title must be 1-65 chars. Current length: ${tool.seo?.title?.length ?? 0}`
      );
    }
    if (!tool.seo?.description || tool.seo.description.length > 160) {
      errors.push(
        `[${tool.id}] SEO description must be 1-160 chars. Current length: ${tool.seo?.description?.length ?? 0}`
      );
    }

    // 5. FAQ count
    if (!Array.isArray(tool.faq) || tool.faq.length < 4) {
      errors.push(`[${tool.id}] FAQ must have at least 4 items. Found: ${tool.faq?.length ?? 0}`);
    } else {
      for (let i = 0; i < tool.faq.length; i++) {
        const item = tool.faq[i];
        if (!item.q?.trim() || !item.a?.trim()) {
          errors.push(`[${tool.id}] FAQ #${i + 1} has empty question or answer.`);
        }
      }
    }

    // 6. Keywords non-empty
    if (!Array.isArray(tool.keywords) || tool.keywords.length === 0) {
      errors.push(`[${tool.id}] Keywords must be a non-empty array.`);
    }

    // 7. Engine check
    const validEngines = ["js", "canvas", "pdf-lib", "wasm", "ai"];
    if (!validEngines.includes(tool.engine)) {
      errors.push(`[${tool.id}] Invalid engine: "${tool.engine}".`);
    }

    // 8. Privacy check
    if (tool.privacy !== "client" && tool.privacy !== "server") {
      errors.push(`[${tool.id}] Privacy must be "client" or "server".`);
    }
  }

  // 9. Cross-reference: related and chainTo IDs must exist in registry
  for (const tool of allTools) {
    if (tool.related) {
      for (const relId of tool.related) {
        if (!ids.has(relId)) {
          errors.push(`[${tool.id}] Related tool "${relId}" does not exist in registry.`);
        }
      }
    }
    if (tool.chainTo) {
      for (const chainId of tool.chainTo) {
        if (!ids.has(chainId)) {
          errors.push(`[${tool.id}] ChainTo tool "${chainId}" does not exist in registry.`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ Registry Validation Failed with ${errors.length} error(s):`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`Registry OK: ${allTools.length} tools`);
}

validateRegistry();
