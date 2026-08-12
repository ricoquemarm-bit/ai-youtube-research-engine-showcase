import { readFile } from "node:fs/promises";

const path = new URL("../sample-workflow/opportunity-scoring-demo.json", import.meta.url);
const workflow = JSON.parse(await readFile(path, "utf8"));
if (!workflow.name || !workflow.nodes?.length || !workflow.connections) throw new Error("Invalid workflow export");
const names = new Set();
for (const node of workflow.nodes) {
  if (!node.name || !node.type || !node.typeVersion || !Array.isArray(node.position)) throw new Error("Invalid node");
  if (names.has(node.name)) throw new Error(`Duplicate node: ${node.name}`);
  names.add(node.name);
  if (node.type === "n8n-nodes-base.code") new Function(node.parameters.jsCode);
}
const text = JSON.stringify(workflow);
for (const pattern of [/ghp_[A-Za-z0-9]{20,}/, /github_pat_/, /sk-[A-Za-z0-9_-]{20,}/, /https:\/\/hooks\.slack\.com\/services\//]) {
  if (pattern.test(text)) throw new Error("Possible secret detected");
}
console.log(`Validated public sample: ${workflow.nodes.length} nodes, no credentials`);

