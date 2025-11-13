"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  addEdge,
  type Node as RFNode,
  type Edge as RFEdge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import type { Graph } from "@/lib/workflows/types";

type Props = {
  graph: Graph;
  onChange: (g: Graph) => void;
  onSelectNode?: (id: string | null) => void;
};

const toRF = (graph: Graph): { nodes: RFNode[]; edges: RFEdge[] } => {
  const nodes: RFNode[] = graph.nodes.map((n) => ({
    id: n.id,
    type: "default",
    position: n.position,
    data: { label: n.label, type: n.type, config: n.config },
  }));
  const edges: RFEdge[] = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    data: { condition: e.condition },
  }));
  return { nodes, edges };
};

const fromRF = (nodes: RFNode[], edges: RFEdge[]): Graph => {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: (n.data as any)?.type || "default",
      label: (n.data as any)?.label || "",
      position: n.position,
      config: (n.data as any)?.config ?? {},
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? undefined,
      targetHandle: e.targetHandle ?? undefined,
      condition: (e.data as any)?.condition,
    })),
  };
};

export default function FlowCanvas({ graph, onChange, onSelectNode }: Props) {
  const initial = useMemo(() => toRF(graph), [graph]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

  useEffect(() => {
    // Sync external graph into RF state on load or when replaced
    const next = toRF(graph);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [graph, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge({ ...connection, id: crypto.randomUUID() }, edges);
      setEdges(newEdges);
      onChange(fromRF(nodes, newEdges));
    },
    [edges, nodes, onChange, setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      const nextNodes = nodes.map((n) => {
        const ch = changes.find((c: any) => c.id === n.id && c.type === "position");
        if (ch?.position) {
          return { ...n, position: ch.position };
        }
        return n;
      });
      onChange(fromRF(nextNodes, edges));
    },
    [onNodesChange, nodes, edges, onChange]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      onChange(fromRF(nodes, edges));
    },
    [onEdgesChange, nodes, edges, onChange]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: RFNode[] }) => {
      onSelectNode?.(selectedNodes?.[0]?.id ?? null);
    },
    [onSelectNode]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}


