"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Graph, NodeInstance, EdgeInstance } from "@/lib/workflows/types";

export type BuilderState = {
  graph: Graph;
  selectedNodeId: string | null;
  setGraph: (g: Graph) => void;
  selectNode: (id: string | null) => void;
  updateNode: (id: string, update: Partial<NodeInstance>) => void;
  addNode: (node: NodeInstance) => void;
  addEdge: (edge: EdgeInstance) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
};

export const useBuilderStore = create<BuilderState>()(
  devtools((set, get) => ({
    graph: { nodes: [], edges: [] },
    selectedNodeId: null,
    setGraph: (g) => set({ graph: g }),
    selectNode: (id) => set({ selectedNodeId: id }),
    updateNode: (id, update) =>
      set((s) => ({
        graph: {
          ...s.graph,
          nodes: s.graph.nodes.map((n) => (n.id === id ? { ...n, ...update } : n)),
        },
      })),
    addNode: (node) =>
      set((s) => ({
        graph: { ...s.graph, nodes: [...s.graph.nodes, node] },
      })),
    addEdge: (edge) =>
      set((s) => ({
        graph: { ...s.graph, edges: [...s.graph.edges, edge] },
      })),
    removeNode: (id) =>
      set((s) => ({
        graph: {
          nodes: s.graph.nodes.filter((n) => n.id !== id),
          edges: s.graph.edges.filter((e) => e.source !== id && e.target !== id),
        },
      })),
    removeEdge: (id) =>
      set((s) => ({
        graph: { ...s.graph, edges: s.graph.edges.filter((e) => e.id !== id) },
      })),
  }))
);


