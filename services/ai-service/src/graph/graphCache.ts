// Short-lived cache so a single conversation's back-and-forth tool calls
// don't each pay to rebuild the graph — not a substitute for real staleness
// tracking, just cheap insurance against redundant work within a request burst.

import { listProjectFilesWithContent } from "../clients/contextClients";
import { buildImportGraph, ImportGraph } from "./importGraph";

const TTL_MS = 30_000;

const cache = new Map<string, { graph: ImportGraph; expiresAt: number }>();

export async function getImportGraph(
  projectId: string,
  userEmail: string,
): Promise<ImportGraph> {
  const key = `${projectId}:${userEmail}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.graph;
  }

  const files = await listProjectFilesWithContent(projectId, userEmail);
  const graph = buildImportGraph(files);
  cache.set(key, { graph, expiresAt: Date.now() + TTL_MS });
  return graph;
}
