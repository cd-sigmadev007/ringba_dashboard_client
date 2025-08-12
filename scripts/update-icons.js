import axios from "axios";
import fs from "fs-extra";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || "process.env.FIGMA_TOKEN || """;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "2inM9gTGhpchpxmqGYPHV2";
const FIGMA_PAGE_NAME = process.env.FIGMA_PAGE_NAME || "Page 1";


const SVG_DIR = "src/svg";
const ICON_DIR = "src/icons";

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error("❌ Missing FIGMA_TOKEN or FIGMA_FILE_KEY in .env");
  process.exit(1);
}

const log = (msg) => console.log(`\x1b[36m${msg}\x1b[0m`);

function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function toKebabCase(str) {
  return str
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
}

async function fetchFigmaFile() {
  const res = await axios.get(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
    { headers: { "X-Figma-Token": FIGMA_TOKEN } }
  );
  return res.data;
}

function findPageNode(node, pageName) {
  if (node.type === "CANVAS" && node.name === pageName) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findPageNode(child, pageName);
    if (found) return found;
  }
  return null;
}

async function fetchSvgUrl(nodeId) {
  const res = await axios.get(
    `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeId}&format=svg`,
    { headers: { "X-Figma-Token": FIGMA_TOKEN } }
  );
  return res.data.images[nodeId];
}

async function downloadSvg(nodeId, name) {
  const svgUrl = await fetchSvgUrl(nodeId);
  const svgData = await axios.get(svgUrl, { responseType: "text" });
  await fs.outputFile(`${SVG_DIR}/${name}.svg`, svgData.data);
}

async function run() {
  log("🔍 Fetching Figma file...");
  const file = await fetchFigmaFile();

  log(`📄 Looking for page: ${FIGMA_PAGE_NAME}`);
  const pageNode = findPageNode(file.document, FIGMA_PAGE_NAME);
  if (!pageNode || !pageNode.children) {
    console.error(`❌ Page "${FIGMA_PAGE_NAME}" not found in Figma file`);
    process.exit(1);
  }

  const iconNodes = pageNode.children.filter((n) => n.type === "COMPONENT");
  log(`🎯 Found ${iconNodes.length} icons`);

  await fs.emptyDir(SVG_DIR);
  await fs.ensureDir(ICON_DIR);

  for (const icon of iconNodes) {
    const kebabName = toKebabCase(icon.name);
    log(`⬇️  Downloading ${icon.name}...`);
    await downloadSvg(icon.id, kebabName);
  }

  log("⚙️  Converting SVGs to React components...");
  execSync(`npx @svgr/cli --typescript --icon --out-dir ${ICON_DIR} ${SVG_DIR}`, {
    stdio: "inherit",
  });

  log("🗂  Generating index.js...");
  const files = await fs.readdir(ICON_DIR);
  const exports = files
    .filter((f) => f.endsWith(".tsx") || f.endsWith(".jsx"))
    .map((f) => {
      const base = f.replace(/\.(tsx|jsx)$/, "");
      return `export { default as ${toPascalCase(base)} } from "./${base}";`;
    })
    .join("\n");

  await fs.outputFile(`${ICON_DIR}/index.js`, exports);

  log("✅ Icons updated successfully!");
}

run().catch((err) => {
  console.error("❌ Error updating icons:", err);
  process.exit(1);
});
