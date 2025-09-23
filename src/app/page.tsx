"use client";

import React, { useMemo, useState, useCallback } from "react";

export type Node = {
  id: string;
  label?: string;
  x: number; 
  y: number; 
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  distance: number; 
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

const SAMPLE_GRAPH: Graph = {
  nodes: [
    { id: "N1", label: "Nó 1", x: 0.12, y: 0.05 },
    { id: "N2", label: "Nó 2", x: 0.23, y: 0.18 },
    { id: "N3", label: "Nó 3", x: 0.45, y: 0.08 },
    { id: "N4", label: "Nó 4", x: 0.76, y: 0.11 },
    { id: "N5", label: "Nó 5", x: 0.89, y: 0.25 },
    { id: "N6", label: "Nó 6", x: 0.15, y: 0.33 },
    { id: "N7", label: "Nó 7", x: 0.35, y: 0.29 },
    { id: "N8", label: "Nó 8", x: 0.58, y: 0.22 },
    { id: "N9", label: "Nó 9", x: 0.81, y: 0.35 },
    { id: "N10", label: "Nó 10", x: 0.08, y: 0.48 },
    { id: "N11", label: "Nó 11", x: 0.29, y: 0.41 },
    { id: "N12", label: "Nó 12", x: 0.51, y: 0.38 },
    { id: "N13", label: "Nó 13", x: 0.72, y: 0.45 },
    { id: "N14", label: "Nó 14", x: 0.95, y: 0.51 },
    { id: "N15", label: "Nó 15", x: 0.02, y: 0.61 },
    { id: "N16", label: "Nó 16", x: 0.25, y: 0.59 },
    { id: "N17", label: "Nó 17", x: 0.48, y: 0.63 },
    { id: "N18", label: "Nó 18", x: 0.69, y: 0.61 },
    { id: "N19", label: "Nó 19", x: 0.88, y: 0.68 },
    { id: "N20", label: "Nó 20", x: 0.11, y: 0.72 },
    { id: "N21", label: "Nó 21", x: 0.3, y: 0.78 },
    { id: "N22", label: "Nó 22", x: 0.55, y: 0.7 },
    { id: "N23", label: "Nó 23", x: 0.74, y: 0.85 },
    { id: "N24", label: "Nó 24", x: 0.92, y: 0.81 },
    { id: "N25", label: "Nó 25", x: 0.07, y: 0.91 },
    { id: "N26", label: "Nó 26", x: 0.28, y: 0.95 },
    { id: "N27", label: "Nó 27", x: 0.49, y: 0.92 },
    { id: "N28", label: "Nó 28", x: 0.7, y: 0.98 },
    { id: "N29", label: "Nó 29", x: 0.85, y: 0.91 },
    { id: "N30", label: "Nó 30", x: 0.18, y: 0.82 },
    { id: "N31", label: "Nó 31", x: 0.4, y: 0.88 },
    { id: "N32", label: "Nó 32", x: 0.62, y: 0.8 },
    { id: "N33", label: "Nó 33", x: 0.8, y: 0.75 },
    { id: "N34", label: "Nó 34", x: 0.05, y: 0.18 },
    { id: "N35", label: "Nó 35", x: 0.2, y: 0.27 },
    { id: "N36", label: "Nó 36", x: 0.4, y: 0.15 },
    { id: "N37", label: "Nó 37", x: 0.6, y: 0.3 },
    { id: "N38", label: "Nó 38", x: 0.85, y: 0.4 },
    { id: "N39", label: "Nó 39", x: 0.1, y: 0.55 },
    { id: "N40", label: "Nó 40", x: 0.3, y: 0.65 },
    { id: "N41", label: "Nó 41", x: 0.5, y: 0.58 },
    { id: "N42", label: "Nó 42", x: 0.7, y: 0.52 },
    { id: "N43", label: "Nó 43", x: 0.9, y: 0.65 },
    { id: "N44", label: "Nó 44", x: 0.22, y: 0.75 },
    { id: "N45", label: "Nó 45", x: 0.43, y: 0.79 },
    { id: "N46", label: "Nó 46", x: 0.65, y: 0.88 },
    { id: "N47", label: "Nó 47", x: 0.82, y: 0.95 },
    { id: "N48", label: "Nó 48", x: 0.05, y: 0.3 },
    { id: "N49", label: "Nó 49", x: 0.38, y: 0.52 },
    { id: "N50", label: "Nó 50", x: 0.68, y: 0.25 },
  ],
  edges: [
    { id: "N1-N2", from: "N1", to: "N2", distance: 1.2 },
    { id: "N2-N3", from: "N2", to: "N3", distance: 2.1 },
    { id: "N3-N4", from: "N3", to: "N4", distance: 1.8 },
    { id: "N4-N5", from: "N4", to: "N5", distance: 1.5 },
    { id: "N5-N9", from: "N5", to: "N9", distance: 1.3 },
    { id: "N6-N7", from: "N6", to: "N7", distance: 2.5 },
    { id: "N7-N8", from: "N7", to: "N8", distance: 1.9 },
    { id: "N8-N9", from: "N8", to: "N9", distance: 1.6 },
    { id: "N10-N11", from: "N10", to: "N11", distance: 2.8 },
    { id: "N11-N12", from: "N11", to: "N12", distance: 2.2 },
    { id: "N12-N13", from: "N12", to: "N13", distance: 1.7 },
    { id: "N13-N14", from: "N13", to: "N14", distance: 2.0 },
    { id: "N15-N16", from: "N15", to: "N16", distance: 1.4 },
    { id: "N16-N17", from: "N16", to: "N17", distance: 2.3 },
    { id: "N17-N18", from: "N17", to: "N18", distance: 1.8 },
    { id: "N18-N19", from: "N18", to: "N19", distance: 1.6 },
    { id: "N20-N21", from: "N20", to: "N21", distance: 2.7 },
    { id: "N21-N22", from: "N21", to: "N22", distance: 2.0 },
    { id: "N22-N23", from: "N22", to: "N23", distance: 1.9 },
    { id: "N23-N24", from: "N23", to: "N24", distance: 1.5 },
    { id: "N25-N26", from: "N25", to: "N26", distance: 1.3 },
    { id: "N26-N27", from: "N26", to: "N27", distance: 2.2 },
    { id: "N27-N28", from: "N27", to: "N28", distance: 1.7 },
    { id: "N28-N29", from: "N28", to: "N29", distance: 1.4 },
    { id: "N30-N31", from: "N30", to: "N31", distance: 2.6 },
    { id: "N31-N32", from: "N31", to: "N32", distance: 2.1 },
    { id: "N32-N33", from: "N32", to: "N33", distance: 1.8 },
    { id: "N34-N35", from: "N34", to: "N35", distance: 1.2 },
    { id: "N35-N36", from: "N35", to: "N36", distance: 1.9 },
    { id: "N36-N37", from: "N36", to: "N37", distance: 2.4 },
    { id: "N37-N38", from: "N37", to: "N38", distance: 1.6 },
    { id: "N39-N40", from: "N39", to: "N40", distance: 2.9 },
    { id: "N40-N41", from: "N40", to: "N41", distance: 2.1 },
    { id: "N41-N42", from: "N41", to: "N42", distance: 1.7 },
    { id: "N42-N43", from: "N42", to: "N43", distance: 1.5 },
    { id: "N44-N45", from: "N44", to: "N45", distance: 2.3 },
    { id: "N45-N46", from: "N45", to: "N46", distance: 1.8 },
    { id: "N46-N47", from: "N46", to: "N47", distance: 1.6 },
    { id: "N48-N49", from: "N48", to: "N49", distance: 2.5 },
    { id: "N49-N50", from: "N49", to: "N50", distance: 2.0 },
    { id: "N1-N34", from: "N1", to: "N34", distance: 1.4 },
    { id: "N6-N35", from: "N6", to: "N35", distance: 1.8 },
    { id: "N11-N16", from: "N11", to: "N16", distance: 2.2 },
    { id: "N22-N27", from: "N22", to: "N27", distance: 2.5 },
    { id: "N33-N47", from: "N33", to: "N47", distance: 1.9 },
    { id: "N40-N45", from: "N40", to: "N45", distance: 1.6 },
    { id: "N12-N49", from: "N12", to: "N49", distance: 2.3 },
    { id: "N18-N43", from: "N18", to: "N43", distance: 1.5 },
    { id: "N2-N7", from: "N2", to: "N7", distance: 1.7 },
    { id: "N8-N13", from: "N8", to: "N13", distance: 2.0 },
    { id: "N20-N48", from: "N20", to: "N48", distance: 2.8 },
    { id: "N21-N30", from: "N21", to: "N30", distance: 1.4 },
    { id: "N28-N32", from: "N28", to: "N32", distance: 1.9 },
    { id: "N36-N50", from: "N36", to: "N50", distance: 1.1 },
  ],
};
function buildAdjacency(graph: Graph): Record<string, { to: string; w: number; edgeId: string }[]> {
  const adj: Record<string, { to: string; w: number; edgeId: string }[]> = {};
  for (const n of graph.nodes) adj[n.id] = [];
  for (const e of graph.edges) {
    adj[e.from].push({ to: e.to, w: e.distance, edgeId: e.id });
    adj[e.to].push({ to: e.from, w: e.distance, edgeId: e.id });
  }
  return adj;
}

function dijkstra(graph: Graph, source: string, target: string) {
  const adj = buildAdjacency(graph);
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  for (const n of graph.nodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  }
  dist[source] = 0;

  const unvisited = new Set(graph.nodes.map((n) => n.id));
  while (unvisited.size > 0) {
    let u: string | null = null;
    let best = Infinity;
    for (const id of unvisited) {
      if (dist[id] < best) { best = dist[id]; u = id; }
    }
    if (u === null) break;
    unvisited.delete(u);
    if (u === target) break;

    for (const { to, w } of adj[u]) {
      if (!unvisited.has(to)) continue;
      const alt = dist[u] + w;
      if (alt < dist[to]) { dist[to] = alt; prev[to] = u; }
    }
  }

  const pathNodes: string[] = [];
  let cur: string | null = target;
  if (prev[cur] !== null || cur === source) {
    while (cur) { pathNodes.unshift(cur); cur = prev[cur]; }
  }

  const pathEdgeIds: string[] = [];
  for (let i = 0; i < pathNodes.length - 1; i++) {
    const a = pathNodes[i];
    const b = pathNodes[i + 1];
    const edge = SAMPLE_GRAPH.edges.find(
      (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a)
    );
    if (edge) pathEdgeIds.push(edge.id);
  }

  return { distance: dist[target], pathNodes, pathEdgeIds };
}

export default function Page() {
  const graph = SAMPLE_GRAPH;

  const [start, setStart] = useState<string>(graph.nodes[0]?.id ?? "");
  const [end, setEnd] = useState<string>(graph.nodes[graph.nodes.length - 1]?.id ?? "");

  const { distance, pathNodes, pathEdgeIds } = useMemo(() => {
    if (!start || !end) return { distance: Infinity, pathNodes: [], pathEdgeIds: [] };
    if (start === end) return { distance: 0, pathNodes: [start], pathEdgeIds: [] };
    return dijkstra(graph, start, end);
  }, [graph, start, end]);

  const nodeMap: Record<string, Node> = useMemo(
    () => Object.fromEntries(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes]
  );

  const [awaitingEnd, setAwaitingEnd] = useState(false);
  const handleNodeClick = useCallback((id: string) => {
    if (!awaitingEnd) { setStart(id); setAwaitingEnd(true); }
    else { setEnd(id); setAwaitingEnd(false); }
  }, [awaitingEnd]);

  const width = 900;
  const height = 520;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Caminho mínimo com Dijkstra</h1>
        <p className="mt-2 text-sm text-slate-600">
          Selecione o ponto de partida e de chegada (menus ou clique nos nós).
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700">Início</label>
            <select
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {graph.nodes.map((n) => (
                <option key={n.id} value={n.id}>{n.label ?? n.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Destino</label>
            <select
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {graph.nodes.map((n) => (
                <option key={n.id} value={n.id}>{n.label ?? n.id}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAwaitingEnd(false)}
              className="h-10 px-4 rounded-xl bg-slate-900 text-white font-medium shadow hover:opacity-90"
            >
              Modo clique: {awaitingEnd ? "Escolha o destino" : "Escolha o início"}
            </button>
            <button
              onClick={() => { setStart(graph.nodes[0].id); setEnd(graph.nodes[graph.nodes.length-1].id); setAwaitingEnd(false); }}
              className="h-10 px-4 rounded-xl border border-slate-300 bg-white font-medium shadow-sm hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-xs uppercase text-slate-500">Distância total</div>
              <div className="text-lg font-semibold">{Number.isFinite(distance) ? distance.toFixed(2) : "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-500">Sequência de nós</div>
              <div className="text-sm font-mono">{pathNodes.length ? pathNodes.join(" → ") : "—"}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[520px]">
            {graph.edges.map((e) => {
              const a = nodeMap[e.from];
              const b = nodeMap[e.to];
              const isOnPath = pathEdgeIds.includes(e.id);
              return (
                <g key={e.id}>
                  <line
                    x1={a.x * width}
                    y1={a.y * height}
                    x2={b.x * width}
                    y2={b.y * height}
                    stroke={isOnPath ? "#6366F1" : "#CBD5E1"}
                    strokeWidth={isOnPath ? 6 : 3}
                    strokeLinecap="round"
                  />
                  <text
                    x={(a.x * width + b.x * width) / 2}
                    y={(a.y * height + b.y * height) / 2 - 6}
                    textAnchor="middle"
                    className="fill-slate-600 text-xs"
                  >
                    {e.distance}
                  </text>
                </g>
              );
            })}

            {graph.nodes.map((n) => {
              const isStart = n.id === start;
              const isEnd = n.id === end;
              const onPath = pathNodes.includes(n.id);
              return (
                <g key={n.id} onClick={() => handleNodeClick(n.id)} className="cursor-pointer">
                  <circle
                    cx={n.x * width}
                    cy={n.y * height}
                    r={onPath ? 10 : 8}
                    fill={isStart ? "#10B981" : isEnd ? "#EF4444" : onPath ? "#6366F1" : "#0EA5E9"}
                    stroke="#0F172A"
                    strokeWidth={1.5}
                  />
                  <text x={n.x * width} y={n.y * height + 20} textAnchor="middle" className="fill-slate-700 text-sm">
                    {n.label ?? n.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-slate-600">Ver JSON do grafo</summary>
          <pre className="mt-2 max-h-80 overflow-auto rounded-xl bg-slate-900 p-4 text-slate-100 text-xs">
            {JSON.stringify(graph, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
