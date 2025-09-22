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
    { id: "A", label: "Rua A", x: 0.10, y: 0.15 },
    { id: "B", label: "Rua B", x: 0.30, y: 0.30 },
    { id: "C", label: "Rua C", x: 0.55, y: 0.25 },
    { id: "D", label: "Rua D", x: 0.80, y: 0.20 },
    { id: "E", label: "Rua E", x: 0.40, y: 0.65 },
    { id: "F", label: "Rua F", x: 0.75, y: 0.70 },
  ],
  edges: [
    { id: "A-B", from: "A", to: "B", distance: 2.0 },
    { id: "B-C", from: "B", to: "C", distance: 2.3 },
    { id: "C-D", from: "C", to: "D", distance: 2.0 },
    { id: "B-E", from: "B", to: "E", distance: 3.0 },
    { id: "E-F", from: "E", to: "F", distance: 2.6 },
    { id: "C-F", from: "C", to: "F", distance: 3.2 },
    { id: "D-F", from: "D", to: "F", distance: 2.1 },
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
