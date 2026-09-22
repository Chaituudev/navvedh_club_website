import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const failures = [];
const warnings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const sourceFiles = walk(src).filter((file) => /\.(ts|tsx)$/.test(file));
const appDir = path.join(src, "app");
const pageFiles = walk(appDir).filter((file) => /page\.tsx$/.test(file));

const routes = pageFiles.map((file) => {
  const relative = path.relative(appDir, path.dirname(file)).replaceAll(path.sep, "/");
  return relative === "." ? "/" : `/${relative}`;
});

function routeExists(href) {
  if (href === "/") return routes.includes("/");
  const clean = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  if (routes.includes(clean)) return true;
  return routes.some((route) => {
    const pattern = route
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\\\[\\\.\\\.\\\.[^\]]+\\\]/g, ".+")
      .replace(/\\\[[^\]]+\\\]/g, "[^/]+");
    return new RegExp(`^${pattern}$`).test(clean);
  });
}

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);

  if (/href\s*=\s*["']#["']/.test(text)) failures.push(`${rel}: contains href="#"`);
  if (/action\s*=\s*["']#["']/.test(text)) failures.push(`${rel}: contains action="#"`);
  if (/NEXT_PUBLIC_[A-Z0-9_]*(SECRET|SERVICE_ROLE|RESEND_API)/.test(text)) failures.push(`${rel}: appears to expose a server secret through NEXT_PUBLIC_`);

  const isClient = /^\s*["']use client["'];/m.test(text);
  if (isClient && /process\.env\.(SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY)/.test(text)) {
    failures.push(`${rel}: client component references a server secret`);
  }

  const isServerActionModule = /^\s*["']use server["'];/m.test(text);
  if (isServerActionModule) {
    const exportLines = text.split(/\r?\n/);
    exportLines.forEach((line, index) => {
      if (/^\s*export\b/.test(line) && !/^\s*export\s+async\s+function\b/.test(line)) {
        failures.push(`${rel}:${index + 1}: a \"use server\" module may only export async functions`);
      }
    });
  }

  for (const match of text.matchAll(/href\s*=\s*["'](\/[^"']*)["']/g)) {
    const href = match[1];
    if (!routeExists(href)) failures.push(`${rel}: unresolved internal href ${href}`);
  }

  for (const match of text.matchAll(/from\s+["']@\/([^"']+)["']/g)) {
    const base = path.join(src, match[1]);
    const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) failures.push(`${rel}: unresolved @/ import @/${match[1]}`);
  }

  if (/\bTODO\b|\bFIXME\b/.test(text)) warnings.push(`${rel}: contains TODO/FIXME`);
}

console.log(`Static QA scanned ${sourceFiles.length} TypeScript/TSX source files and ${routes.length} app routes.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
if (failures.length) {
  console.error(`\nFailures (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Static QA passed: no dead hash links, leaked public secrets, client-side server secrets, invalid literal routes, invalid server-action exports, or obsolete server-action exports.");
