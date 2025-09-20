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

export default function PathFinderComponent() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Caminho mínimo com Dijkstra</h1>
        <p className="mt-2 text-sm text-slate-600">
          Selecione o ponto de partida e de chegada (menus ou clique nos nós).
        </p>
      </div>
    </div>
  );
}